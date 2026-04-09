import "./Conact.scss";
import {
  EMAIL_ADDRESS,
  PHONE_NUMBER,
  WHATSAPP_NUMBER,
  INSTAGRAM_URL,
} from "../../helpers/config";

export default function Contact() {
  const message = encodeURIComponent(
    "Hello, I am interested in your product. Can you share details?",
  );
  return (
    <div className="contact-page">
      <h1>Contact Us</h1>

      {/* Address */}
      <section className="contact-section">
        <h3>Location</h3>
        <p>
          Ayra Health Mix <br />
          Tenkasi, Tamil Nadu, India
        </p>

        <iframe
          title="Ayra Health Mix Location Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d292.18614509488873!2d77.31511885820653!3d8.958757935946839!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b04290009cb8ee5%3A0xb3afc0289d79a8d7!2sParayadi%202nd%20street!5e1!3m2!1sen!2sin!4v1775762674170!5m2!1sen!2sin"
          width="100%"
          height="250"
          style={{ border: "0" }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </section>

      {/* Contact details */}
      <section className="contact-section">
        <h3>Get in Touch</h3>

        <p>
          📧 Email: <a href={`mailto:${EMAIL_ADDRESS}`}>{EMAIL_ADDRESS}</a>
        </p>

        <p>
          📞 Phone: <a href={`tel:${PHONE_NUMBER}`}>{PHONE_NUMBER}</a>
        </p>

        <p>
          💬 WhatsApp:{" "}
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`}
            target="_blank"
            rel="noreferrer"
          >
            Chat on WhatsApp
          </a>
        </p>

        <p>
          📸 Instagram:{" "}
          <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">
            Send Message
          </a>
        </p>
      </section>
    </div>
  );
}
