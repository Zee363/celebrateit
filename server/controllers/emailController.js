const nodemailer = require('nodemailer');

// Create reusable transporter (uses SMTP env vars if configured, or Ethereal/mock transport)
const createTransporter = () => {
  const isRealUser = process.env.SMTP_USER && 
                     !process.env.SMTP_USER.includes('your-email') && 
                     !process.env.SMTP_USER.includes('example.com');

  if (process.env.SMTP_HOST && isRealUser) {
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
    const subject = `You’ve Been Asked to Stand by ${brideName} as her ${memberRole}`;

    const htmlBody = `
      <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>${subject}</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #F9F5F2; font-family: Georgia, serif; color: #1A1816; -webkit-font-smoothing: antialiased;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F9F5F2; table-layout: fixed;">
          <tr>
            <td align="center" style="padding: 30px 15px;">
              
              <!-- Main Container Table -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border: 1px solid #E6DED6; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
                
                <!-- Brand Header Row -->
                <tr>
                  <td align="center" style="padding: 32px 30px 24px 30px; border-bottom: 1px solid #E6DED6; background-color: #ffffff;">
                    <div style="font-family: Georgia, serif; font-size: 26px; font-weight: bold; color: #1A1816; letter-spacing: 1px;">
                      CelebrateIT
                    </div>
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #9E784B; font-weight: 700; margin-top: 4px;">
                      Wedding Coordination Portal
                    </div>
                  </td>
                </tr>

                <!-- Content Row -->
                <tr>
                  <td style="padding: 32px 30px; font-family: Georgia, serif; color: #1A1816; font-size: 15px; line-height: 1.65;">
                    
                    <p style="font-family: Georgia, serif; font-size: 15px; color: #1A1816; line-height: 1.65; margin: 0 0 18px 0;">
                      Hi ${memberName},
                    </p>

                    <p style="font-family: Georgia, serif; font-size: 15px; color: #1A1816; line-height: 1.65; margin: 0 0 18px 0;">
                      There’s something very special about being asked to stand beside someone you love as they prepare for one of the biggest days of their life.
                    </p>

                    <p style="font-family: Georgia, serif; font-size: 15px; color: #1A1816; line-height: 1.65; margin: 0 0 18px 0;">
                      We’re excited to let you know that <strong>${brideName} has asked you to be her ${memberRole}</strong> as she plans her wedding to ${partnerName}.
                    </p>

                    <p style="font-family: Georgia, serif; font-size: 15px; color: #1A1816; line-height: 1.65; margin: 0 0 24px 0;">
                      This means you have the wonderful opportunity to be part of her journey — helping her stay organized, making important decisions, and most importantly, being there for her along the way.
                    </p>

                    <!-- Role Box -->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F9F5F2; border-left: 4px solid #9E784B; border-radius: 0 8px 8px 0; margin-bottom: 24px;">
                      <tr>
                        <td style="padding: 16px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                          <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #9E784B; margin-bottom: 6px;">
                            Your Role: ${memberRole}
                          </div>
                          <div style="font-size: 13px; color: #1A1816; line-height: 1.5;">
                            As ${memberRole}, you’ll be helping ${brideName} with coordinating planning details, keeping checklist deliverables aligned, and supporting wedding logistics.
                          </div>
                        </td>
                      </tr>
                    </table>

                    <!-- Task Section -->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-top: 1px solid #E6DED6; padding-top: 24px; margin-top: 24px;">
                      <tr>
                        <td style="font-family: Georgia, serif; font-size: 18px; font-weight: 600; color: #1A1816; padding-bottom: 12px;">
                          Your Assigned Task
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ffffff; border: 1px solid #E6DED6; border-radius: 12px; margin-bottom: 24px;">
                            <tr>
                              <td style="padding: 16px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                                <div style="font-size: 14px; font-weight: 600; color: #1A1816; margin-bottom: 4px;">
                                  ${taskName}
                                </div>
                                <div style="font-size: 12px; color: #777777;">
                                  Target Due Date: ${dueDate}
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    <!-- Button Container -->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 28px 0;">
                      <tr>
                        <td align="center">
                          <a href="${(process.env.APP_URL || 'https://celebrateit-seven.vercel.app').replace(/\/$/, '')}/#/planning_together" target="_blank" style="background-color: #1A1816; color: #ffffff; padding: 14px 32px; border-radius: 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; font-weight: 700; text-decoration: none; display: inline-block; letter-spacing: 1px; text-transform: uppercase;">
                            View Your Wedding Tasks
                          </a>
                        </td>
                      </tr>
                    </table>

                    <p style="font-family: Georgia, serif; font-size: 14px; font-style: italic; color: #555555; line-height: 1.6; margin: 0 0 16px 0;">
                      Please remember, this isn't about doing everything perfectly. It's about being there, lending a hand, and helping ${brideName} enjoy the journey as much as possible.
                    </p>

                    <p style="font-family: Georgia, serif; font-size: 14px; color: #555555; line-height: 1.6; margin: 0;">
                      Thank you for being someone ${brideName} can count on. We’re so happy to have you as part of her wedding journey, and we can’t wait to see the beautiful memories you’ll help create together.
                    </p>

                  </td>
                </tr>

                <!-- Footer Row -->
                <tr>
                  <td style="padding: 24px 30px 32px 30px; border-top: 1px solid #E6DED6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; color: #777777; background-color: #ffffff;">
                    <div>With love,</div>
                    <div style="font-weight: bold; color: #1A1816; margin-top: 2px; font-size: 13px;">The CelebrateIT Team</div>
                    <div style="color: #9E784B; font-weight: 600; font-size: 11px; margin-top: 4px;">Celebrating love. Planning together. Making the journey unforgettable.</div>
                  </td>
                </tr>

              </table>

            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const isLiveSmtp = Boolean(
      process.env.SMTP_HOST && 
      process.env.SMTP_USER && 
      !process.env.SMTP_USER.includes('your-email') &&
      !process.env.SMTP_USER.includes('example.com')
    );

    const fromAddress = (process.env.SMTP_FROM && process.env.SMTP_FROM.includes('@'))
      ? process.env.SMTP_FROM
      : (process.env.SMTP_USER || 'celebrateit.co@gmail.com');

    const info = await transporter.sendMail({
      from: `"CelebrateIT" <${fromAddress}>`,
      to,
      subject,
      html: htmlBody
    });

    console.log(`[CelebrateIT Email API] Email ${isLiveSmtp ? 'DISPATCHED LIVE' : 'SIMULATED/LOGGED'}:`, {
      to,
      subject,
      recipientName: memberName,
      messageId: info?.messageId,
      isLiveSmtp
    });

    return res.status(200).json({
      success: true,
      mode: isLiveSmtp ? 'live_smtp' : 'simulated_dev',
      message: isLiveSmtp
        ? `Live email sent to ${to}!`
        : `Email invitation simulated for ${to}.`,
      details: {
        to,
        subject,
        memberName,
        memberRole,
        messageId: info?.messageId
      }
    });
  } catch (error) {
    console.error('Error sending invitation email:', error);
    return res.status(500).json({ error: 'Failed to send invitation email', details: error.message || String(error) });
  }
};

module.exports = {
  sendInvitationEmail
};
