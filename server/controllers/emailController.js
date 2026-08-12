const nodemailer = require('nodemailer');

// Create reusable transporter (uses SMTP env vars if configured, or Ethereal/mock transport)
const createTransporter = () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }
  
  // Fallback dev transport (JSON / log output)
  return nodemailer.createTransport({
    jsonTransport: true
  });
};

const sendInvitationEmail = async (req, res) => {
  try {
    const {
      to,
      memberName,
      memberRole,
      brideName = 'Bride',
      partnerName = 'her partner',
      taskName = 'Review wedding deliverables',
      dueDate = 'Flexible date'
    } = req.body;

    if (!to || !memberName) {
      return res.status(400).json({ error: 'Recipient email ("to") and memberName are required.' });
    }

    const transporter = createTransporter();

    const subject = `You’ve Been Chosen to Help Make ${brideName}’s Big Day Special`;

    const htmlBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: 'Georgia', serif; background-color: #F9F5F2; color: #1A1816; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #E6DED6; border-radius: 16px; padding: 32px; }
          .brand { text-align: center; padding-bottom: 24px; border-bottom: 1px solid #E6DED6; }
          .brand-title { font-size: 24px; font-weight: bold; letter-spacing: 2px; color: #1A1816; }
          .brand-subtitle { font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #9E784B; margin-top: 4px; font-family: sans-serif; }
          .role-box { background: #F9F5F2; border-left: 4px solid #9E784B; padding: 16px; margin: 20px 0; border-radius: 0 8px 8px 0; font-family: sans-serif; }
          .role-title { font-size: 12px; font-weight: bold; text-transform: uppercase; color: #9E784B; margin: 0 0 8px 0; }
          .task-card { background: #ffffff; border: 1px solid #E6DED6; padding: 16px; border-radius: 12px; margin-top: 12px; font-family: sans-serif; }
          .btn-container { text-align: center; margin: 28px 0; font-family: sans-serif; }
          .btn { background: #1A1816; color: #ffffff !important; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block; }
          .footer { border-top: 1px solid #E6DED6; margin-top: 32px; padding-top: 20px; font-family: sans-serif; font-size: 12px; color: #777777; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="brand">
            <div class="brand-title">CELEBRATE IT</div>
            <div class="brand-subtitle">Wedding Coordination Portal</div>
          </div>

          <p style="font-size: 16px;">Hi ${memberName},</p>

          <p>There’s something very special about being asked to stand beside someone you love as they prepare for one of the biggest days of their life.</p>

          <p>We’re excited to let you know that <strong>${brideName} has chosen you as her ${memberRole}</strong> as she plans her wedding to ${partnerName}.</p>

          <p>This means you have the wonderful opportunity to be part of her journey — helping her stay organised, making important decisions, and most importantly, being there for her along the way.</p>

          <div class="role-box">
            <div class="role-title">Your Role: ${memberRole}</div>
            <p style="font-size: 13px; margin: 0; color: #333333;">
              As ${memberRole}, you’ll be helping ${brideName} with coordinating planning details, keeping checklist deliverables aligned, and supporting wedding logistics.
            </p>
          </div>

          <div style="border-top: 1px solid #E6DED6; padding-top: 20px; margin-top: 20px;">
            <h4 style="font-size: 18px; margin: 0 0 12px 0;">Your First Task</h4>
            <div class="task-card">
              <strong style="color: #1A1816; font-size: 14px;">${taskName}</strong>
              <div style="font-size: 12px; color: #666666; margin-top: 4px;">Due Date: ${dueDate}</div>
            </div>
          </div>

          <div class="btn-container">
            <a href="${process.env.APP_URL || 'https://celebrateit-seven.vercel.app'}" class="btn">View Your Wedding Tasks</a>
          </div>

          <p style="font-style: italic; color: #555555; font-size: 14px;">
            Please remember, this isn't about doing everything perfectly. It's about being there, lending a hand, and helping ${brideName} enjoy the journey as much as possible.
          </p>

          <p style="font-family: sans-serif; font-size: 14px; color: #555555;">
            Thank you for being someone ${brideName} can count on. We’re so happy to have you as part of her wedding journey, and we can’t wait to see the beautiful memories you’ll help create together.
          </p>

          <div class="footer">
            <div>With love,</div>
            <div style="font-weight: bold; color: #1A1816; margin-top: 2px;">The CelebrateIT Team</div>
            <div style="color: #9E784B; font-weight: bold; font-size: 10px; margin-top: 4px;">Celebrating love. Planning together. Making the journey unforgettable.</div>
          </div>
        </div>
      </body>
      </html>
    `;

    const info = await transporter.sendMail({
      from: `"CelebrateIT Team" <${process.env.SMTP_FROM || 'notifications@celebrateit.co.za'}>`,
      to,
      subject,
      html: htmlBody
    });

    console.log('Invitation email dispatched:', info);

    return res.status(200).json({
      success: true,
      message: 'Invitation email successfully sent',
      details: {
        to,
        subject,
        memberName,
        memberRole
      }
    });
  } catch (error) {
    console.error('Error sending invitation email:', error);
    return res.status(500).json({ error: 'Failed to send invitation email', details: error.message });
  }
};

module.exports = {
  sendInvitationEmail
};
