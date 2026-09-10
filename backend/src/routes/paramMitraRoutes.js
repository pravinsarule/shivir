import express from "express";
import { pool } from "../config/db.js";
import crypto from "crypto";
import { sendDemoPaymentLinkEmail, sendInvitationCardEmail, sendPaymentLinkEmail } from "../utils/emailService.js";
import { createEasebuzzPaymentLink, isEasebuzzConfigured, verifyEasebuzzResponse } from "../utils/easebuzzService.js";
import { config } from "../config/index.js";

const router = express.Router();

// 1. PARAM MITRA DASHBOARD DATA
router.get("/dashboard", async (req, res, next) => {
  try {
    const paramMitraId = req.query.paramMitraId || 1; // Fallback or authenticated ID

    // Today's Sessions
    const todaySessions = await pool.query(
      `SELECT d.*, c.name as organiser_name, c.mobile as organiser_mobile
       FROM demo_sessions d
       LEFT JOIN contacts c ON d.contact_id = c.id
       WHERE d.param_mitra_id = $1 AND d.session_date = CURRENT_DATE
       ORDER BY d.start_time ASC`,
      [paramMitraId]
    );

    // Overdue Follow-ups
    const overdueFollowups = await pool.query(
      `SELECT f.*, c.name as contact_name, c.mobile
       FROM follow_ups f
       LEFT JOIN contacts c ON f.contact_id = c.id
       WHERE f.param_mitra_id = $1 AND f.due_date < NOW() AND f.status = 'Pending'
       ORDER BY f.due_date ASC`,
      [paramMitraId]
    );

    // Cards Overview
    const cardOverview = await pool.query(
      `SELECT * FROM card_books WHERE param_mitra_id = $1`,
      [paramMitraId]
    );

    // Pending Names Count
    const pendingNamesCount = await pool.query(
      `SELECT COUNT(*) as count FROM registrations WHERE param_mitra_id = $1 AND (registered_name IS NULL OR registered_name = '')`,
      [paramMitraId]
    );

    // Duties
    const duties = await pool.query(
      `SELECT * FROM duties WHERE param_mitra_id = $1 AND status != 'Completed'`,
      [paramMitraId]
    );

    const paymentSummary = await pool.query(
      `SELECT
        COUNT(*) FILTER (WHERE status = 'Pending')::int AS pending_count,
        COALESCE(SUM(amount) FILTER (WHERE status = 'Pending'), 0) AS pending_amount,
        COUNT(*) FILTER (WHERE status = 'Paid')::int AS paid_count,
        COALESCE(SUM(amount) FILTER (WHERE status = 'Paid'), 0) AS paid_amount
       FROM payment_links WHERE param_mitra_id = $1`,
      [paramMitraId]
    );

    return res.json({
      success: true,
      dashboard: {
        todaySessions: todaySessions.rows,
        overdueFollowups: overdueFollowups.rows,
        cardOverview: cardOverview.rows[0] || { assigned_count: 10, given_count: 4, returned_count: 1, in_hand_count: 5, lost_count: 0 },
        pendingNamesCount: parseInt(pendingNamesCount.rows[0]?.count || 0),
        duties: duties.rows,
        paymentSummary: paymentSummary.rows[0],
      },
    });
  } catch (error) {
    next(error);
  }
});

// 2. CONTACTS CRUD & SEARCH
router.get("/contacts", async (req, res, next) => {
  try {
    const { category, search } = req.query;
    let query = `SELECT c.*, u.name as sourced_by_name FROM contacts c LEFT JOIN users u ON c.sourced_by_id = u.id WHERE c.is_archived = FALSE AND c.category != 'Do-not-contact'`;
    const params = [];

    if (category && category !== "All") {
      params.push(category);
      query += ` AND c.category = $${params.length}`;
    }

    if (search) {
      params.push(`%${search}%`);
      query += ` AND (c.name ILIKE $${params.length} OR c.mobile ILIKE $${params.length} OR c.area ILIKE $${params.length})`;
    }

    query += ` ORDER BY c.id DESC`;

    const result = await pool.query(query, params);
    return res.json({ success: true, contacts: result.rows });
  } catch (error) {
    next(error);
  }
});

