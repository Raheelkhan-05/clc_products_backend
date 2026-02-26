import { Router, Request, Response } from "express";
import { transporter } from "../utils/mailer";

const router = Router();

/* =========================================================
   COLOUR TOKENS (light theme)
   --bg-page:       #f1f5f9   outer page background
   --bg-card:       #ffffff   email card
   --bg-row-alt:    #f8fafc   alternating table row
   --bg-header:     #0f172a   dark navy header
   --accent:        #1d4ed8   primary dark blue
   --accent-light:  #eff6ff   very light blue tint
   --text-primary:  #0f172a
   --text-secondary:#475569
   --text-muted:    #94a3b8
   --border:        #e2e8f0
========================================================= */

/* =========================================================
   SHARED HELPERS
========================================================= */
function buildProductHtml(products: string[] | undefined): string {
  if (!products || products.length === 0) {
    return `<span style="font-size:14px;color:#0f172a;font-weight:500;">General Inquiry</span>`;
  }
  if (products.length === 1) {
    return `<span style="font-size:14px;color:#0f172a;font-weight:500;">${products[0]}</span>`;
  }
  return `<ul style="margin:0;padding-left:18px;">${products
    .map((p) => `<li style="font-size:14px;color:#0f172a;font-weight:500;padding:2px 0;">${p}</li>`)
    .join("")}</ul>`;
}

function detailRow(label: string, valueHtml: string, alt: boolean = false) {
  const bg = alt ? "#f8fafc" : "#ffffff";
  return `
    <tr>
      <td style="padding:12px 20px;border-bottom:1px solid #e2e8f0;width:32%;vertical-align:top;background-color:${bg};">
        <span style="font-size:11px;font-weight:700;color:#1d4ed8;text-transform:uppercase;letter-spacing:1px;">${label}</span>
      </td>
      <td style="padding:12px 20px;border-bottom:1px solid #e2e8f0;vertical-align:top;background-color:${bg};">
        ${valueHtml}
      </td>
    </tr>
  `;
}

/* =========================================================
   SHARED FOOTER
========================================================= */
function sharedFooter(currentYear: number) {
  const socials = [
    {
      label: "Facebook",
      href: "https://www.facebook.com/careerlabconsultingofficial",
      src: "https://upload.wikimedia.org/wikipedia/en/thumb/0/04/Facebook_f_logo_%282021%29.svg/1280px-Facebook_f_logo_%282021%29.svg.png",
    },
    {
      label: "X",
      href: "https://x.com/CareerLabConsul",
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/X_logo_2023.svg/500px-X_logo_2023.svg.png",
    },
    {
      label: "Instagram",
      href: "https://www.instagram.com/careerlabconsultingofficial",
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/1280px-Instagram_icon.png",
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/company/38144534",
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/LinkedIn_icon.svg/250px-LinkedIn_icon.svg.png",
    },
    {
      label: "YouTube",
      href: "https://www.youtube.com/@careerlabconsulting4691",
      src: "https://upload.wikimedia.org/wikipedia/commons/e/ef/Youtube_logo.png",
    },
  ];

  const iconCells = socials
    .map(
      (s) => `
        <td style="padding:0 10px;">
          <a href="${s.href}" target="_blank" style="text-decoration:none;display:inline-block;">
            <img src="${s.src}" width="22" alt="${s.label}" style="display:block;border:0;">
          </a>
        </td>
      `
    )
    .join("");

  return `
    <tr>
      <td style="background-color:#e6ecfa;padding:36px 36px;text-align:center;">
        
        <!-- Social Icons -->
        <table cellpadding="0" cellspacing="0" role="presentation" style="margin:0 auto 20px;">
          <tr>${iconCells}</tr>
        </table>

        <!-- Brand Name -->
        <p style="margin:0 0 8px 0;font-size:12px;font-weight:700;color:#1e293b;letter-spacing:0.3px;">
          Career Lab Consulting
        </p>

        <p style="margin:0 0 8px 0;font-size:13px;color:#334155;">
          📞 <a href="tel:+918700236923" style="color:#334155;text-decoration:none;">
          +91 870023 6923
          </a>
          &nbsp;&nbsp; | &nbsp;&nbsp;
          ✉ <a href="mailto:info@careerlabconsulting.com" style="color:#334155;text-decoration:none;">
          info@careerlabconsulting.com
          </a>
        </p>

        <!-- Copyright -->
        <p style="margin:0;font-size:12px;color:#64748b;">
          © ${currentYear} All rights reserved · Enterprise AI Solutions
        </p>

      </td>
    </tr>
  `;
}

