/**
 * Email Service
 * Handles sending emails using nodemailer
 */

const nodemailer = require('nodemailer');
let resend;
try {
  resend = require('resend');
} catch (e) {
  // resend not installed; we'll handle this later
  resend = null;
}

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Flag recording if SMTP seems available
let smtpAvailable = true;

// Verify transporter on startup so we know if SMTP is reachable
transporter.verify()
  .then(() => {
    smtpAvailable = true;
    console.log('EmailService: SMTP connection verified successfully.');
  })
  .catch((err) => {
    smtpAvailable = false;
    console.error('EmailService: SMTP verification failed. Check SMTP credentials and network access.', err && err.message ? err.message : err);
  });

// Initialize Resend if API key is present
let resendClient = null;
if (process.env.RESEND_API_KEY && resend) {
  resendClient = new resend.Resend(process.env.RESEND_API_KEY);
  console.log('EmailService: Resend configured (will be used as fallback if SMTP fails).');
} else if (process.env.RESEND_API_KEY && !resend) {
  console.warn('EmailService: RESEND_API_KEY set but resend is not installed. Install it to use Resend fallback.');
}

/**
 * Send password reset email
 * @param {String} to - Recipient email
 * @param {String} resetToken - Password reset token
 * @returns {Promise}
 */
const buildResetHtml = (resetUrl) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #333;">Password Reset Request - Book Finder</h2>
    <p>You requested a password reset for your Book Finder account.</p>
    <p>Please click the button below to reset your password:</p>
    <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">Reset Password</a>
    <p>If the button doesn't work, copy and paste this link into your browser:</p>
    <p>${resetUrl}</p>
    <p>This link will expire in 1 hour.</p>
    <p>If you didn't request this reset, please ignore this email.</p>
    <br>
    <p>Best regards,<br>Book Finder Team</p>
  </div>
`;

const sendViaResend = async (to, subject, html, text) => {
  if (!resendClient || !process.env.RESEND_API_KEY) {
    throw new Error('Resend not configured');
  }

  try {
    const data = await resendClient.emails.send({
      from: "onboarding@resend.dev", // Use Resend's default domain
      to: [to],
      subject,
      html,
      text: text || 'Please view this email in an HTML-compatible client.',
    });
    return data;
  } catch (error) {
    // Handle Resend's test account restrictions
    if (error.statusCode === 403 && error.message.includes('testing emails to your own email address')) {
      console.error('EmailService: Resend test account restriction - can only send to verified email addresses');
      throw new Error('Email service test restriction: Can only send to your own verified email address. For production, verify a domain at resend.com/domains');
    }
    throw error;
  }
};

const sendPasswordResetEmail = async (to, resetToken) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;
  const html = buildResetHtml(resetUrl);
  const subject = 'Password Reset Request';

  console.log('EmailService: Preparing password reset email for', to, 'resetUrl:', resetUrl);
  console.log('EmailService: smtpAvailable=', smtpAvailable, 'RESEND_API_KEY=', !!process.env.RESEND_API_KEY);

  // Try SMTP first (primary)
  if (smtpAvailable) {
    const mailOptions = {
      from: `"Book Finder" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('EmailService: Email sent via SMTP', {
        response: info && info.response,
        accepted: info && info.accepted,
        rejected: info && info.rejected,
        messageId: info && info.messageId
      });
      return info;
    } catch (err) {
      console.error('EmailService: SMTP send failed', err && err.message ? err.message : err);
      // fall through to try Resend as fallback
    }
  }

  // Fallback to Resend if SMTP fails
  if (process.env.RESEND_API_KEY) {
    try {
      const resendRes = await sendViaResend(to, subject, html);
      console.log('EmailService: Email sent via Resend', resendRes);
      return resendRes;
    } catch (resendErr) {
      console.error('EmailService: Resend send failed', resendErr && resendErr.message ? resendErr.message : resendErr);

      // If it's a test account restriction, provide helpful error
      if (resendErr.message && resendErr.message.includes('testing emails to your own email address')) {
        throw new Error('Email delivery failed: Test accounts can only send to verified email addresses. For full functionality, please verify a domain at resend.com/domains or use SMTP configuration.');
      }

      throw resendErr;
    }
  }

  throw new Error('No email transport available (SMTP failed and Resend not configured)');
};

const sendTestEmail = async (to) => {
  const subject = 'Test Email from Book Finder';
  const html = `<p>This is a test email to verify SMTP/Resend configuration.</p>`;
  // Try SMTP first (primary)
  if (smtpAvailable) {
    try {
      const info = await transporter.sendMail({ from: `"Book Finder" <${process.env.EMAIL_USER}>`, to, subject, html });
      return info;
    } catch (err) {
      console.error('EmailService: SMTP test send failed', err && err.message ? err.message : err);
    }
  }
  // Fallback to Resend if configured
  if (process.env.RESEND_API_KEY) {
    try {
      return await sendViaResend(to, subject, html);
    } catch (err) {
      console.error('EmailService: Resend test send failed', err && err.message ? err.message : err);
    }
  }
  throw new Error('No email transport available for test email');
};

module.exports = {
  sendPasswordResetEmail,
  sendTestEmail,
  transporter,
};
