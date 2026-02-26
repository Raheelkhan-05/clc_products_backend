import { Router, Request, Response } from "express";
import { transporter } from "../utils/mailer";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, company, email, phone, industry, products, message } = req.body;

    if (!name || !company || !email) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    /* =========================================================
       ADMIN EMAIL (Clean White SaaS Design)
    ========================================================== */

    const adminMail = {
  from: `"Career Lab Consulting – Products Division" <${process.env.SMTP_USER}>`,
  to: "info@careerlabconsulting.com",
  subject: `New AI Deployment Inquiry — ${company}`,
  html: `
  <!DOCTYPE html>
  <html>
  <body style="margin:0;padding:0;background:#f3f4f6;font-family: Arial, Helvetica, sans-serif;">
  
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
  <tr>
  <td align="center">

    <table width="680" cellpadding="0" cellspacing="0"
      style="background:#ffffff;border-radius:12px;box-shadow:0 8px 30px rgba(0,0,0,0.06);overflow:hidden;">
      
      <!-- HEADER -->
      <tr>
        <td style="background:#020617;padding:35px;text-align:center;">
          <img src="https://www.careerlabconsulting.com/logo.png"
               width="150" alt="Career Lab Consulting"
               style="display:block;margin:0 auto 18px auto;" />
          <h1 style="margin:0;color:#ffffff;font-weight:600;font-size:20px;letter-spacing:0.3px;">
            New Enterprise AI Inquiry
          </h1>
          <p style="margin-top:8px;color:#cbd5e1;font-size:14px;">
            Confidential Lead Notification
          </p>
        </td>
      </tr>

      <!-- BODY -->
      <tr>
        <td style="padding:45px 50px;color:#1f2937;font-size:14px;line-height:1.6;">

          <h3 style="margin-top:0;color:#111827;font-weight:600;">
            Contact Information
          </h3>

          <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;">
            ${infoRow("Full Name", name)}
            ${infoRow("Company", company)}
            ${infoRow("Email Address", email)}
            ${infoRow("Phone", phone || "Not Provided")}
            ${infoRow("Industry", industry || "Not Selected")}
            ${infoRow("Products Interested", products?.length ? products.join(", ") : "None Selected")}
          </table>

          <div style="margin-top:35px;padding:22px;background:#f8fafc;border:1px solid #e5e7eb;border-radius:8px;">
            <strong style="color:#111827;">Additional Requirements</strong>
            <p style="margin-top:10px;color:#374151;">
              ${message || "No additional details provided."}
            </p>
          </div>

        </td>
      </tr>

      <!-- FOOTER -->
      <tr>
        <td style="background:#020617;padding:30px;text-align:center;">
          <p style="color:#cbd5e1;font-size:12px;margin:0;">
            © ${new Date().getFullYear()} Career Lab Consulting
          </p>
          <p style="color:#94a3b8;font-size:11px;margin-top:6px;">
            Enterprise AI Solutions
          </p>
        </td>
      </tr>

    </table>

  </td>
  </tr>
  </table>

  </body>
  </html>
  `
};

    /* =========================================================
       THANK YOU EMAIL TO USER
    ========================================================== */

    const userMail = {
  from: `"Career Lab Consulting" <${process.env.SMTP_USER}>`,
  to: email,
  subject: "Thank You for Contacting Career Lab Consulting",
  html: `
  <!DOCTYPE html>
  <html>
  <body style="margin:0;padding:0;background:#f3f4f6;font-family: Arial, Helvetica, sans-serif;">
  
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
  <tr>
  <td align="center">

    <table width="640" cellpadding="0" cellspacing="0"
      style="background:#ffffff;border-radius:12px;box-shadow:0 8px 30px rgba(0,0,0,0.06);overflow:hidden;">
      
      <!-- HEADER -->
      <tr>
        <td style="background:#020617;padding:35px;text-align:center;">
          <img src="https://www.careerlabconsulting.com/logo.png"
               width="140" alt="Career Lab Consulting"
               style="display:block;margin:0 auto;" />
        </td>
      </tr>

      <!-- BODY -->
      <tr>
        <td style="padding:50px;color:#1f2937;font-size:15px;line-height:1.7;">
          
          <h2 style="margin-top:0;color:#111827;font-weight:600;">
            Thank You, ${name}
          </h2>

          <p>
            We appreciate your interest in partnering with Career Lab Consulting 
            for your enterprise AI initiatives.
          </p>

          <p>
            Our solutions team has successfully received your inquiry and 
            will carefully review your requirements.
          </p>

          <p>
            You can expect a response from our specialists within 
            <strong>24–48 business hours</strong>.
          </p>

          <p style="margin-top:30px;">
            If your request is urgent, feel free to reply directly to this email.
          </p>

          <p style="margin-top:35px;">
            Regards,<br/>
            <strong>Career Lab Consulting Team</strong>
          </p>

        </td>
      </tr>

      <!-- FOOTER -->
      <tr>
        <td style="background:#020617;padding:30px;text-align:center;">
          <p style="color:#cbd5e1;font-size:12px;margin:0;">
            © ${new Date().getFullYear()} Career Lab Consulting
          </p>
          <p style="color:#94a3b8;font-size:11px;margin-top:6px;">
            Enterprise AI Solutions
          </p>
        </td>
      </tr>

    </table>

  </td>
  </tr>
  </table>

  </body>
  </html>
  `
};

    /* =========================================================
       SEND BOTH EMAILS
    ========================================================== */

    await transporter.sendMail(adminMail);
    await transporter.sendMail(userMail);

    res.json({ success: true, message: "Emails sent successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* Helper for rows */
function infoRow(label: string, value: string) {
  return `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #e5e7eb;">
        <strong style="color:#6b7280;">${label}</strong><br/>
        <span style="color:#111827;">${value}</span>
      </td>
    </tr>
  `;
}

export default router;