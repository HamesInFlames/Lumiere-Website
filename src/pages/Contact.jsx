// App/src/pages/Contact.jsx
import React, { useState } from "react";
import "../styles/Contact.css";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", msg: "" });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus("");

    try {
      const payload = {
        name: form.name?.trim(),
        email: form.email?.trim(),
        phone: form.phone?.trim(),
        message: form.msg?.trim(),
      };

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || "Failed to send");
      }

      setStatus("Message sent! We’ll get back to you shortly.");
      setForm({ name: "", email: "", phone: "", msg: "" });
    } catch (err) {
      setStatus(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      {/* Page title */}
      <section className="contact-hero">
        <div className="contact-wrap">
          <h1 className="contact-title">Contact Us</h1>
          <div className="contact-accent" />
          <p className="contact-lede">
            Questions about custom orders, pickup &amp; delivery, or anything else? We’d love to help.
          </p>
        </div>
      </section>

      {/* Info + Map */}
      <section className="contact-wrap">
        <div className="contact-columns">
          {/* Left: Info card */}
          <div className="card">
            <h3 className="card-h3">Get in touch</h3>

            <div className="contact-line">
              <span>Phone</span>
              <a className="link-strong" href="tel:+16472938815">(647) 293-8815</a>
            </div>
            <div className="contact-line">
              <span>Address</span>
              <span>1102 Centre St #1, Thornhill, ON L4J 3M8</span>
            </div>

            <div className="hours">
              <h4>Hours</h4>
              <ul>
                <li><span>Monday</span><em className="badge badge-muted">Closed</em></li>
                <li><span>Tuesday</span><em>9am – 7pm</em></li>
                <li><span>Wednesday</span><em>9am – 7pm</em></li>
                <li><span>Thursday</span><em>9am – 7pm</em></li>
                <li><span>Friday</span><em>9am – 7pm</em></li>
                <li><span>Saturday</span><em>9am – 7pm</em></li>
                <li><span>Sunday</span><em>9am – 7pm</em></li>
              </ul>
            </div>
          </div>

          {/* Right: Map card */}
          <div className="card card-map">
            <iframe
              title="Lumière Pâtisserie Map"
              width="100%"
              height="100%"
              style={{ border: 0, borderRadius: 14 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2884.8!2d-79.4643976!3d43.8089994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b2d3656ef54a1%3A0xfc1b28b01a017991!2sLumi%C3%A8re%20P%C3%A2tisserie!5e0!3m2!1sen!2sca!4v1704000000000!5m2!1sen!2sca"
            />
            <a 
              href="https://www.google.com/maps/place/Lumi%C3%A8re+P%C3%A2tisserie/@43.8089994,-79.4643976,17z/data=!3m2!4b1!5s0x882b2c2571548749:0xb2d5338425c0ba65!4m6!3m5!1s0x882b2d3656ef54a1:0xfc1b28b01a017991!8m2!3d43.8089956!4d-79.4618227!16s%2Fg%2F11r_dmkggr"
              target="_blank"
              rel="noopener noreferrer"
              className="map-link"
            >
              Open in Google Maps →
            </a>
          </div>
        </div>
      </section>

      {/* Message form */}
      <section className="contact-wrap">
        <form className="form-card" onSubmit={onSubmit}>
          <div className="form-head">
            <h3>Send us a message</h3>
            <p>We usually reply within one business day.</p>
          </div>

          <div className="field">
            <label htmlFor="name">Name</label>
            <input
              id="name" name="name" placeholder="Your name"
              value={form.name} onChange={onChange} required
            />
          </div>

          <div className="row-2">
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email" name="email" type="email" placeholder="you@example.com"
                value={form.email} onChange={onChange} required
              />
            </div>
            <div className="field">
              <label htmlFor="phone">Phone <span className="muted">(optional)</span></label>
              <input
                id="phone" name="phone" placeholder="(647) 293-8815"
                value={form.phone} onChange={onChange}
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="msg">Message</label>
            <textarea
              id="msg" name="msg" rows={6} placeholder="How can we help?"
              value={form.msg} onChange={onChange} required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-grad" disabled={submitting}>
              {submitting ? "Sending…" : "Send message"}
            </button>
            {!!status && <span className="form-status" style={{ marginLeft: 12 }}>{status}</span>}
          </div>
        </form>
      </section>
    </div>
  );
}
