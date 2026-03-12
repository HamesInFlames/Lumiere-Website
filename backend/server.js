import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// Allowed origins for CORS
const allowedOrigins = [
  "http://localhost:8000",
  "http://localhost:5173",
  "https://lumiere-website-production.up.railway.app",
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.some(allowed => origin.startsWith(allowed.replace(/\/$/, '')))) {
      return callback(null, true);
    }
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));

app.use(express.json());

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ status: "ok", service: "Lumière Backend API" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Validation helper
function validateContact({ name, email, phone, message }) {
  const errors = [];
  if (!name || name.trim().length < 2) errors.push("name");
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("email");
  if (phone && phone.trim().length > 0 && phone.trim().length < 7) errors.push("phone");
  if (!message || message.trim().length < 5) errors.push("message");
  return errors;
}

// Send email using Resend API (HTTP-based, works on Railway)
async function sendEmailWithResend({ to, from, replyTo, subject, text, html }) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ to, from, reply_to: replyTo, subject, text, html })
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Resend API error: ${response.status}`);
  }
  
  return response.json();
}

// Contact form endpoint
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body || {};
    
    const errors = validateContact({ name, email, phone, message });
    if (errors.length) {
      return res.status(400).json({ 
        ok: false, 
        message: "Invalid fields", 
        fields: errors 
      });
    }

    // Check if Resend is configured
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY not configured.");
      return res.status(500).json({ 
        ok: false, 
        message: "Email service not configured" 
      });
    }

    const subject = `New website inquiry from ${name}`;
    const text = [
      `You have a new message from Lumière Pâtisserie website:`,
      ``,
      `Name:  ${name}`,
      `Email: ${email}`,
      `Phone: ${phone || "Not provided"}`,
      ``,
      `Message:`,
      `${message}`
    ].join("\n");

    const html = `
      <h2>New Contact Form Submission</h2>
      <p>You have a new message from the Lumière Pâtisserie website:</p>
      <table style="border-collapse: collapse; margin: 20px 0;">
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Name</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${name}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Email</td>
          <td style="padding: 8px; border: 1px solid #ddd;"><a href="mailto:${email}">${email}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Phone</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${phone || "Not provided"}</td>
        </tr>
      </table>
      <h3>Message:</h3>
      <p style="background: #f5f5f5; padding: 15px; border-radius: 5px;">${message.replace(/\n/g, "<br>")}</p>
    `;

    await sendEmailWithResend({
      to: process.env.MAIL_TO || "contact@lumierepatisserie.ca",
      from: process.env.MAIL_FROM || "onboarding@resend.dev",
      replyTo: email,
      subject,
      text,
      html
    });

    console.log(`✅ Email sent successfully from ${email}`);
    return res.json({ ok: true });

  } catch (err) {
    console.error("❌ Contact form error:", err.message);
    return res.status(500).json({ 
      ok: false, 
      message: "Failed to send message. Please try again later." 
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`🚀 Lumière Backend running on port ${PORT}`);
});
