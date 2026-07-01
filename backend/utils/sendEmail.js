import nodemailer from 'nodemailer';

let transporter;

const getTransporter = () => {
  if (transporter) return transporter;
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  return transporter;
};

/**
 * Sends an email. Failures are logged but NEVER thrown — a broken SMTP
 * config should never crash a product/order request.
 */
export const sendEmail = async ({ to, subject, html }) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log(`✉️  [Email skipped - no SMTP configured] -> ${subject} -> ${to}`);
      return;
    }
    await getTransporter().sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject,
      html,
    });
    console.log(`✉️  Email sent: "${subject}" -> ${to}`);
  } catch (err) {
    console.error('❌ Email send failed:', err.message);
  }
};
