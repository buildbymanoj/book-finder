/**
 * Email Service
 * Handles sending emails using nodemailer
 */

const nodemailer = require('nodemailer');
let sendgrid;
try {
  sendgrid = require('@sendgrid/mail');
} catch (e) {
  // sendgrid not installed; we'll handle this later
  sendgrid = null;
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

// Initialize SendGrid if API key is present
if (process.env.SENDGRID_API_KEY && sendgrid) {
  sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
  console.log('EmailService: SendGrid configured (will be used as fallback if SMTP fails).');
} else if (process.env.SENDGRID_API_KEY && !sendgrid) {
  console.warn('EmailService: SENDGRID_API_KEY set but @sendgrid/mail is not installed. Install it to use SendGrid fallback.');
}

/**
 * Send password reset email
 * @param {String} to - Recipient email
 * @param {String} resetToken - Password reset token
 * @returns {Promise}
 */
const buildResetHtml = (resetUrl) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #333;">Password Reset Request</h2>
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

const sendViaSendGrid = async (to, subject, html, text) => {
  if (!sendgrid || !process.env.SENDGRID_API_KEY) {
    throw new Error('SendGrid not configured');
  }
  const msg = {
    to,
    from: process.env.EMAIL_USER,
    subject,
    text: text || 'Please view this email in an HTML-compatible client.',
    html,
  };
  const res = await sendgrid.send(msg);
  return res;
};

const sendPasswordResetEmail = async (to, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  const html = buildResetHtml(resetUrl);
  const subject = 'Password Reset Request';

  console.log('EmailService: Preparing password reset email for', to, 'resetUrl:', resetUrl);
  console.log('EmailService: smtpAvailable=', smtpAvailable, 'SENDGRID_API_KEY=', !!process.env.SENDGRID_API_KEY);

  // Try SMTP first if available
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
      // fall through to try SendGrid
    }
  }

  // If SMTP failed or wasn't available, try SendGrid if configured
  if (process.env.SENDGRID_API_KEY) {
    try {
      const sgRes = await sendViaSendGrid(to, subject, html);
      console.log('EmailService: Email sent via SendGrid', sgRes && sgRes[0] ? { statusCode: sgRes[0].statusCode, headers: sgRes[0].headers } : sgRes);
      return sgRes;
    } catch (sgErr) {
      console.error('EmailService: SendGrid send failed', sgErr && sgErr.message ? sgErr.message : sgErr);
      throw sgErr;
    }
  }

  throw new Error('No email transport available (SMTP failed and SendGrid not configured)');
};

const sendTestEmail = async (to) => {
  const subject = 'Test Email from Book Finder';
  const html = `<p>This is a test email to verify SMTP/SendGrid configuration.</p>`;
  // Try SMTP first if available
  if (smtpAvailable) {
    try {
      const info = await transporter.sendMail({ from: `"Book Finder" <${process.env.EMAIL_USER}>`, to, subject, html });
      return info;
    } catch (err) {
      console.error('EmailService: SMTP test send failed', err && err.message ? err.message : err);
    }
  }
  if (process.env.SENDGRID_API_KEY) {
    return sendViaSendGrid(to, subject, html);
  }
  throw new Error('No email transport available for test email');
};

module.exports = {
  sendPasswordResetEmail,
  sendTestEmail,
  transporter,
};
