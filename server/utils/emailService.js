/**
 * Email Service
 * Handles sending emails using nodemailer
 */

const nodemailer = require('nodemailer');

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

// Verify transporter on startup so we know if SMTP is reachable
transporter.verify()
  .then(() => {
    console.log('EmailService: SMTP connection verified successfully.');
  })
  .catch((err) => {
    console.error('EmailService: SMTP verification failed. Check SMTP credentials and network access.', err && err.message ? err.message : err);
  });

/**
 * Send password reset email
 * @param {String} to - Recipient email
 * @param {String} resetToken - Password reset token
 * @returns {Promise}
 */
const sendPasswordResetEmail = async (to, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  const mailOptions = {
    from: `"Book Finder" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Password Reset Request',
    html: `
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
    `,
  };

  console.log('EmailService: Sending password reset email to', to, 'with resetUrl:', resetUrl);
  console.log('EmailService: Using email config:', {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE,
    user: process.env.EMAIL_USER,
    frontendUrl: process.env.FRONTEND_URL
  });
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('EmailService: Email sent successfully', info.response);
    return info;
  } catch (err) {
    console.error('EmailService: Error sending email', err.message, err.code, err.response);
    throw err;
  }
};

module.exports = {
  sendPasswordResetEmail,
  transporter,
};