router.post("/contacts", async (req, res, next) => {
  try {
    const { name, mobile, email, area, category, designation, samaj, social_group, relationship_note, sourced_by_id } = req.body;

    if (!name || !mobile || (!config.paymentsEnabled && !email)) {
      return res.status(400).json({ success: false, message: config.paymentsEnabled ? "Name and mobile number are required." : "Name, mobile number, and email are required to send an invitation card." });
    }

    // Check duplicate mobile
    const existing = await pool.query(`SELECT id FROM contacts WHERE mobile = $1`, [mobile.trim()]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ success: false, message: "A contact with this mobile number already exists." });
    }

    const insertQuery = `
      INSERT INTO contacts (name, mobile, email, area, category, designation, samaj, social_group, relationship_note, sourced_by_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;

    const result = await pool.query(insertQuery, [
      name.trim(),
      mobile.trim(),
      email ? email.toLowerCase().trim() : null,
      area || "Delhi",
      category || "Warm",
      designation || "",
      samaj || "",
      social_group || "",
      relationship_note || "",
      sourced_by_id || 1,
    ]);

    const contact = result.rows[0];

    // Payment is intentionally disabled for the current campaign. A new
    // interested person receives a complimentary invitation card immediately.
    if (!config.paymentsEnabled && contact.email) {
      const tokenNumber = `TOK-${crypto.randomInt(100000, 1000000)}`;
      const cardNumber = `EC-${String(contact.id).padStart(5, "0")}`;
      const registrationResult = await pool.query(
        `INSERT INTO registrations (token_number, contact_id, param_mitra_id, card_type, card_number, amount, payment_mode, payment_status, registered_name)
         VALUES ($1, $2, $3, 'Entry Card', $4, 0, 'Complimentary', 'Paid', $5)
         RETURNING *`,
        [tokenNumber, contact.id, sourced_by_id || 1, cardNumber, contact.name]
      );
      const registration = registrationResult.rows[0];
      await pool.query(
        `UPDATE card_books SET given_count = given_count + 1, in_hand_count = GREATEST(in_hand_count - 1, 0) WHERE param_mitra_id = $1`,
        [sourced_by_id || 1]
      );
      const invitationUrl = `${config.clientUrl}/invitation/${encodeURIComponent(tokenNumber)}`;
      const demoPaymentUrl = `${config.clientUrl}/payment-demo/${encodeURIComponent(tokenNumber)}`;
      const deliveries = await Promise.allSettled([
        sendDemoPaymentLinkEmail({ name: contact.name, email: contact.email, demoPaymentUrl, tokenNumber }),
        sendInvitationCardEmail({ name: contact.name, email: contact.email, tokenNumber, invitationUrl }),
      ]);
      const emailSent = deliveries.every((delivery) => delivery.status === "fulfilled");
      if (!emailSent) console.error(`[Email Service] One or more registration emails failed for contact ${contact.id}.`);
      return res.status(201).json({ success: true, emailSent, contact, registration, invitationUrl, demoPaymentUrl, message: emailSent ? "Contact saved. Demo payment link and invitation card were sent by email." : "Contact and card were created, but one or more emails could not be delivered. Configure SMTP and resend the invitation." });
    }

    return res.status(201).json({ success: true, contact, message: "Contact saved successfully." });
  } catch (error) {
    next(error);
  }
});

router.post("/registrations/:registrationId/send-invitation", async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT r.id, r.token_number, r.registered_name, c.name AS contact_name, c.email
       FROM registrations r JOIN contacts c ON c.id = r.contact_id WHERE r.id = $1`,
      [req.params.registrationId]
    );
    const registration = result.rows[0];
    if (!registration) return res.status(404).json({ success: false, message: "Registration not found." });
    if (!registration.email) return res.status(400).json({ success: false, message: "This person has no email address." });
    const invitationUrl = `${config.clientUrl}/invitation/${encodeURIComponent(registration.token_number)}`;
    await sendInvitationCardEmail({ name: registration.registered_name || registration.contact_name, email: registration.email, tokenNumber: registration.token_number, invitationUrl });
    return res.json({ success: true, invitationUrl, message: "Invitation card email sent." });
  } catch (error) {
    next(error);
  }
});

router.patch("/contacts/:contactId/email", async (req, res, next) => {
  try {
    const email = req.body.email?.toLowerCase().trim();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ success: false, message: "Provide a valid email address." });
    }
    const result = await pool.query(`UPDATE contacts SET email = $1 WHERE id = $2 RETURNING *`, [email, req.params.contactId]);
    if (!result.rows[0]) return res.status(404).json({ success: false, message: "Contact not found." });
    return res.json({ success: true, contact: result.rows[0], message: "Contact email updated." });
  } catch (error) {
    next(error);
  }
});

