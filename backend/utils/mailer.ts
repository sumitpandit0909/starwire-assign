import nodemailer from 'nodemailer';

/**
 * Creates and returns a Nodemailer transporter.
 * Uses environment variables if specified, or auto-configures test SMTP (Ethereal).
 */
export async function getTransporter() {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (smtpHost && smtpUser && smtpPass) {
    return nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });
  }

  // Fallback to auto-created Ethereal test account or direct send transport
  try {
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  } catch (err) {
    console.warn('Could not create Ethereal test account, using direct send transport fallback:', err);
    return nodemailer.createTransport({
      jsonTransport: true,
    });
  }
}

/**
 * Send 6-Digit Password Reset Email via Nodemailer
 */
export async function sendPasswordResetEmail(toEmail: string, verificationCode: string) {
  try {
    const transporter = await getTransporter();

    const fromSender = process.env.SMTP_FROM || '"STARWIRE Intelligence" <no-reply@starwire.ai>';

    const htmlContent = `
      <div style="background-color: #131313; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #FAF9F6; padding: 40px 20px; max-width: 600px; margin: 0 auto; border-radius: 16px; border: 1px solid rgba(242, 202, 80, 0.3);">
        <div style="text-align: center; padding-bottom: 24px; border-bottom: 1px solid rgba(77, 70, 53, 0.4);">
          <h1 style="color: #f2ca50; font-size: 24px; letter-spacing: 4px; text-transform: uppercase; margin: 0;">STARWIRE</h1>
          <p style="color: #10B981; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; font-weight: bold; margin-top: 4px;">SECURITY INTELLIGENCE</p>
        </div>

        <div style="padding: 32px 16px; text-align: center;">
          <h2 style="font-size: 20px; color: #FAF9F6; margin-bottom: 12px;">Password Reset Verification Code</h2>
          <p style="font-size: 14px; color: #d0c5af; line-height: 1.6; margin-bottom: 24px;">
            We received a request to reset your STARWIRE account password. Use the 6-digit verification code below to authorize your password update:
          </p>

          <div style="background-color: #1c1b1b; border: 2px solid #f2ca50; border-radius: 12px; padding: 20px; margin: 24px 0; display: inline-block;">
            <span style="font-family: monospace; font-size: 36px; font-weight: bold; color: #f2ca50; letter-spacing: 8px;">${verificationCode}</span>
          </div>

          <p style="font-size: 12px; color: #99907c; margin-top: 16px;">
            This verification code is valid for <strong>15 minutes</strong>. If you did not initiate this request, please ignore this email.
          </p>
        </div>

        <div style="border-top: 1px solid rgba(77, 70, 53, 0.4); padding-top: 20px; text-align: center; font-size: 11px; color: #777;">
          <p style="margin: 0;">© 2026 STARWIRE Intelligence Security Systems. All rights reserved.</p>
        </div>
      </div>
    `;

    const info = await transporter.sendMail({
      from: fromSender,
      to: toEmail,
      subject: `STARWIRE Security Code: ${verificationCode}`,
      text: `Your STARWIRE 6-digit password reset verification code is: ${verificationCode}`,
      html: htmlContent,
    });

    console.log(`[NODEMAILER] Password reset email sent to ${toEmail}. MessageID: ${info.messageId}`);
    
    // If using Ethereal test account, log preview URL
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`[NODEMAILER ETHEREAL PREVIEW]: ${previewUrl}`);
    }

    return { success: true, messageId: info.messageId, previewUrl };
  } catch (error: any) {
    console.error('[NODEMAILER ERROR] Failed to dispatch email:', error);
    return { success: false, error: error.message };
  }
}