/* =========================================================
   AI ILLUSTRATION — user email only
   Pure HTML/CSS, no external images, renders in all clients.
   Design: dark navy card with layered "brain/network" motif —
   concentric rings, labelled stat chips, and connecting lines.
========================================================= */
function aiIllustration() {
  // A visually rich "AI" hero block built from styled HTML elements
  // Uses only inline styles + tables — safe for Gmail/Outlook
  return `
    <tr>
      <td style="background: linear-gradient(135deg, #020c1b 0%, #0a1f3d 50%, #0c2a52 100%); padding: 0; line-height: 0;">
        
        <!-- Top accent line -->
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
          <tr>
            <td style="height:3px;background:linear-gradient(90deg,#1d4ed8,#3b82f6,#60a5fa,#3b82f6,#1d4ed8);line-height:3px;font-size:1px;">&nbsp;</td>
          </tr>
        </table>

        <!-- Main illustration area -->
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
          <tr>
            <td align="center" style="padding: 48px 36px 44px 36px;">

              <!-- Glowing node cluster (decorative circles) -->
              <table cellpadding="0" cellspacing="0" role="presentation" style="margin:0 auto 28px auto;">
                <tr>
                  <td style="padding:0 6px;">
                    <div style="width:12px;height:12px;border-radius:50%;background-color:#1d4ed8;display:inline-block;">&nbsp;</div>
                  </td>
                  <td style="padding:0 6px;">
                    <div style="width:8px;height:8px;border-radius:50%;background-color:#3b82f6;display:inline-block;margin-top:2px;">&nbsp;</div>
                  </td>
                  <td style="padding:0 6px;">
                    <!-- Central large node -->
                    <div style="width:52px;height:52px;border-radius:50%;background:linear-gradient(135deg,#2563eb,#60a5fa);display:inline-block;text-align:center;line-height:52px;">
                      <span style="font-size:22px;line-height:52px;display:inline-block;">✦</span>
                    </div>
                  </td>
                  <td style="padding:0 6px;">
                    <div style="width:8px;height:8px;border-radius:50%;background-color:#3b82f6;display:inline-block;margin-top:2px;">&nbsp;</div>
                  </td>
                  <td style="padding:0 6px;">
                    <div style="width:12px;height:12px;border-radius:50%;background-color:#1d4ed8;display:inline-block;">&nbsp;</div>
                  </td>
                </tr>
              </table>

              <!-- Eyebrow label -->
              <p style="margin:0 0 10px 0;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#3b82f6;">
                Enterprise AI Solutions
              </p>

              <!-- Headline -->
              <h1 style="margin:0 0 16px 0;font-size:30px;font-weight:800;color:#f0f9ff;line-height:1.25;letter-spacing:-0.5px;">
                Intelligence.<br>Reimagined.
              </h1>

              <!-- Subline -->
              <p style="margin:0;font-size:14px;color:#93c5fd;line-height:1.6;max-width:380px;">
                Transforming how enterprises operate through<br>
                custom AI strategy, automation, and deployment.
              </p>

              <!-- Decorative divider dots -->
              <table cellpadding="0" cellspacing="0" role="presentation" style="margin:24px auto 0 auto;">
                <tr>
                  <td style="padding:0 3px;"><div style="width:5px;height:5px;border-radius:50%;background-color:#1d4ed8;">&nbsp;</div></td>
                  <td style="padding:0 3px;"><div style="width:5px;height:5px;border-radius:50%;background-color:#2563eb;">&nbsp;</div></td>
                  <td style="padding:0 3px;"><div style="width:5px;height:5px;border-radius:50%;background-color:#3b82f6;">&nbsp;</div></td>
                  <td style="padding:0 3px;"><div style="width:5px;height:5px;border-radius:50%;background-color:#60a5fa;">&nbsp;</div></td>
                  <td style="padding:0 3px;"><div style="width:5px;height:5px;border-radius:50%;background-color:#93c5fd;">&nbsp;</div></td>
                  <td style="padding:0 3px;"><div style="width:5px;height:5px;border-radius:50%;background-color:#60a5fa;">&nbsp;</div></td>
                  <td style="padding:0 3px;"><div style="width:5px;height:5px;border-radius:50%;background-color:#3b82f6;">&nbsp;</div></td>
                  <td style="padding:0 3px;"><div style="width:5px;height:5px;border-radius:50%;background-color:#2563eb;">&nbsp;</div></td>
                  <td style="padding:0 3px;"><div style="width:5px;height:5px;border-radius:50%;background-color:#1d4ed8;">&nbsp;</div></td>
                </tr>
              </table>

            </td>
          </tr>
        </table>

        <!-- Bottom accent line -->
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
          <tr>
            <td style="height:2px;background:linear-gradient(90deg,transparent,#1d4ed8,#3b82f6,#1d4ed8,transparent);line-height:2px;font-size:1px;">&nbsp;</td>
          </tr>
        </table>

      </td>
    </tr>
  `;
}

