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
        
        <!-- Company Name -->
        <p style="margin:0 0 6px 0;font-size:14px;font-weight:700;color:#1e293b;letter-spacing:0.5px;">
          CAREER LAB CONSULTING
        </p>

        <!-- Address -->
        <div style="margin:0 0 10px 0;font-size:12px;color:#475569;">
          DLF Cyber City, 5th Floor, Cyber Green 2,<br/> Sec-25, Gurugram, India
        </div>

        <!-- Contact Info -->
        <p style="margin:0 0 8px 0;font-size:13px;font-weight:700;color:#334155;">
          📞 <a href="tel:+918700236923" style="color:#2563eb;text-decoration:none;">
            +91 870023 6923
          </a>
          &nbsp;&nbsp; | &nbsp;&nbsp;
          ✉ <a href="mailto:info@careerlabconsulting.com" style="color:#2563eb;text-decoration:none;">
            info@careerlabconsulting.com
          </a>
        </p>

        <!-- Social Icons -->
        <table cellpadding="0" cellspacing="0" role="presentation" style="margin:20px auto 20px;">
          <tr>${iconCells}</tr>
        </table>

        <!-- Copyright -->
        <p style="margin:0;font-size:12px;color:#64748b;">
          © ${currentYear} Career Lab Consulting. All rights reserved.
        </p>

      </td>
    </tr>
  `;
}

/* =========================================================
   HERO IMAGE BLOCK — replaces AI Illustration
   Keeps top and bottom accent separators intact.
   Replace IMAGE_URL below with your actual hosted image URL.
========================================================= */
function heroImageBlock() {
  // ⬇ Replace this URL with your actual image URL
  const heroImageUrl = "https://res.cloudinary.com/dh57lezqe/image/upload/v1772167158/Banner_dim1qj.jpg";

  return `
    <tr>
      <td style="background-color:#020c1b;padding:0;line-height:0;">

        <!-- Top accent line (preserved) -->
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
          <tr>
            <td style="height:3px;background:linear-gradient(90deg,#1d4ed8,#3b82f6,#60a5fa,#3b82f6,#1d4ed8);line-height:3px;font-size:1px;">&nbsp;</td>
          </tr>
        </table>

        <!-- Hero Image -->
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
          <tr>
            <td align="center" style="padding:0;line-height:0;">
              <img
                src="${heroImageUrl}"
                alt="Career Lab Consulting — Enterprise AI Solutions"
                width="580"
                style="display:block;width:100%;max-width:580px;height:auto;border:0;"
              />
            </td>
          </tr>
        </table>

        <!-- Bottom accent line (preserved) -->
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
   ALL 9 PRODUCTS GRID  — 3-column card grid
   Each card has its own "Start Free Trial" button linking
   to the product's individual page.
