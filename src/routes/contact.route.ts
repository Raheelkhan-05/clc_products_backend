import { Router, Request, Response } from "express";
import { transporter } from "../utils/mailer";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, company, email, phone, industry, products, message } = req.body;

    if (!name || !company || !email) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const mailOptions = {
    from: `"Career Lab Consulting – Products Division" <${process.env.SMTP_USER}>`,
    to: "info@careerlabconsulting.com",
    subject: `Inquiry Regarding AI Deployment — ${company}`,
    html: `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8" />
    </head>
    <body style="margin:0;padding:0;background-color:#0b1120;font-family:Arial,Helvetica,sans-serif;">
        
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0b1120;padding:40px 0;">
        <tr>
            <td align="center">

            <!-- Main Container -->
            <table width="650" cellpadding="0" cellspacing="0" style="background-color:#111827;border-radius:12px;overflow:hidden;">
                
                <!-- Header -->
                <tr>
                <td style="background:linear-gradient(90deg,#4f46e5,#06b6d4);padding:30px;text-align:center;">
                    <img src="https://www.careerlabconsulting.com/logo.png" width="140" alt="Career Lab Consulting" style="margin-bottom:15px;" />
                    <h1 style="color:white;margin:0;font-size:22px;font-weight:bold;">
                    Enterprise AI Deployment Request
                    </h1>
                    <p style="color:#e0e7ff;margin-top:6px;font-size:13px;">
                    Confidential Business Inquiry
                    </p>
                </td>
                </tr>

                <!-- Body -->
                <tr>
                <td style="padding:35px 40px;color:#e5e7eb;">

                    <h2 style="color:white;font-size:18px;margin-top:0;">
                    New Enterprise Lead Received
                    </h2>

                    <!-- Info Block -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:25px;">
                    
                    <tr>
                        <td style="padding:12px 0;border-bottom:1px solid #1f2937;">
                        <strong style="color:#9ca3af;">Full Name</strong><br/>
                        <span style="color:white;font-size:14px;">${name}</span>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:12px 0;border-bottom:1px solid #1f2937;">
                        <strong style="color:#9ca3af;">Company</strong><br/>
                        <span style="color:white;font-size:14px;">${company}</span>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:12px 0;border-bottom:1px solid #1f2937;">
                        <strong style="color:#9ca3af;">Email Address</strong><br/>
                        <span style="color:white;font-size:14px;">${email}</span>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:12px 0;border-bottom:1px solid #1f2937;">
                        <strong style="color:#9ca3af;">Phone</strong><br/>
                        <span style="color:white;font-size:14px;">${phone || "Not Provided"}</span>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:12px 0;border-bottom:1px solid #1f2937;">
                        <strong style="color:#9ca3af;">Industry</strong><br/>
                        <span style="color:white;font-size:14px;">${industry || "Not Selected"}</span>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:12px 0;border-bottom:1px solid #1f2937;">
                        <strong style="color:#9ca3af;">Products Interested In</strong><br/>
                        <span style="color:white;font-size:14px;">
                            ${products?.length ? products.join(", ") : "None Selected"}
                        </span>
                        </td>
                    </tr>

                    </table>

                    <!-- Message Section -->
                    <div style="margin-top:30px;padding:20px;background-color:#0f172a;border-radius:8px;border:1px solid #1f2937;">
                    <strong style="color:#9ca3af;">Additional Requirements</strong>
                    <p style="color:white;font-size:14px;margin-top:10px;line-height:1.6;">
                        ${message || "No additional details provided."}
                    </p>
                    </div>

                    <!-- CTA -->
                    <div style="margin-top:35px;text-align:center;">
                    <a href="mailto:${email}" 
                        style="background:linear-gradient(90deg,#4f46e5,#06b6d4);
                            padding:12px 24px;
                            color:white;
                            text-decoration:none;
                            border-radius:6px;
                            font-size:14px;
                            font-weight:bold;">
                        Respond to Inquiry
                    </a>
                    </div>

                </td>
                </tr>

                <!-- Footer -->
                <tr>
                <td style="background-color:#0b1120;padding:25px;text-align:center;">
                    <p style="color:#6b7280;font-size:11px;margin:0;">
                    © ${new Date().getFullYear()} Career Lab Consulting – AI Infrastructure Division
                    </p>
                    <p style="color:#6b7280;font-size:11px;margin-top:6px;">
                    Secure · Scalable · Autonomous Systems
                    </p>
                </td>
                </tr>

            </table>

            </td>
        </tr>
        </table>

    </body>
    </html>
    `,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "Email sent successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;