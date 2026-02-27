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
   ALL 9 PRODUCTS GRID  — 3-column desktop / 2-column mobile
   
   KEY FIXES:
   ─────────────────────────────────────────────────────────
   1. TRUE 16:9 via <td> height trick (no position:absolute
      needed — works in ALL email clients including Outlook):
      Each image cell has a fixed height set to 56.25% of its
      column width. Since we can't use % heights in email tds,
      we use a <td> with height set in pixels matching 16:9
      for each breakpoint, and overflow:hidden to crop.
      
      Desktop col width ≈ (580px outer - 72px padding - 48px
      gaps) / 3 ≈ 153px  →  16:9 height = 153 * 9/16 ≈ 86px
      Mobile  col width ≈ (360px - 36px padding - 16px gaps)
      / 2 ≈ 154px  →  height ≈ 87px  (essentially the same)
      
      We set a single fixed pixel height of 86px on the image
      cell and use overflow:hidden + width:100% on the img so
      it crops and fills — identical to object-fit:cover but
      without needing CSS support.
      
   2. MOBILE 2-COL via display:inline-block on td.product-col
      The outer table and tr become display:block so the tds
      can wrap. Each td switches to inline-block at 50% width.
      
   3. EQUAL CARD HEIGHTS per row: a nested table inside the
      content cell uses a spacer row to push the CTA button
      to the bottom regardless of text length.