/* =========================================================
   VIDEO CTA BLOCK — clean, simple light design
========================================================= */
function videoCtaBlock() {
  return `
    <tr>
      <td style="padding:0 36px 36px 36px;">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
          style="background-color:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;overflow:hidden;">
          <tr>
            <td style="padding:24px 28px;">

              <!-- Left-aligned content -->
              <p style="margin:0 0 6px 0;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#1d4ed8;">
                Featured Video
              </p>
              <p style="margin:0 0 4px 0;font-size:16px;font-weight:700;color:#0f172a;line-height:1.35;">
                See How AI Is Revolutionising Enterprise Operations
              </p>
              <p style="margin:0 0 20px 0;font-size:13px;color:#475569;line-height:1.6;">
                Discover how leading organisations are automating workflows and making smarter decisions with AI.
              </p>

              <!-- Watch button -->
              <a href="https://youtu.be/llMzBGyC67E?si=wgaPbRFaJ-7rXzbu"
                style="display:inline-block;background-color:#1d4ed8;color:#ffffff;font-size:13px;font-weight:700;text-decoration:none;padding:11px 24px;border-radius:6px;">
                ▶ &nbsp;Watch Now
              </a>

            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;
}

/* =========================================================
   ROUTE
========================================================= */
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, company, email, phone, industry, products, message } = req.body;

    if (!name || !company || !email) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const currentYear = new Date().getFullYear();
    const logoUrl = "https://www.careerlabconsulting.com/logo.png";
    const productHtml = buildProductHtml(products);

    /* =========================================================
        ADMIN EMAIL  —  light theme, no illustration
    ========================================================== */
    const adminMail = {
      from: `"Career Lab Consulting" <${process.env.SMTP_USER}>`,
      to: "info@careerlabconsulting.com",
      subject: `New Inquiry from ${company} — Career Lab Consulting`,
      html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Inquiry</title>
      </head>
      <body style="margin:0;padding:0;font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="padding:32px 16px;">
          <tr>
            <td align="center">
              <table width="580" cellpadding="0" cellspacing="0" role="presentation"
                style="max-width:580px;width:100%;background-color:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 1px 4px rgba(0,0,0,0.06);">

                <!-- Header: dark navy bar -->
                <tr>
                  <td style="background-color:#0f172a;padding:26px 36px;">
                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td>
                          <img src="${logoUrl}" width="160" alt="Career Lab Consulting" style="display:block;height:auto;max-width:160px;">
                        </td>
                        <td align="right" style="vertical-align:middle;">
                          <span style="display:inline-block;background-color:#1e3a5f;border:1px solid #1d4ed8;border-radius:20px;padding:5px 14px;font-size:11px;font-weight:700;color:#93c5fd;letter-spacing:1.5px;text-transform:uppercase;">
                            New Lead
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Accent stripe -->
                <tr>
                  <td style="height:3px;background:linear-gradient(90deg,#1d4ed8,#3b82f6,#1d4ed8);line-height:3px;font-size:1px;">&nbsp;</td>
                </tr>

                <!-- Company heading -->
                <tr>
                  <td style="padding:32px 36px 20px 36px;border-bottom:1px solid #e2e8f0;">
                    <p style="margin:0 0 4px 0;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#1d4ed8;">
                      Inquiry From
                    </p>
                    <h1 style="margin:0;font-size:24px;font-weight:800;color:#0f172a;">${company}</h1>
                  </td>
                </tr>

                <!-- Details table -->
                <tr>
                  <td style="padding:24px 36px 0 36px;">
                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
                      style="border-radius:8px;overflow:hidden;border:1px solid #e2e8f0;">
                      ${detailRow("Name",     `<span style="font-size:14px;color:#0f172a;font-weight:500;">${name}</span>`,     false)}
                      ${detailRow("Email",    `<span style="font-size:14px;color:#1d4ed8;font-weight:500;">${email}</span>`,    true)}
                      ${detailRow("Phone",    `<span style="font-size:14px;color:#0f172a;font-weight:500;">${phone || "Not provided"}</span>`,    false)}
                      ${detailRow("Industry", `<span style="font-size:14px;color:#0f172a;font-weight:500;">${industry || "Not specified"}</span>`, true)}
                      ${detailRow("Products", productHtml, false)}
                    </table>
                  </td>
                </tr>

                <!-- Message -->
                <tr>
                  <td style="padding:24px 36px 0 36px;">
                    <p style="margin:0 0 10px 0;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#1d4ed8;">
                      Message
                    </p>
                    <div style="background-color:#f8fafc;border:1px solid #e2e8f0;border-left:3px solid #1d4ed8;border-radius:6px;padding:16px 20px;">
                      <p style="margin:0;font-size:14px;line-height:1.75;color:#475569;font-style:italic;">
                        "${message || "No message provided."}"
                      </p>
                    </div>
                  </td>
                </tr>

                <!-- CTA -->
                <tr>
                  <td style="padding:28px 36px 36px 36px;">
                    <a href="mailto:${email}"
                      style="display:inline-block;background-color:#1d4ed8;color:#ffffff;font-size:13px;font-weight:700;text-decoration:none;padding:12px 26px;border-radius:6px;">
                      Reply to ${name.split(" ")[0]} →
                    </a>
                  </td>
                </tr>

                ${sharedFooter(currentYear)}

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>`
    };

    /* =========================================================
        USER EMAIL  —  light theme + AI illustration
    ========================================================== */
    const userMail = {
      from: `"Career Lab Consulting" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "We've Received Your Inquiry — Career Lab Consulting",
      html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Thank You</title>
      </head>
      <body style="margin:0;padding:0;font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="padding:32px 16px;">
          <tr>
            <td align="center">
              <table width="580" cellpadding="0" cellspacing="0" role="presentation"
                style="max-width:580px;width:100%;background-color:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 1px 4px rgba(0,0,0,0.06);">

                <!-- Header: dark navy bar with logo -->
                <tr>
                  <td style="background-color:#0f172a;padding:26px 36px;">
                    <img src="${logoUrl}" width="160" alt="Career Lab Consulting" style="display:block;height:auto;max-width:160px;">
                  </td>
                </tr>

                <!-- AI Illustration (user email only) -->
                ${aiIllustration()}

                <!-- Welcome message -->
                <tr>
                  <td style="padding:36px 36px 28px 36px;border-bottom:1px solid #e2e8f0;">
                    <h2 style="margin:0 0 14px 0;font-size:22px;font-weight:800;color:#0f172a;">
                      Thank you, ${name}!
                    </h2>
                    <p style="margin:0 0 12px 0;font-size:15px;color:#475569;line-height:1.7;">
                      We've received your inquiry and our strategy team is already reviewing it.
                    </p>
                    <p style="margin:0 0 12px 0;font-size:15px;color:#475569;line-height:1.7;">
                      One of our AI specialists will be in touch within
                      <strong style="color:#1d4ed8;">24–48 business hours</strong>.
                    </p>
                    <p style="margin:0;font-size:15px;color:#475569;line-height:1.7;">
                      For urgent matters, feel free to reply directly to this email.
                    </p>
                  </td>
                </tr>

                <!-- Submission summary -->
                <tr>
                  <td style="padding:28px 36px 0 36px;">
                    <p style="margin:0 0 12px 0;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#1d4ed8;">
                      Your Submission
                    </p>
                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
                      style="border-radius:8px;overflow:hidden;border:1px solid #e2e8f0;">
                      ${detailRow("Company",  `<span style="font-size:14px;color:#0f172a;font-weight:500;">${company}</span>`,              false)}
                      ${detailRow("Industry", `<span style="font-size:14px;color:#0f172a;font-weight:500;">${industry || "Not specified"}</span>`, true)}
                      ${detailRow("Products", productHtml, false)}
                    </table>
                  </td>
                </tr>

                <!-- Message copy -->
                <tr>
                  <td style="padding:24px 36px 32px 36px;">
                    <p style="margin:0 0 10px 0;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#1d4ed8;">
                      Your Message
                    </p>
                    <div style="background-color:#f8fafc;border:1px solid #e2e8f0;border-left:3px solid #1d4ed8;border-radius:6px;padding:16px 20px;">
                      <p style="margin:0;font-size:14px;line-height:1.75;color:#475569;font-style:italic;">
                        "${message || "No message provided."}"
                      </p>
                    </div>
                  </td>
                </tr>

                <!-- Video CTA -->
                ${videoCtaBlock()}

                <!-- Sign off -->
                <tr>
                  <td style="padding:0 36px 36px 36px;border-top:1px solid #e2e8f0;">
                    <p style="margin:24px 0 2px 0;font-size:14px;color:#475569;">Warm regards,</p>
                    <p style="margin:0;font-size:14px;font-weight:700;color:#0f172a;">The Career Lab Consulting Team</p>
                  </td>
                </tr>

                ${sharedFooter(currentYear)}

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>`
    };

    await transporter.sendMail(adminMail);
    await transporter.sendMail(userMail);

    res.json({ success: true, message: "Emails sent successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;