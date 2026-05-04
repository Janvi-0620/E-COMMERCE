// ============================================
// Email Service
// ============================================
// Handles all email sending functionality (SMTP via Nodemailer)

import nodemailer from 'nodemailer';
import env from '../config/env.js';
import logger from '../utils/logger.js';

// Create transporter (email client)
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail', // Using Gmail (can change to any SMTP service)
    auth: {
      user: env.email.smtpUser,
      pass: env.email.smtpPass // Gmail: Use App-Specific Password
    }
  });

  // Alternative for custom SMTP:
  // return nodemailer.createTransport({
  //   host: env.email.smtpHost,
  //   port: env.email.smtpPort,
  //   secure: true,
  //   auth: {
  //     user: env.email.smtpUser,
  //     pass: env.email.smtpPass
  //   }
  // });
};

const transporter = createTransporter();

// ============================================
// EMAIL TEMPLATES
// ============================================

const emailTemplates = {
  // OTP Verification Email
  otpVerification: (userName, otp, expiryMinutes = 10) => ({
    subject: '🔐 Your 2FA Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
          <h1>🔐 Verify Your Account</h1>
        </div>
        
        <div style="padding: 20px; background: #f5f5f5; border: 1px solid #e0e0e0;">
          <p>Hello <strong>${userName}</strong>,</p>
          
          <p>Your 2-Factor Authentication verification code is:</p>
          
          <div style="background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #667eea; text-align: center;">
            <h2 style="margin: 0; letter-spacing: 5px; color: #333;">
              <code style="font-size: 32px; font-weight: bold; color: #667eea;">${otp}</code>
            </h2>
            <p style="color: #999; margin-top: 10px;">This code expires in ${expiryMinutes} minutes</p>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            ⚠️ <strong>Never share this code with anyone.</strong> We will never ask for this code via email or phone.
          </p>
          
          <p style="color: #666; font-size: 14px;">
            If you didn't request this code, please ignore this email or contact support immediately.
          </p>
          
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            © 2024 E-Commerce Platform. All rights reserved.
          </p>
        </div>
      </div>
    `,
    text: `
      Hello ${userName},
      
      Your 2-Factor Authentication verification code is: ${otp}
      
      This code expires in ${expiryMinutes} minutes.
      
      NEVER SHARE THIS CODE WITH ANYONE.
      
      If you didn't request this code, please ignore this email.
      
      © 2024 E-Commerce Platform
    `
  }),

  // Welcome Email
  welcome: (userName) => ({
    subject: '👋 Welcome to E-Commerce Platform!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
          <h1>👋 Welcome, ${userName}!</h1>
        </div>
        
        <div style="padding: 20px; background: #f5f5f5; border: 1px solid #e0e0e0;">
          <p>Thank you for signing up to E-Commerce Platform!</p>
          
          <p>Your account has been successfully created with 2-Factor Authentication enabled.</p>
          
          <div style="background: white; padding: 15px; margin: 20px 0; border-left: 4px solid #667eea;">
            <h3 style="margin-top: 0;">What's Next?</h3>
            <ul style="color: #666;">
              <li>Browse our products</li>
              <li>Add items to your cart</li>
              <li>Complete your checkout</li>
              <li>Track your orders</li>
            </ul>
          </div>
          
          <p style="color: #999; font-size: 12px;">
            © 2024 E-Commerce Platform. All rights reserved.
          </p>
        </div>
      </div>
    `,
    text: `
      Welcome to E-Commerce Platform, ${userName}!
      
      Thank you for signing up. Your account has been created with 2-Factor Authentication.
      
      © 2024 E-Commerce Platform
    `
  }),

  // Password Reset Email
  passwordReset: (userName, resetLink, expiryMinutes = 30) => ({
    subject: '🔑 Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
          <h1>🔑 Reset Your Password</h1>
        </div>
        
        <div style="padding: 20px; background: #f5f5f5; border: 1px solid #e0e0e0;">
          <p>Hello <strong>${userName}</strong>,</p>
          
          <p>We received a request to reset your password. Click the button below to proceed:</p>
          
          <div style="text-align: center; margin: 20px 0;">
            <a href="${resetLink}" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Password
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            Or copy and paste this link: <code>${resetLink}</code>
          </p>
          
          <p style="color: #666; font-size: 14px;">
            This link expires in ${expiryMinutes} minutes.
          </p>
          
          <p style="color: #999; font-size: 12px;">
            If you didn't request this, please ignore this email.
          </p>
        </div>
      </div>
    `,
    text: `
      Hello ${userName},
      
      Reset your password using this link: ${resetLink}
      
      This link expires in ${expiryMinutes} minutes.
      
      © 2024 E-Commerce Platform
    `
  })
};

// ============================================
// EMAIL SERVICE METHODS
// ============================================

class EmailService {
  /**
   * Send OTP verification email
   * @param {string} email - Recipient email
   * @param {string} userName - User's name
   * @param {string} otp - One-time password
   * @param {number} expiryMinutes - OTP expiry time
   */
  async sendOTPVerification(email, userName, otp, expiryMinutes = 10) {
    try {
      const template = emailTemplates.otpVerification(userName, otp, expiryMinutes);

      const mailOptions = {
        from: env.email.senderEmail,
        to: email,
        subject: template.subject,
        html: template.html,
        text: template.text
      };

      const info = await transporter.sendMail(mailOptions);
      
      logger.info(`OTP email sent to ${email}`, { messageId: info.messageId });
      return { success: true, messageId: info.messageId };

    } catch (error) {
      logger.error(`Failed to send OTP email to ${email}`, { error: error.message });
      throw new Error(`Failed to send OTP email: ${error.message}`);
    }
  }

  /**
   * Send welcome email
   * @param {string} email - Recipient email
   * @param {string} userName - User's name
   */
  async sendWelcomeEmail(email, userName) {
    try {
      const template = emailTemplates.welcome(userName);

      const mailOptions = {
        from: env.email.senderEmail,
        to: email,
        subject: template.subject,
        html: template.html,
        text: template.text
      };

      const info = await transporter.sendMail(mailOptions);
      
      logger.info(`Welcome email sent to ${email}`, { messageId: info.messageId });
      return { success: true, messageId: info.messageId };

    } catch (error) {
      logger.error(`Failed to send welcome email to ${email}`, { error: error.message });
      throw new Error(`Failed to send welcome email: ${error.message}`);
    }
  }

  /**
   * Send password reset email
   * @param {string} email - Recipient email
   * @param {string} userName - User's name
   * @param {string} resetLink - Password reset link
   * @param {number} expiryMinutes - Link expiry time
   */
  async sendPasswordResetEmail(email, userName, resetLink, expiryMinutes = 30) {
    try {
      const template = emailTemplates.passwordReset(userName, resetLink, expiryMinutes);

      const mailOptions = {
        from: env.email.senderEmail,
        to: email,
        subject: template.subject,
        html: template.html,
        text: template.text
      };

      const info = await transporter.sendMail(mailOptions);
      
      logger.info(`Password reset email sent to ${email}`, { messageId: info.messageId });
      return { success: true, messageId: info.messageId };

    } catch (error) {
      logger.error(`Failed to send password reset email to ${email}`, { error: error.message });
      throw new Error(`Failed to send password reset email: ${error.message}`);
    }
  }

  /**
   * Test email connection
   */
  async testConnection() {
    try {
      await transporter.verify();
      logger.info('✅ Email service connected successfully');
      return { success: true, message: 'Email service is connected' };
    } catch (error) {
      logger.error('❌ Email service connection failed', { error: error.message });
      throw new Error(`Email service error: ${error.message}`);
    }
  }
}

export default new EmailService();