// 3. EASEBUZZ PAYMENT LINKS
// Param Mitra supplies the amount. A hosted Easebuzz URL is emailed to the
// contact, and a token card is created only after a signed successful callback.
router.post("/payments/payment-links", async (req, res, next) => {
  try {
    if (!config.paymentsEnabled) {
      return res.status(403).json({ success: false, message: "Online payments are currently disabled. Contacts receive an invitation card directly." });
    }
    const { contact_id, param_mitra_id, amount, card_type, card_number, registered_name } = req.body;
    const numericAmount = Number(amount);
    if (!contact_id || !Number.isFinite(numericAmount) || numericAmount < 1) {
      return res.status(400).json({ success: false, message: "contact_id and an amount of at least ₹1 are required." });
    }
    if (!isEasebuzzConfigured()) {
      return res.status(503).json({ success: false, message: "Easebuzz is not configured. Set EASEBUZZ_MERCHANT_KEY and EASEBUZZ_SALT in .env." });
    }

    const contactResult = await pool.query(`SELECT id, name, mobile, email FROM contacts WHERE id = $1 AND is_archived = FALSE`, [contact_id]);
    const contact = contactResult.rows[0];
    if (!contact) return res.status(404).json({ success: false, message: "Contact not found." });
    if (!contact.email) return res.status(400).json({ success: false, message: "This contact needs an email address before a payment link can be sent." });

    const transactionId = `SH${Date.now()}${crypto.randomBytes(3).toString("hex")}`.slice(0, 40);
    const pending = await pool.query(
      `INSERT INTO payment_links (transaction_id, contact_id, param_mitra_id, amount, card_type, card_number, registered_name)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [transactionId, contact.id, param_mitra_id || 1, numericAmount.toFixed(2), card_type || "Entry Card", card_number || null, registered_name || contact.name]
    );
    const payment = pending.rows[0];
    const apiBaseUrl = config.publicApiUrl || `${req.protocol}://${req.get("host")}`;
    const callbackUrl = `${apiBaseUrl}/api/param-mitra/payments/easebuzz/callback`;

    try {
      const paymentUrl = await createEasebuzzPaymentLink({
        transactionId,
        paymentLinkId: payment.id,
        contactId: contact.id,
        amount: numericAmount,
        name: contact.name,
        email: contact.email,
        mobile: contact.mobile,
        successUrl: callbackUrl,
        failureUrl: callbackUrl,
      });
      await pool.query(`UPDATE payment_links SET payment_url = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`, [paymentUrl, payment.id]);
      await sendPaymentLinkEmail({ name: contact.name, email: contact.email, amount: numericAmount, paymentUrl, transactionId });
      return res.status(201).json({ success: true, payment: { ...payment, payment_url: paymentUrl }, message: `Payment link for ₹${numericAmount.toFixed(2)} was sent to ${contact.email}.` });
    } catch (error) {
      await pool.query(`UPDATE payment_links SET status = 'Failed', updated_at = CURRENT_TIMESTAMP WHERE id = $1`, [payment.id]);
      throw error;
    }
  } catch (error) {
    next(error);
  }
});

router.get("/registrations", async (req, res, next) => {
  try {
    const paramMitraId = req.query.paramMitraId || 1;
    const result = await pool.query(
      `SELECT r.*, c.name AS contact_name, c.mobile, c.email
       FROM registrations r JOIN contacts c ON c.id = r.contact_id
       WHERE r.param_mitra_id = $1 ORDER BY r.created_at DESC`,
      [paramMitraId]
    );
    return res.json({ success: true, registrations: result.rows });
  } catch (error) {
    next(error);
  }
});

router.get("/payments/payment-links", async (req, res, next) => {
  try {
    const paramMitraId = req.query.paramMitraId || 1;
    const result = await pool.query(
      `SELECT p.*, c.name AS contact_name, c.mobile, c.email, r.token_number
       FROM payment_links p
       JOIN contacts c ON c.id = p.contact_id
       LEFT JOIN registrations r ON r.id = p.registration_id
       WHERE p.param_mitra_id = $1 ORDER BY p.created_at DESC`,
      [paramMitraId]
    );
    return res.json({ success: true, payments: result.rows });
  } catch (error) {
    next(error);
  }
});

router.get("/payments/:transactionId", async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT p.transaction_id, p.amount, p.status, p.paid_at, r.token_number, r.card_number
       FROM payment_links p LEFT JOIN registrations r ON r.id = p.registration_id
       WHERE p.transaction_id = $1`,
      [req.params.transactionId]
    );
    if (!result.rows[0]) return res.status(404).json({ success: false, message: "Payment not found." });
    return res.json({ success: true, payment: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// This endpoint is intentionally public: the invitation email opens it without
// requiring the participant to have a staff account. It only exposes card data
// after a paid payment record exists.
router.get("/invitations/:tokenNumber", async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT r.token_number, r.card_type, r.card_number, r.registered_name, r.amount, r.created_at,
              c.name AS contact_name
       FROM registrations r
       LEFT JOIN payment_links p ON p.registration_id = r.id
       JOIN contacts c ON c.id = r.contact_id
       WHERE r.token_number = $1
         AND (r.payment_mode = 'Complimentary' OR p.status = 'Paid')`,
      [req.params.tokenNumber]
    );
    if (!result.rows[0]) return res.status(404).json({ success: false, message: "Invitation card not found or payment is pending." });
    return res.json({ success: true, invitation: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

router.post("/payments/easebuzz/callback", async (req, res, next) => {
  try {
    const response = req.body;
    if (!verifyEasebuzzResponse(response)) return res.status(400).send("Payment response could not be verified.");

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const paymentResult = await client.query(`SELECT * FROM payment_links WHERE transaction_id = $1 FOR UPDATE`, [response.txnid]);
      const payment = paymentResult.rows[0];
      if (!payment) {
        await client.query("ROLLBACK");
        return res.status(404).send("Payment reference not found.");
      }
      const successful = String(response.status).toLowerCase() === "success";
      const amountMatches = Number(response.amount).toFixed(2) === Number(payment.amount).toFixed(2);
      if (!amountMatches) {
        await client.query(`UPDATE payment_links SET status = 'Failed', easebuzz_response = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`, [JSON.stringify(response), payment.id]);
        await client.query("COMMIT");
        return res.status(400).send("Payment amount does not match the payment request.");
      }
      if (!successful) {
        await client.query(`UPDATE payment_links SET status = 'Failed', easebuzz_id = $1, easebuzz_response = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3`, [response.easepayid || null, JSON.stringify(response), payment.id]);
        await client.query("COMMIT");
        return res.status(200).send("Your payment was not completed. You may safely try the link again.");
      }

      let registrationId = payment.registration_id;
      let tokenNumber;
      if (!registrationId) {
        tokenNumber = `TOK-${crypto.randomInt(100000, 1000000)}`;
        const registration = await client.query(
          `INSERT INTO registrations (token_number, contact_id, param_mitra_id, card_type, card_number, amount, payment_mode, payment_status, registered_name)
           VALUES ($1, $2, $3, $4, $5, $6, 'Easebuzz', 'Paid', $7) RETURNING id, token_number`,
          [tokenNumber, payment.contact_id, payment.param_mitra_id, payment.card_type, payment.card_number, payment.amount, payment.registered_name]
        );
        registrationId = registration.rows[0].id;
        tokenNumber = registration.rows[0].token_number;
        await client.query(`UPDATE card_books SET given_count = given_count + 1, in_hand_count = GREATEST(in_hand_count - 1, 0) WHERE param_mitra_id = $1`, [payment.param_mitra_id]);
      } else {
        const registration = await client.query(`SELECT token_number FROM registrations WHERE id = $1`, [registrationId]);
        tokenNumber = registration.rows[0]?.token_number;
      }
      await client.query(
        `UPDATE payment_links SET status = 'Paid', easebuzz_id = $1, easebuzz_response = $2, registration_id = $3, paid_at = COALESCE(paid_at, CURRENT_TIMESTAMP), updated_at = CURRENT_TIMESTAMP WHERE id = $4`,
        [response.easepayid || null, JSON.stringify(response), registrationId, payment.id]
      );
      await client.query("COMMIT");
      const contactResult = await pool.query(`SELECT name, email FROM contacts WHERE id = $1`, [payment.contact_id]);
      const contact = contactResult.rows[0];
      if (contact?.email) {
        const invitationUrl = `${config.clientUrl}/invitation/${encodeURIComponent(tokenNumber)}`;
        await sendInvitationCardEmail({ name: contact.name, email: contact.email, tokenNumber, invitationUrl });
      }
      return res.status(200).send(`Payment successful. Your token card has been generated: ${tokenNumber}`);
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    next(error);
  }
});

// 4. AVAILABILITY CHECK & 15-MINUTE SOFT HOLD ENGINE
router.post("/availability/check", async (req, res, next) => {
  try {
    const { session_date, start_time, end_time, travel_buffer_minutes, requires_reiki, requires_vehicle_4w } = req.body;

    // Check Reiki Mitra availability if required
    if (requires_reiki) {
      const reikiMitras = await pool.query(`SELECT id, name FROM users WHERE is_reiki_skilled = TRUE AND status = 'Active'`);
      if (reikiMitras.rows.length === 0) {
        return res.json({
          available: false,
          reason: "No Reiki-skilled Param Mitra is available for the selected slot.",
        });
      }
    }

    // Check 4W Driver capability if vehicle is 4-wheeler
    if (requires_vehicle_4w) {
      const drivers = await pool.query(`SELECT id, name FROM users WHERE can_drive_4w = TRUE AND status = 'Active'`);
      if (drivers.rows.length === 0) {
        return res.json({
          available: false,
          reason: "No eligible 4-wheeler driver (e.g. Rohit Arija / Vidhi Chheta) is available for this route.",
        });
      }
    }

    // Calculate conflict windows with travel buffer
    const conflictCheck = await pool.query(
      `SELECT id FROM demo_sessions 
       WHERE session_date = $1 AND status IN ('HOLD', 'CONFIRMED')
       AND (start_time, end_time) OVERLAPS ($2::time, $3::time)`,
      [session_date, start_time, end_time]
    );

    if (conflictCheck.rows.length > 0) {
      return res.json({
        available: false,
        reason: "Resource conflict detected! Sound system or Mitra is already booked/held during this time + travel buffer window.",
      });
    }

    return res.json({
      available: true,
      travel_buffer: travel_buffer_minutes || 90,
      message: "All resources available! You can proceed to create a 15-Minute Soft Hold.",
    });
  } catch (error) {
    next(error);
  }
});

// 4. CREATE SOFT HOLD (15 MINUTES)
router.post("/bookings/hold", async (req, res, next) => {
  try {
    const { contact_id, param_mitra_id, session_type, session_date, start_time, end_time, expected_crowd, location, travel_buffer_minutes } = req.body;

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes hold

    const sessionRes = await pool.query(
      `INSERT INTO demo_sessions (contact_id, param_mitra_id, session_type, session_date, start_time, end_time, expected_crowd, location, travel_buffer_minutes, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'HOLD')
       RETURNING *`,
      [contact_id, param_mitra_id || 1, session_type, session_date, start_time, end_time, expected_crowd, location, travel_buffer_minutes || 90]
    );

    const session = sessionRes.rows[0];

    const holdRes = await pool.query(
      `INSERT INTO booking_holds (session_id, param_mitra_id, expires_at, status)
       VALUES ($1, $2, $3, 'ACTIVE')
       RETURNING *`,
      [session.id, param_mitra_id || 1, expiresAt]
    );

    return res.status(201).json({
      success: true,
      session,
      hold: holdRes.rows[0],
      expiresAt,
      message: "15-Minute Soft Hold created! Resources temporarily reserved.",
    });
  } catch (error) {
    next(error);
  }
});

// 5. CONFIRM BOOKING (FREE DEMO WORKSHOP)
router.post("/bookings/confirm", async (req, res, next) => {
  try {
    const { session_id } = req.body;

    await pool.query(`UPDATE demo_sessions SET status = 'CONFIRMED' WHERE id = $1`, [session_id]);
    await pool.query(`UPDATE booking_holds SET status = 'CONFIRMED' WHERE session_id = $1`, [session_id]);

    return res.json({
      success: true,
      message: "Demo Workshop Booking Confirmed! Free Demo is scheduled.",
    });
  } catch (error) {
    next(error);
  }
});

// 6. FOLLOW-UP CENTER
router.get("/followups", async (req, res, next) => {
  try {
    const paramMitraId = req.query.paramMitraId || 1;
    const result = await pool.query(
      `SELECT f.*, c.name as contact_name, c.mobile, c.area
       FROM follow_ups f
       LEFT JOIN contacts c ON f.contact_id = c.id
       WHERE f.param_mitra_id = $1
       ORDER BY f.due_date ASC`,
      [paramMitraId]
    );
    return res.json({ success: true, followups: result.rows });
  } catch (error) {
    next(error);
  }
});

router.post("/followups", async (req, res, next) => {
  try {
    const { contact_id, param_mitra_id, title, due_date, duration_minutes, notes } = req.body;

    const result = await pool.query(
      `INSERT INTO follow_ups (contact_id, param_mitra_id, title, due_date, duration_minutes, notes, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'Pending')
       RETURNING *`,
      [contact_id, param_mitra_id || 1, title || "Demo Workshop Follow-up", due_date, duration_minutes || 15, notes || ""]
    );

    return res.status(201).json({ success: true, followup: result.rows[0], message: "Follow-up scheduled." });
  } catch (error) {
    next(error);
  }
});

// 8. CARD REGISTRATION & TOKEN GENERATION (for non-online payment modes)
router.post("/registrations", async (req, res, next) => {
  try {
    const { contact_id, param_mitra_id, card_type, card_number, amount, payment_mode, registered_name } = req.body;

    const tokenNumber = `TOK-${Math.floor(100000 + Math.random() * 900000)}`;

    const result = await pool.query(
      `INSERT INTO registrations (token_number, contact_id, param_mitra_id, card_type, card_number, amount, payment_mode, payment_status, registered_name)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        tokenNumber,
        contact_id,
        param_mitra_id || 1,
        card_type || "Entry Card",
        card_number || "EC-1001",
        amount || 500.0,
        payment_mode || "Cash",
        payment_mode === "On Credit" ? "Pending" : "Paid",
        registered_name || "",
      ]
    );

    // Update Card Book Balances
    await pool.query(
      `UPDATE card_books SET given_count = given_count + 1, in_hand_count = GREATEST(in_hand_count - 1, 0) WHERE param_mitra_id = $1`,
      [param_mitra_id || 1]
    );

    return res.status(201).json({
      success: true,
      registration: result.rows[0],
      message: `Registration complete! Token ${tokenNumber} generated.`,
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/param-mitra/registrations/:registrationId
// Deletes a generated invitation/entry card and restores card-book balance.
router.delete("/registrations/:registrationId", async (req, res, next) => {
  const client = await pool.connect();

  try {
    const registrationId = Number(req.params.registrationId);

    if (!Number.isInteger(registrationId) || registrationId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid registration ID.",
      });
    }

    await client.query("BEGIN");

    // Get registration before deleting it
    const registrationResult = await client.query(
      `
      SELECT
        id,
        token_number,
        card_number,
        param_mitra_id,
        contact_id,
        payment_mode,
        payment_status
      FROM registrations
      WHERE id = $1
      FOR UPDATE
      `,
      [registrationId]
    );

    const registration = registrationResult.rows[0];

    if (!registration) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        success: false,
        message: "Generated card/registration not found.",
      });
    }

    // Delete related payment-link references first.
    // This prevents FK constraint problems if payment_links
    // references registrations.
    await client.query(
      `
      UPDATE payment_links
      SET registration_id = NULL,
          updated_at = CURRENT_TIMESTAMP
      WHERE registration_id = $1
      `,
      [registrationId]
    );

    // Delete the generated card/registration
    await client.query(
      `
      DELETE FROM registrations
      WHERE id = $1
      `,
      [registrationId]
    );

    // Restore card book balance
    await client.query(
      `
      UPDATE card_books
      SET
        given_count = GREATEST(given_count - 1, 0),
        in_hand_count = in_hand_count + 1
      WHERE param_mitra_id = $1
      `,
      [registration.param_mitra_id]
    );

    await client.query("COMMIT");

    return res.json({
      success: true,
      message: "Generated card deleted successfully.",
      deletedCard: {
        registrationId: registration.id,
        tokenNumber: registration.token_number,
        cardNumber: registration.card_number,
      },
    });

  } catch (error) {
    await client.query("ROLLBACK");
    next(error);
  } finally {
    client.release();
  }
});

// 8. SHIVIR-DAY VERIFICATION
router.get("/registrations/verify", async (req, res, next) => {
  try {
    const { search } = req.query;
    if (!search) {
      return res.status(400).json({ success: false, message: "Provide token, mobile, or name to verify." });
    }

    const result = await pool.query(
      `SELECT r.*, c.name as contact_name, c.mobile
       FROM registrations r
       LEFT JOIN contacts c ON r.contact_id = c.id
       WHERE r.token_number ILIKE $1 OR c.mobile ILIKE $1 OR r.registered_name ILIKE $1 OR r.card_number ILIKE $1`,
      [`%${search}%`]
    );

    return res.json({ success: true, registrations: result.rows });
  } catch (error) {
    next(error);
  }
});

export default router;
