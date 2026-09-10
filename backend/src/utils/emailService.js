import nodemailer from "nodemailer";

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
  }[character]));
}

function emailLayout(title, content) {
  return `<!doctype html><html><body style="margin:0;background:#f8fafc;font-family:Arial,sans-serif;color:#1e293b">
    <div style="max-width:600px;margin:24px auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:14px;overflow:hidden">
      <div style="padding:22px 28px;background:#0f172a;text-align:center"><div style="color:#fbbf24;font-size:12px;font-weight:bold;letter-spacing:1.5px">SUN TO HUMAN FOUNDATION</div><h1 style="color:#ffffff;font-size:21px;margin:8px 0 0">${title}</h1></div>
      <div style="padding:28px">${content}</div>
      <div style="padding:16px 28px;border-top:1px solid #e2e8f0;color:#64748b;font-size:12px;text-align:center">Shivir Management System</div>
    </div></body></html>`;
}

function getTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    throw new Error("Email is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER and SMTP_PASS in backend/.env.");
  }
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

async function sendEmail({ to, subject, html }) {
  const transporter = getTransporter();
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const info = await transporter.sendMail({ from: `"Shivir Management System" <${from}>`, to, subject, html });
  console.log(`[Email Service] Email accepted for ${to}: ${info.messageId}`);
  return { success: true, messageId: info.messageId };
}

export async function verifyEmailConfiguration() {
  const transporter = getTransporter();
  await transporter.verify();
  return { success: true };
}

export function sendAccountSetupEmail(name, email, role, setupLink) {
  return sendEmail({
    to: email,
    subject: "Set up your Shivir account",
    html: emailLayout("Set up your account", `<p>Hello <strong>${escapeHtml(name)}</strong>,</p><p>You have been assigned the <strong>${escapeHtml(role)}</strong> role.</p><p><a href="${setupLink}" style="display:inline-block;background:#f59e0b;color:#111827;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:bold">Set up password</a></p><p style="font-size:12px;color:#64748b">This link expires in 24 hours.</p>`),
  });
}

export function sendPaymentLinkEmail({ name, email, amount, paymentUrl, transactionId }) {
  return sendEmail({
    to: email,
    subject: `Shivir payment link - ₹${Number(amount).toFixed(2)}`,
    html: emailLayout("Complete your Shivir payment", `<p>Hello <strong>${escapeHtml(name)}</strong>,</p><p>Your payable amount is <strong>₹${Number(amount).toFixed(2)}</strong>.</p><p><a href="${paymentUrl}" style="display:inline-block;background:#f59e0b;color:#111827;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:bold">Pay securely</a></p><p style="font-size:12px;color:#64748b">Reference: ${escapeHtml(transactionId)}</p>`),
  });
}

export function sendDemoPaymentLinkEmail({ name, email, demoPaymentUrl, tokenNumber }) {
  return sendEmail({
    to: email,
    subject: "Shivir payment link (demo)",
    html: emailLayout("Demo payment link", `<p>Hello <strong>${escapeHtml(name)}</strong>,</p><p>This is a <strong>test payment link</strong> for your Shivir registration. No money will be charged.</p><p style="text-align:center"><a href="${demoPaymentUrl}" style="display:inline-block;background:#f59e0b;color:#111827;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:bold">Open demo payment link</a></p><p style="font-size:12px;color:#64748b">Reference token: ${escapeHtml(tokenNumber)}</p>`),
  });
}

export function sendInvitationCardEmail({ name, email, tokenNumber, invitationUrl }) {
  return sendEmail({
    to: email,
    subject: "Your Shivir invitation card is ready",
    html: emailLayout("Your invitation card is ready", `<p>Hello <strong>${escapeHtml(name)}</strong>,</p><p>Your entry invitation card has been created.</p><div style="margin:20px 0;padding:16px;background:#fffbeb;border:1px dashed #f59e0b;border-radius:10px;text-align:center"><div style="font-size:11px;color:#92400e;font-weight:bold;letter-spacing:1px">ENTRY TOKEN</div><div style="font-family:monospace;font-size:25px;font-weight:bold;color:#0f172a;margin-top:5px">${escapeHtml(tokenNumber)}</div></div><p style="text-align:center"><a href="${invitationUrl}" style="display:inline-block;background:#059669;color:#ffffff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:bold">Open invitation card</a></p><p style="font-size:12px;color:#64748b">Please show this card and token at the Shivir counter.</p>`),
  });
}