========================================================= */
function allProductsBlock() {
  const products = [
    { name: "MANEE",   slug: "manee",   tagline: "Omnichannel AI Communication", emoji: "🤖", features: "WhatsApp · Email · AI Voice · Sentiment" },
    { name: "CRM-X",   slug: "crmx",   tagline: "Growth Engine",                emoji: "📈", features: "Marketing Auto · Content Gen · Funnels"  },
    { name: "LMS-X",   slug: "lmsx",   tagline: "Learning Intelligence",        emoji: "🎓", features: "AR/VR Environments · AI Mentor · Analytics" },
    { name: "EduX",    slug: "edux",   tagline: "Institutional OS",             emoji: "🏛️", features: "ERP + CRM + LMS · Admissions · Campus Ops" },
    { name: "TwinX",   slug: "twinx",  tagline: "Digital Executive Twin",       emoji: "🪪", features: "CEO Reports · Dashboard · Decision AI"    },
    { name: "LegalOS", slug: "legalos",tagline: "Autonomous Compliance",        emoji: "⚖️", features: "Agreement Drafting · Risk · Contracts"    },
    { name: "ERP-X",   slug: "erpx",   tagline: "Finance Command Center",       emoji: "💼", features: "Payroll · Revenue Forecast · Tax Insights" },
    { name: "HR-X",    slug: "hrx",    tagline: "Recruitment Intelligence",     emoji: "👥", features: "Avatar Interviews · Screening · Ranking"  },
    { name: "SuppX",   slug: "suppx",  tagline: "Support Intelligence",         emoji: "🎧", features: "24/7 Agents · Voice + Chat · Tickets"     },
  ];

  const baseUrl = "https://www.careerlabconsulting.com";

  // Build rows of 3
  const rows: string[] = [];
  for (let i = 0; i < products.length; i += 3) {
    const rowProducts = products.slice(i, i + 3);
    const cells = rowProducts
      .map(
        (p) => `
          <td width="33%" style="padding:6px;vertical-align:top;">
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
              style="background-color:#ffffff;border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;height:100%;">
              <!-- Top accent bar -->
              <tr>
                <td style="height:3px;background:linear-gradient(90deg,#1d4ed8,#3b82f6);line-height:3px;font-size:1px;">&nbsp;</td>
              </tr>
              <!-- Content cell — grows to fill available height -->
              <tr>
                <td style="padding:14px 14px 6px 14px;vertical-align:top;">
                  <!-- Emoji icon -->
                  <div style="font-size:22px;margin-bottom:8px;line-height:1;">${p.emoji}</div>
                  <!-- Product name -->
                  <p style="margin:0 0 2px 0;font-size:11px;font-weight:800;color:#1d4ed8;letter-spacing:1.5px;text-transform:uppercase;">${p.name}</p>
                  <!-- Tagline — fixed min-height so all taglines occupy the same vertical space -->
                  <p style="margin:0 0 8px 0;font-size:12px;font-weight:700;color:#0f172a;line-height:1.35;min-height:34px;">${p.tagline}</p>
                  <!-- Divider -->
                  <div style="height:1px;background-color:#e2e8f0;margin-bottom:8px;"></div>
                  <!-- Features — fixed min-height so all feature lines occupy the same vertical space -->
                  <p style="margin:0 0 14px 0;font-size:10px;color:#64748b;line-height:1.6;min-height:32px;">${p.features}</p>
                </td>
              </tr>
              <!-- Free Trial button pinned to card bottom -->
              <tr>
                <td style="padding:0 14px 14px 14px;vertical-align:bottom;">
                  <a href="${baseUrl}/${p.slug}?ref=email-trial"
                    style="display:block;text-align:center;background-color:#1d4ed8;color:#ffffff;font-size:10px;font-weight:700;text-decoration:none;padding:8px 10px;border-radius:6px;letter-spacing:0.5px;text-transform:uppercase;">
                    Start 14-Day Free Trial
                  </a>
                </td>
              </tr>
            </table>
          </td>
        `
      )
      .join("");

    rows.push(`<tr style="vertical-align:stretch;">${cells}</tr>`);
  }

  return `
    <!-- Products Section -->
    <tr>
      <td style="padding:36px 36px 0 36px;">
        
        <!-- Section header -->
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:20px;">
          <tr>
            <td align="center">
              <p style="margin:0 0 6px 0;font-size:11px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:#1d4ed8;">
                The Autonomous Stack
              </p>
              <h3 style="margin:0 0 8px 0;font-size:20px;font-weight:800;color:#0f172a;letter-spacing:-0.3px;">
                9 AI Products. One Unified Vision.
              </h3>
              <p style="margin:0;font-size:13px;color:#475569;line-height:1.6;max-width:400px;">
                Explore our full suite of enterprise AI products built to transform every function of your business — each with a free 14-day trial, no credit card needed.
              </p>
            </td>
          </tr>
        </table>

        <!-- Cards grid -->
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
          ${rows.join("")}
        </table>

      </td>
    </tr>
  `;
}

