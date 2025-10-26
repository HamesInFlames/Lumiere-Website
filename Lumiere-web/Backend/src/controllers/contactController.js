// src/controllers/contactController.js
import nodemailer from "nodemailer";

function validate({ name, email, phone, message }) {
  const errors = [];
  if (!name || name.trim().length < 2) errors.push("name");
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("email");
  if (!phone || phone.trim().length < 7) errors.push("phone");
  if (!message || message.trim().length < 5) errors.push("message");
  return errors;
}

export async function submitContact(req, res, next) {
  try {
    const { name, email, phone, message } = req.body || {};
    const bad = validate({ name, email, phone, message });
    if (bad.length) {
      return res.status(400).json({ ok: false, message: "Invalid fields", fields: bad });
    }

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
