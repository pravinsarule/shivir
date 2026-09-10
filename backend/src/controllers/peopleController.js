import { pool } from "../config/db.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendAccountSetupEmail } from "../utils/emailService.js";

// GET /api/people - Get all users/people
export async function getPeople(req, res, next) {
  try {
    const result = await pool.query(
      `SELECT id, name, email, role, COALESCE(phone, '') as phone, COALESCE(city, '') as city, COALESCE(status, 'Active') as status, created_at 
       FROM users 
       ORDER BY id DESC`
    );

    return res.status(200).json({
      success: true,
      people: result.rows,
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/people - Create a new user/person, assign role, and send password setup email
export async function createPerson(req, res, next) {
  try {
    const { name, email, role, phone, city } = req.body;

    if (!name || !email || !role) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and role are required fields.",
      });
    }

    // Check if user already exists
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [
      email.toLowerCase().trim(),
    ]);

    if (existing.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "A user with this email address already exists.",
      });
    }

    // Generate secure random reset token (valid for 24 hours)
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Temporary random password placeholder until user sets password via link
    const tempPassword = crypto.randomBytes(16).toString("hex");
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const insertQuery = `
      INSERT INTO users (name, email, password, role, phone, city, status, reset_token, reset_token_expires)
      VALUES ($1, $2, $3, $4, $5, $6, 'Pending Setup', $7, $8)
      RETURNING id, name, email, role, phone, city, status, created_at
    `;

    const result = await pool.query(insertQuery, [
      name.trim(),
      email.toLowerCase().trim(),
      hashedPassword,
      role.trim(),
      phone ? phone.trim() : null,
      city ? city.trim() : null,
      resetToken,
      resetTokenExpires,
    ]);

    const createdUser = result.rows[0];

    // Construct setup link for frontend
    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const setupLink = `${clientUrl}/setup-password?token=${resetToken}&email=${encodeURIComponent(createdUser.email)}`;

    // Send email notification to user
    await sendAccountSetupEmail(createdUser.name, createdUser.email, createdUser.role, setupLink);

    return res.status(201).json({
      success: true,
      message: `Person added successfully! An account setup email with password link has been sent to ${createdUser.email}.`,
      person: createdUser,
      setupLink, // Included for convenient testing
    });
  } catch (error) {
    next(error);
  }
}
