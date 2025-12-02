// src/controllers/contactController.js
import nodemailer from "nodemailer";

// Note: Input validation is now handled by express-validator in routes
// This controller receives already validated & sanitized data

export async function submitContact(req, res, next) {
  try {
    const { name, email, phone, message } = req.body || {};

    // Create transporter with secure defaults
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: String(process.env.SMTP_SECURE || "false") === "true",
      auth: process.env.SMTP_USER ? {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      } : undefined
    });

    const subject = `New website inquiry from ${name}`;
    const text = [
      `You have a new message from Lumière Pâtisserie website:`,
      ``,
      `Name:  ${name}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      ``,
      `Message:`,
      `${message}`
    ].join("\n");

    await transporter.sendMail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER,
      to: process.env.MAIL_TO || process.env.SMTP_USER,
      subject,
      text
    });

    return res.json({ ok: true });
  } catch (err) {
    return next(err);
  }
}