========================================================= */
function allProductsBlock() {
  const products = [
    { name: "MANEE",   slug: "manee",   tagline: "Omnichannel AI Communication", features: "WhatsApp · Email · AI Voice · Sentiment", url:"https://res.cloudinary.com/dh57lezqe/image/upload/v1772170810/Whisk_q2n3ywmhfdmijmn10smihjytudmjrtlzmzym1in_r7izq1.jpg" },
    { name: "CRM-X",   slug: "crmx",    tagline: "Growth Engine", features: "Marketing Auto · Content Gen · Funnels", url:"https://res.cloudinary.com/dh57lezqe/image/upload/v1772170807/Whisk_45374b0a202b440a35f411d882154f8cdr_b1x2o9.jpg"  },
    { name: "LMS-X",   slug: "lmsx",    tagline: "Learning Intelligence", features: "AR/VR Environments · AI Mentor · Analytics", url:"https://res.cloudinary.com/dh57lezqe/image/upload/v1772170806/Whisk_71afa020a7cf10086944851c0367eb01dr_ntvqoz.jpg" },
    { name: "EduX",    slug: "edux",    tagline: "Institutional OS", features: "ERP + CRM + LMS · Admissions · Campus Ops", url:"https://res.cloudinary.com/dh57lezqe/image/upload/v1772170806/Whisk_55c518517366b83ae0d4dffee8e848e2dr_uebuiy.jpg" },
    { name: "TwinX",   slug: "twinx",   tagline: "Digital Executive Twin", features: "CEO Reports · Dashboard · Decision AI", url:"https://res.cloudinary.com/dh57lezqe/image/upload/v1772170806/Whisk_d1c3c3a02bcc5ff9c6b40b7b7dbdd41cdr_pcl2g8.jpg" },
    { name: "LegalOS", slug: "legalos", tagline: "Autonomous Compliance", features: "Agreement Drafting · Risk · Contracts" , url:"https://res.cloudinary.com/dh57lezqe/image/upload/v1772170807/Whisk_e03bbcb4938ecc6862b423afc929bdf5dr_zs8lfi.jpg" },
    { name: "ERP-X",   slug: "erpx",    tagline: "Finance Command Center", features: "Payroll · Revenue Forecast · Tax Insights", url:"https://res.cloudinary.com/dh57lezqe/image/upload/v1772170807/Whisk_59d6430edd2ab8a80b54195430219f7cdr_hterqs.jpg" },
    { name: "HR-X",    slug: "hrx",     tagline: "Recruitment Intelligence", features: "Avatar Interviews · Screening · Ranking", url:"https://res.cloudinary.com/dh57lezqe/image/upload/v1772170808/Whisk_7388e08f6e43689a4f14a9866c1acd1fdr_ap3vz4.jpg" },
    { name: "SuppX",   slug: "suppx",   tagline: "Support Intelligence", features: "24/7 Agents · Voice + Chat · Tickets", url:"https://res.cloudinary.com/dh57lezqe/image/upload/v1772170809/Whisk_ae23ef1a852206ea879496274361bfcfdr_f9rxr7.jpg" },
  ];

  const baseUrl = "https://www.careerlabconsulting.com";

  /*
   * Image height calculation:
   *   Total email width       = 580px
   *   Outer side padding      = 36px × 2 = 72px  → content = 508px
   *   Inter-card gap (8px×2)  = 16px per card pair, so per-card ≈ 8px each side
   *   3 cards: each card width ≈ (508 - 3×16) / 3 ≈ 154px
   *   16:9 height of 154px    = 154 × 9/16 ≈ 87px  → use 87px
   *
   *   On mobile at 50% of ~360px outer:
   *   each card ≈ (360 - 36 - 16) / 2 ≈ 154px  → same 87px height works
   */
  const IMG_HEIGHT = 87; // px — enforces 16:9 crop for all clients

  const cards = products.map(p => `
    <td class="product-col" valign="top"
      style="width:33.33%;padding:6px;vertical-align:top;box-sizing:border-box;">

      <!-- Card shell: border-radius via wrapping td, overflow:hidden crops image -->
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
        style="background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;
               overflow:hidden;border-collapse:separate;">

        <!-- ── 16:9 Image row: fixed pixel height + overflow:hidden crops to ratio ── -->
        <tr>
          <td style="padding:0;line-height:0;font-size:0;height:${IMG_HEIGHT}px;
                     overflow:hidden;max-height:${IMG_HEIGHT}px;">
            <!--
              width:100% makes the image fill the column width.
              height is intentionally NOT set — the td height + overflow:hidden
              does the cropping. This works in Outlook, Gmail, Apple Mail, all clients.
              The image will scale to fill the width and the excess height is hidden.
            -->
            <img src="${p.url}" alt="${p.name}" width="100%"
              style="display:block;width:100%;height:${IMG_HEIGHT}px;
                     object-fit:cover;border:0;line-height:0;font-size:0;
                     min-height:${IMG_HEIGHT}px;max-height:${IMG_HEIGHT}px;">
          </td>
        </tr>

        <!-- ── Card content ── -->
        <tr>
          <td style="padding:0;">
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation">

              <!-- Text block -->
              <tr>
                <td style="padding:14px 14px 0 14px;vertical-align:top;">

                  <p style="margin:0 0 4px 0;font-size:12px;font-weight:700;
                             color:#0f172a;letter-spacing:0.3px;">
                    ${p.name}
                  </p>

                  <p style="margin:0 0 6px 0;font-size:10px;font-weight:600;
                             color:#1d4ed8;line-height:1.4;">
                    ${p.tagline}
                  </p>

                  <div style="height:1px;background:#e2e8f0;margin:6px 0;"></div>

                  <p style="margin:0;font-size:11px;color:#64748b;line-height:1.6;">
                    ${p.features}
                  </p>

                </td>
              </tr>

              <!-- Flexible spacer — pushes CTA to bottom -->
              <tr>
                <td style="height:12px;line-height:12px;font-size:12px;">&nbsp;</td>
              </tr>

              <!-- CTA — pinned to bottom -->
              <tr>
                <td style="padding:0 14px 14px 14px;">
                  <a href="${baseUrl}/${p.slug}?ref=email-trial"
                    style="display:block;text-align:center;background:#1d4ed8;
                           color:#ffffff;font-size:11px;font-weight:700;
                           text-decoration:none;padding:10px 12px;
                           border-radius:6px;text-transform:uppercase;">
                    Start Free Trial
                  </a>
                </td>
              </tr>

            </table>
          </td>
        </tr>

      </table>
    </td>
  `);

  // Group into rows of 3 for desktop
  const rows: string[] = [];
  for (let i = 0; i < cards.length; i += 3) {
    rows.push(`
      <tr class="product-row" style="vertical-align:top;">
        ${cards.slice(i, i + 3).join("")}
      </tr>
    `);
  }

  return `
    <!--
      RESPONSIVE GRID STRATEGY
      ════════════════════════
      Desktop (≥600px): standard 3-col table — each td is 33.33%
      Mobile  (<600px): media query switches table/tr to display:block
                        and each td to display:inline-block at 50%
                        so cards reflow into 2 columns automatically.

      IMAGE CROPPING (16:9)
      ═════════════════════
      The image <td> has a fixed height of ${IMG_HEIGHT}px + overflow:hidden.
      The <img> is set to width:100% and height:${IMG_HEIGHT}px.
      Combined, this forces every image into a ${IMG_HEIGHT}px tall strip
      that spans the full card width — a true 16:9 crop that works
      in every email client without CSS object-fit support.
    -->
    <style>
      @media only screen and (max-width:599px) {
        /* Make the grid table a block container so tds can wrap */
        table.product-grid,
        tr.product-row {
          display: block !important;
          width: 100% !important;
        }
        /* Whitespace killer on the row */
        tr.product-row {
          font-size: 0 !important;
          line-height: 0 !important;
        }
        /* Each card: 50% width, inline-block so they sit side-by-side */
        td.product-col {
          display: inline-block !important;
          width: 50% !important;
          max-width: 50% !important;
          box-sizing: border-box !important;
          vertical-align: top !important;
          font-size: 14px !important;
          line-height: normal !important;
        }
      }
    </style>

    <!-- Products Section -->
    <tr>
      <td style="padding:36px 36px 0 36px;">

        <!-- Section Header -->
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
          style="margin-bottom:24px;">
          <tr>
            <td align="center">
              <p style="margin:0 0 6px 0;font-size:11px;font-weight:700;letter-spacing:2px;
                         text-transform:uppercase;color:#1d4ed8;">
                The Autonomous Stack
              </p>
              <h3 style="margin:0 0 10px 0;font-size:20px;font-weight:800;color:#0f172a;">
                9 AI Products. One Unified Vision.
              </h3>
              <p style="margin:0;font-size:13px;color:#475569;line-height:1.6;max-width:420px;">
                Explore our enterprise AI suite transforming every business function — each available with a <i><b>14-day free trial</b></i>.
              </p>
            </td>
          </tr>
        </table>

        <!-- Product Grid -->
        <table class="product-grid" width="100%" cellpadding="0" cellspacing="0"
          role="presentation">
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