/* =========================================================
   ENHANCED VIDEO CTA BLOCK — centered, polished
========================================================= */
function videoCtaBlock() {
  return `
    <tr>
      <td style="padding:28px 36px 0 36px;">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
          style="background:linear-gradient(135deg,#eff6ff 0%,#dbeafe 100%);border:1px solid #bfdbfe;border-radius:12px;overflow:hidden;">
          
          <!-- Top tinted accent line -->
          <tr>
            <td style="height:3px;background:linear-gradient(90deg,#1d4ed8,#3b82f6,#1d4ed8);line-height:3px;font-size:1px;">&nbsp;</td>
          </tr>

          <tr>
            <td align="center" style="padding:32px 28px;">
              
              <!-- Play icon circle -->
              <div style="width:56px;height:56px;background:linear-gradient(135deg,#1d4ed8,#3b82f6);border-radius:50%;margin:0 auto 16px auto;text-align:center;line-height:56px;">
                <span style="font-size:22px;line-height:56px;display:inline-block;color:#ffffff;">▶</span>
              </div>

              <!-- Eyebrow -->
              <p style="margin:0 0 6px 0;font-size:11px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:#1d4ed8;">
                While You Wait
              </p>

              <!-- Headline -->
              <h3 style="margin:0 0 10px 0;font-size:18px;font-weight:800;color:#0f172a;letter-spacing:-0.3px;line-height:1.3;">
                See How AI Is Revolutionising<br>Enterprise Operations
              </h3>

              <!-- Description -->
              <p style="margin:0 0 24px 0;font-size:13px;color:#475569;line-height:1.7;max-width:380px;">
                Discover how leading organisations are automating complex workflows, reducing costs, and making smarter decisions with AI — all before our team connects with you.
              </p>

              <!-- CTA Button -->
              <a href="https://youtu.be/llMzBGyC67E?si=wgaPbRFaJ-7rXzbu"
                style="display:inline-block;background-color:#1d4ed8;color:#ffffff;font-size:13px;font-weight:700;text-decoration:none;padding:12px 28px;border-radius:7px;letter-spacing:0.3px;">
                ▶ &nbsp;Watch the Video
              </a>

              <!-- Duration hint -->
              <p style="margin:14px 0 0 0;font-size:11px;color:#94a3b8;">
                5 min watch · No sign-in required
              </p>

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
        ADMIN EMAIL  —  light theme, no illustration (unchanged)
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
        USER EMAIL  —  Updated with hero image, products grid,
                       enhanced video CTA, and improved flow
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

                <!-- ① Header: dark navy bar with logo -->
                <tr>
                  <td style="background-color:#0f172a;padding:26px 36px;">
                    <img src="${logoUrl}" width="160" alt="Career Lab Consulting" style="display:block;height:auto;max-width:160px;">
                  </td>
                </tr>

                <!-- ② Hero Image (replaces AI illustration — separators preserved) -->
                ${heroImageBlock()}

                <!-- ③ Thank You & Confirmation — warm, clear messaging -->
                <tr>
                  <td style="padding:36px 36px 28px 36px;border-bottom:1px solid #e2e8f0;">
                    
                    <!-- Eyebrow -->
                    <p style="margin:0 0 8px 0;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#1d4ed8;">
                      Inquiry Received
                    </p>

                    <h2 style="margin:0 0 16px 0;font-size:22px;font-weight:800;color:#0f172a;line-height:1.3;">
                      Thank you, ${name}!<br>
                      <span style="font-size:18px;font-weight:600;color:#334155;">We're on it.</span>
                    </h2>

                    <p style="margin:0 0 12px 0;font-size:15px;color:#475569;line-height:1.75;">
                      Your inquiry has been received and our AI strategy team is already reviewing your requirements for <strong style="color:#0f172a;">${company}</strong>.
                    </p>

                    <p style="margin:0 0 12px 0;font-size:15px;color:#475569;line-height:1.75;">
                      One of our specialists will reach out within
                      <strong style="color:#1d4ed8;">24–48 business hours</strong> with a tailored plan built around your goals.
                    </p>
                  </td>
                </tr>

                <!-- ④ Submission Summary -->
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

                <!-- ⑤ Message Copy -->
                <tr>
                  <td style="padding:24px 36px 0 36px;">
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

                <!-- ⑥ Divider with "While you wait" heading -->
                <tr>
                  <td style="padding:36px 36px 0 36px;">
                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td style="height:1px;background-color:#e2e8f0;font-size:1px;line-height:1px;">&nbsp;</td>
                      </tr>
                    </table>
                    <p style="margin:20px 0 0 0;font-size:13px;color:#94a3b8;text-align:center;font-style:italic;">
                      While our team prepares your personalised strategy —
                    </p>
                  </td>
                </tr>

                <!-- ⑦ All 9 Products Grid + Free Trial CTA -->
                ${allProductsBlock()}

                <!-- ⑧ Video CTA — enhanced, centered -->
                ${videoCtaBlock()}

                <!-- ⑨ Sign off -->
                <tr>
                  <td style="padding:32px 36px 36px 36px;border-top:1px solid #e2e8f0;margin-top:28px;">
                    <p style="margin:28px 0 4px 0;font-size:14px;color:#475569;">
                      For any urgent matters, feel free to reply directly to this email — we're always here.
                    </p>
                    <p style="margin:16px 0 2px 0;font-size:14px;color:#475569;">Warm regards,</p>
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