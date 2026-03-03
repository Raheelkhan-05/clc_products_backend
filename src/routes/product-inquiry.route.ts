//product-inquiry.route.ts

import { Router, Request, Response } from "express";
import { transporter } from "../utils/mailer";

const router = Router();

const CONTACT_NUMBER = "918700236923";

// ─── Shared helpers ───────────────────────────────────────────────────────────

function sharedFooter(currentYear: number) {
  const socials = [
    { label: "Facebook",  href: "https://www.facebook.com/careerlabconsultingofficial",  src: "https://upload.wikimedia.org/wikipedia/en/thumb/0/04/Facebook_f_logo_%282021%29.svg/1280px-Facebook_f_logo_%282021%29.svg.png" },
    { label: "X",         href: "https://x.com/CareerLabConsul",                         src: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/X_logo_2023.svg/500px-X_logo_2023.svg.png" },
    { label: "Instagram", href: "https://www.instagram.com/careerlabconsultingofficial", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/1280px-Instagram_icon.png" },
    { label: "LinkedIn",  href: "https://www.linkedin.com/company/38144534",             src: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/LinkedIn_icon.svg/250px-LinkedIn_icon.svg.png" },
    { label: "YouTube",   href: "https://www.youtube.com/@careerlabconsulting4691",       src: "https://upload.wikimedia.org/wikipedia/commons/e/ef/Youtube_logo.png" },
  ];

  const iconCells = socials.map(s => `
    <td style="padding:0 10px;">
      <a href="${s.href}" target="_blank" style="text-decoration:none;display:inline-block;">
        <img src="${s.src}" width="22" alt="${s.label}" style="display:block;border:0;">
      </a>
    </td>`).join("");

  return `
  <tr>
    <td style="background-color:#e6ecfa;padding:36px 36px;text-align:center;">
      <p style="margin:0 0 6px 0;font-size:14px;font-weight:700;color:#1e293b;letter-spacing:0.5px;">
        CAREER LAB CONSULTING
      </p>
      <div style="margin:0 0 10px 0;font-size:12px;color:#475569;">
        DLF Cyber City, 5th Floor, Cyber Green 2,<br/> Sec-25, Gurugram, India
      </div>
      <p style="margin:0 0 8px 0;font-size:13px;font-weight:700;color:#334155;">
        📞 <a href="tel:+918700236923" style="color:#2563eb;text-decoration:none;">+91 870023 6923</a>
        &nbsp;&nbsp; | &nbsp;&nbsp;
        ✉ <a href="mailto:info@careerlabconsulting.com" style="color:#2563eb;text-decoration:none;">info@careerlabconsulting.com</a>
      </p>
      <table cellpadding="0" cellspacing="0" role="presentation" style="margin:20px auto 20px;">
        <tr>${iconCells}</tr>
      </table>
      <p style="margin:0;font-size:12px;color:#64748b;">
        © ${currentYear} Career Lab Consulting. All rights reserved.
      </p>
    </td>
  </tr>`;
}

function detailRow(label: string, value: string, shade: boolean = false) {
  const bg = shade ? "#f8fafc" : "#ffffff";
  return `
  <tr>
    <td style="padding:11px 20px;border-bottom:1px solid #e2e8f0;width:30%;vertical-align:top;background:${bg};">
      <span style="font-size:10px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:1.2px;">${label}</span>
    </td>
    <td style="padding:11px 20px;border-bottom:1px solid #e2e8f0;vertical-align:top;background:${bg};">
      <span style="font-size:13px;color:#0f172a;font-weight:500;">${value}</span>
    </td>
  </tr>`;
}

function heroImageBlock() {
  const heroImageUrl = "https://res.cloudinary.com/dh57lezqe/image/upload/v1772289643/ChatGPT_Image_Feb_28_2026_08_05_16_PM_qhn49y.jpg";
  return `
  <tr>
    <td style="background-color:#020c1b;padding:0;line-height:0;">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td style="height:3px;background:linear-gradient(90deg,#1d4ed8,#3b82f6,#60a5fa,#3b82f6,#1d4ed8);line-height:3px;font-size:1px;">&nbsp;</td>
        </tr>
      </table>
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
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td style="height:2px;background:linear-gradient(90deg,transparent,#1d4ed8,#3b82f6,#1d4ed8,transparent);line-height:2px;font-size:1px;">&nbsp;</td>
        </tr>
      </table>
    </td>
  </tr>`;
}

function allProductsBlock() {
  const products = [
    { name: "MANEE",   slug: "manee",   tagline: "Omnichannel AI Communication", features: "WhatsApp · Email · AI Voice · Sentiment", url: "https://res.cloudinary.com/dh57lezqe/image/upload/v1772170810/Whisk_q2n3ywmhfdmijmn10smihjytudmjrtlzmzym1in_r7izq1.jpg" },
    { name: "CRM-X",   slug: "crmx",    tagline: "Growth Engine",                features: "Marketing Auto · Content Gen · Funnels",  url: "https://res.cloudinary.com/dh57lezqe/image/upload/v1772170807/Whisk_45374b0a202b440a35f411d882154f8cdr_b1x2o9.jpg" },
    { name: "LMS-X",   slug: "lmsx",    tagline: "Learning Intelligence",        features: "AR/VR Environments · AI Mentor · Analytics", url: "https://res.cloudinary.com/dh57lezqe/image/upload/v1772170806/Whisk_71afa020a7cf10086944851c0367eb01dr_ntvqoz.jpg" },
    { name: "EduX",    slug: "edux",    tagline: "Institutional OS",             features: "ERP + CRM + LMS · Admissions · Campus Ops", url: "https://res.cloudinary.com/dh57lezqe/image/upload/v1772170806/Whisk_55c518517366b83ae0d4dffee8e848e2dr_uebuiy.jpg" },
    { name: "TwinX",   slug: "twinx",   tagline: "Digital Executive Twin",       features: "CEO Reports · Dashboard · Decision AI",   url: "https://res.cloudinary.com/dh57lezqe/image/upload/v1772170806/Whisk_d1c3c3a02bcc5ff9c6b40b7b7dbdd41cdr_pcl2g8.jpg" },
    { name: "LegalOS", slug: "legalos", tagline: "Autonomous Compliance",        features: "Agreement Drafting · Risk · Contracts",   url: "https://res.cloudinary.com/dh57lezqe/image/upload/v1772170807/Whisk_e03bbcb4938ecc6862b423afc929bdf5dr_zs8lfi.jpg" },
    { name: "ERP-X",   slug: "erpx",    tagline: "Finance Command Center",       features: "Payroll · Revenue Forecast · Tax Insights", url: "https://res.cloudinary.com/dh57lezqe/image/upload/v1772170807/Whisk_59d6430edd2ab8a80b54195430219f7cdr_hterqs.jpg" },
    { name: "HR-X",    slug: "hrx",     tagline: "Recruitment Intelligence",     features: "Avatar Interviews · Screening · Ranking", url: "https://res.cloudinary.com/dh57lezqe/image/upload/v1772170808/Whisk_7388e08f6e43689a4f14a9866c1acd1fdr_ap3vz4.jpg" },
    { name: "SuppX",   slug: "suppx",   tagline: "Support Intelligence",         features: "24/7 Agents · Voice + Chat · Tickets",   url: "https://res.cloudinary.com/dh57lezqe/image/upload/v1772170809/Whisk_ae23ef1a852206ea879496274361bfcfdr_f9rxr7.jpg" },
  ];

  const baseUrl = "https://www.careerlabconsulting.com";
  const IMG_HEIGHT = 87;

  const cards = products.map(p => `
    <td class="product-col" valign="top"
      style="width:33.33%;padding:6px;vertical-align:top;box-sizing:border-box;">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
        style="background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;border-collapse:separate;">
        <tr>
          <td style="padding:0;line-height:0;font-size:0;height:${IMG_HEIGHT}px;overflow:hidden;max-height:${IMG_HEIGHT}px;">
            <img src="${p.url}" alt="${p.name}" width="100%"
              style="display:block;width:100%;height:${IMG_HEIGHT}px;object-fit:cover;border:0;line-height:0;font-size:0;min-height:${IMG_HEIGHT}px;max-height:${IMG_HEIGHT}px;">
          </td>
        </tr>
        <tr>
          <td style="padding:0;">
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
              <tr>
                <td style="padding:14px 14px 0 14px;vertical-align:top;">
                  <p style="margin:0 0 4px 0;font-size:12px;font-weight:700;color:#0f172a;letter-spacing:0.3px;">${p.name}</p>
                  <p style="margin:0 0 6px 0;font-size:10px;font-weight:600;color:#1d4ed8;line-height:1.4;">${p.tagline}</p>
                  <div style="height:1px;background:#e2e8f0;margin:6px 0;"></div>
                  <p style="margin:0;font-size:11px;color:#64748b;line-height:1.6;">${p.features}</p>
                </td>
              </tr>
              <tr>
                <td style="height:12px;line-height:12px;font-size:12px;">&nbsp;</td>
              </tr>
              <tr>
                <td style="padding:0 14px 14px 14px;">
                  <a href="${baseUrl}/${p.slug}?ref=email-trial"
                    style="display:block;text-align:center;background:#1d4ed8;color:#ffffff;font-size:11px;font-weight:700;text-decoration:none;padding:10px 12px;border-radius:6px;text-transform:uppercase;">
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

  const rows: string[] = [];
  for (let i = 0; i < cards.length; i += 3) {
    rows.push(`
      <tr class="product-row" style="vertical-align:top;">
        ${cards.slice(i, i + 3).join("")}
      </tr>
    `);
  }

  return `
    <style>
      @media only screen and (max-width:599px) {
        table.product-grid, tr.product-row { display:block !important; width:100% !important; }
        tr.product-row { font-size:0 !important; line-height:0 !important; }
        td.product-col { display:inline-block !important; width:50% !important; max-width:50% !important; box-sizing:border-box !important; vertical-align:top !important; font-size:14px !important; line-height:normal !important; }
      }
    </style>

    <tr>
      <td style="padding:36px 36px 0 36px;">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:24px;">
          <tr>
            <td align="center">
              <p style="margin:0 0 6px 0;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#1d4ed8;">
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
        <table class="product-grid" width="100%" cellpadding="0" cellspacing="0" role="presentation">
          ${rows.join("")}
        </table>
      </td>
    </tr>`;
}

function videoCtaBlock() {
  return `
  <tr>
    <td style="padding:28px 36px 0 36px;">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
        style="background:linear-gradient(135deg,#eff6ff 0%,#dbeafe 100%);border:1px solid #bfdbfe;border-radius:12px;overflow:hidden;">
        <tr>
          <td style="height:3px;background:linear-gradient(90deg,#1d4ed8,#3b82f6,#1d4ed8);line-height:3px;font-size:1px;">&nbsp;</td>
        </tr>
        <tr>
          <td align="center" style="padding:32px 28px;">
            <div style="width:56px;height:56px;background:linear-gradient(135deg,#1d4ed8,#3b82f6);border-radius:50%;margin:0 auto 16px auto;text-align:center;line-height:56px;">
              <span style="font-size:22px;line-height:56px;display:inline-block;color:#ffffff;">▶</span>
            </div>
            <p style="margin:0 0 6px 0;font-size:11px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:#1d4ed8;">
              While You Wait
            </p>
            <h3 style="margin:0 0 10px 0;font-size:18px;font-weight:800;color:#0f172a;letter-spacing:-0.3px;line-height:1.3;">
              See How AI Is Revolutionising<br>Enterprise Operations
            </h3>
            <p style="margin:0 0 24px 0;font-size:13px;color:#475569;line-height:1.7;max-width:380px;">
              Discover how leading organisations are automating complex workflows, reducing costs, and making smarter decisions with AI — all before our team connects with you.
            </p>
            <a href="https://youtu.be/llMzBGyC67E?si=wgaPbRFaJ-7rXzbu"
              style="display:inline-block;background-color:#1d4ed8;color:#ffffff;font-size:13px;font-weight:700;text-decoration:none;padding:12px 28px;border-radius:7px;letter-spacing:0.3px;">
              ▶ &nbsp;Watch the Video
            </a>
            <p style="margin:14px 0 0 0;font-size:11px;color:#94a3b8;">5 min watch · No sign-in required</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>`;
}

// ─── Admin: Product Inquiry ───────────────────────────────────────────────────
function buildAdminInquiryMail(p: {
  name: string; company: string; email: string; phone: string;
  message: string; productName: string; productTagline: string;
  currentYear: number; logoUrl: string;
}) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>New Product Inquiry</title>
</head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="padding:32px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" role="presentation"
  style="max-width:600px;width:100%;background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e2e8f0;">

  <!-- Header -->
  <tr>
    <td style="background:#0f172a;padding:24px 40px;">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td style="vertical-align:middle;">
            <img src="${p.logoUrl}" width="140" alt="Career Lab Consulting" style="display:block;height:auto;max-width:140px;">
          </td>
          <td align="right" style="vertical-align:middle;">
            <span style="display:inline-block;background:#1e3a5f;border:1px solid #2563eb;border-radius:4px;padding:4px 12px;font-size:10px;font-weight:700;color:#93c5fd;letter-spacing:1.5px;text-transform:uppercase;">
              New Inquiry
            </span>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <tr><td style="height:3px;background:#1d4ed8;font-size:1px;line-height:1px;">&nbsp;</td></tr>

  <!-- Product of interest -->
  <tr>
    <td style="padding:32px 40px 24px 40px;border-bottom:1px solid #e2e8f0;">
      <p style="margin:0 0 6px 0;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#1d4ed8;">Product of Interest</p>
      <h1 style="margin:0 0 4px 0;font-size:22px;font-weight:800;color:#0f172a;letter-spacing:-0.3px;">${p.productName}</h1>
      <p style="margin:0;font-size:13px;color:#64748b;font-weight:500;">${p.productTagline}</p>
    </td>
  </tr>

  <!-- Lead details -->
  <tr>
    <td style="padding:24px 40px 0 40px;">
      <p style="margin:0 0 12px 0;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#64748b;">Lead Details</p>
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
        style="border:1px solid #e2e8f0;border-radius:6px;overflow:hidden;">
        ${detailRow("Name",    p.name,    false)}
        ${detailRow("Company", p.company, true)}
        ${detailRow("Email",   `<a href="mailto:${p.email}" style="color:#1d4ed8;text-decoration:none;">${p.email}</a>`, false)}
        ${detailRow("Phone",   p.phone || "Not provided", true)}
      </table>
    </td>
  </tr>

  <!-- Message -->
  <tr>
    <td style="padding:24px 40px 0 40px;">
      <p style="margin:0 0 10px 0;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#64748b;">Message</p>
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-left:3px solid #1d4ed8;border-radius:4px;padding:16px 20px;">
        <p style="margin:0;font-size:14px;line-height:1.8;color:#475569;font-style:italic;">
          &ldquo;${p.message || "No message provided."}&rdquo;
        </p>
      </div>
    </td>
  </tr>

  <!-- CTA -->
  <tr>
    <td style="padding:28px 40px 36px 40px;">
      <a href="mailto:${p.email}"
        style="display:inline-block;background:#1d4ed8;color:#ffffff;font-size:13px;font-weight:700;text-decoration:none;padding:11px 24px;border-radius:5px;letter-spacing:0.2px;">
        Reply to ${p.name.split(" ")[0]}
      </a>
    </td>
  </tr>

  ${sharedFooter(p.currentYear)}
</table>
</td></tr>
</table>
</body></html>`;
}

// ─── Admin: Booking ───────────────────────────────────────────────────────────
function buildAdminBookingMail(p: {
  name: string; company: string; email: string; phone: string;
  date: string; slot: string; productName: string; productTagline: string;
  currentYear: number; logoUrl: string;
}) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>New Consultation Booking</title>
</head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="padding:32px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" role="presentation"
  style="max-width:600px;width:100%;background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e2e8f0;">

  <!-- Header -->
  <tr>
    <td style="background:#0f172a;padding:24px 40px;">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td style="vertical-align:middle;">
            <img src="${p.logoUrl}" width="140" alt="Career Lab Consulting" style="display:block;height:auto;max-width:140px;">
          </td>
          <td align="right" style="vertical-align:middle;">
            <span style="display:inline-block;background:#064e3b;border:1px solid #10b981;border-radius:4px;padding:4px 12px;font-size:10px;font-weight:700;color:#6ee7b7;letter-spacing:1.5px;text-transform:uppercase;">
              New Booking
            </span>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <tr><td style="height:3px;background:#10b981;font-size:1px;line-height:1px;">&nbsp;</td></tr>

  <!-- Booking headline -->
  <tr>
    <td style="padding:32px 40px 24px 40px;border-bottom:1px solid #e2e8f0;">
      <p style="margin:0 0 6px 0;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#10b981;">Consultation Booked</p>
      <h1 style="margin:0 0 4px 0;font-size:22px;font-weight:800;color:#0f172a;letter-spacing:-0.3px;">${p.productName}</h1>
      <p style="margin:0;font-size:13px;color:#64748b;font-weight:500;">${p.productTagline}</p>
    </td>
  </tr>

  <!-- Slot highlight -->
  <tr>
    <td style="padding:24px 40px 0 40px;">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
        style="background:#f0fdf4;border:1px solid #bbf7d0;border-left:4px solid #10b981;border-radius:6px;overflow:hidden;">
        <tr>
          <td style="padding:18px 24px;">
            <p style="margin:0 0 4px 0;font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#065f46;">Scheduled Slot</p>
            <p style="margin:0 0 2px 0;font-size:18px;font-weight:800;color:#0f172a;">${p.date}</p>
            <p style="margin:0;font-size:14px;font-weight:700;color:#1d4ed8;">${p.slot} IST</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- Lead details -->
  <tr>
    <td style="padding:24px 40px 0 40px;">
      <p style="margin:0 0 12px 0;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#64748b;">Attendee Details</p>
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
        style="border:1px solid #e2e8f0;border-radius:6px;overflow:hidden;">
        ${detailRow("Name",    p.name,    false)}
        ${detailRow("Company", p.company, true)}
        ${detailRow("Email",   `<a href="mailto:${p.email}" style="color:#1d4ed8;text-decoration:none;">${p.email}</a>`, false)}
        ${detailRow("Phone",   p.phone || "Not provided", true)}
      </table>
    </td>
  </tr>

  <!-- CTA -->
  <tr>
    <td style="padding:28px 40px 36px 40px;">
      <a href="mailto:${p.email}"
        style="display:inline-block;background:#1d4ed8;color:#ffffff;font-size:13px;font-weight:700;text-decoration:none;padding:11px 24px;border-radius:5px;">
        Reply to ${p.name.split(" ")[0]}
      </a>
    </td>
  </tr>

  ${sharedFooter(p.currentYear)}
</table>
</td></tr>
</table>
</body></html>`;
}

// ─── User: Inquiry confirmation ───────────────────────────────────────────────
function buildUserInquiryMail(p: {
  name: string; company: string; email: string; message: string;
  productName: string; productTagline: string;
  currentYear: number; logoUrl: string;
}) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Inquiry Received</title>
</head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="padding:32px 16px;">
<tr><td align="center">
<table width="580" cellpadding="0" cellspacing="0" role="presentation"
  style="max-width:580px;width:100%;background-color:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 1px 4px rgba(0,0,0,0.06);">

  <!-- ① Header: dark navy bar with logo -->
  <tr>
    <td style="background-color:#0f172a;padding:26px 36px;">
      <img src="${p.logoUrl}" width="160" alt="Career Lab Consulting" style="display:block;height:auto;max-width:160px;">
    </td>
  </tr>

  <!-- ② Hero Image -->
  ${heroImageBlock()}

  <!-- ③ Thank You & Confirmation -->
  <tr>
    <td style="padding:36px 36px 28px 36px;border-bottom:1px solid #e2e8f0;">
      <p style="margin:0 0 8px 0;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#1d4ed8;">
        Inquiry Received
      </p>
      <h2 style="margin:0 0 16px 0;font-size:22px;font-weight:800;color:#0f172a;line-height:1.3;">
        Thank you, ${p.name.split(" ")[0]}!<br>
        <span style="font-size:18px;font-weight:600;color:#334155;">We're on it.</span>
      </h2>
      <p style="margin:0 0 12px 0;font-size:15px;color:#475569;line-height:1.75;">
        Your inquiry for <strong style="color:#0f172a;">${p.productName}</strong> has been received and our AI strategy team is already reviewing your requirements for <strong style="color:#0f172a;">${p.company}</strong>.
      </p>
      <p style="margin:0;font-size:15px;color:#475569;line-height:1.75;">
        One of our specialists will reach out within <strong style="color:#1d4ed8;">24–48 business hours</strong> with a tailored plan built around your goals.
      </p>
    </td>
  </tr>

  <!-- ④ Submission Summary -->
  <tr>
    <td style="padding:32px 36px 0 36px;">
      <p style="margin:0 0 16px 0;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#1d4ed8;">
        Submission Summary
      </p>

      <!-- Company card -->
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:12px;">
        <tr>
          <td>
            <div style="background-color:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:16px 20px;">
              <span style="font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;display:block;margin-bottom:4px;">Company</span>
              <span style="font-size:15px;color:#1e293b;font-weight:700;">${p.company}</span>
            </div>
          </td>
        </tr>
      </table>

      <!-- Product card -->
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:12px;">
        <tr>
          <td>
            <div style="background:linear-gradient(135deg,#ffffff 0%,#f8fafc 100%);border:1px solid #e2e8f0;border-left:4px solid #1d4ed8;border-radius:12px;padding:18px 20px;">
              <span style="font-size:10px;font-weight:700;color:#1d4ed8;text-transform:uppercase;letter-spacing:1px;display:block;margin-bottom:6px;">Product of Interest</span>
              <span style="font-size:16px;font-weight:800;color:#0f172a;display:block;margin-bottom:2px;">${p.productName}</span>
              <span style="font-size:12px;color:#64748b;font-weight:500;">${p.productTagline}</span>
            </div>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- ⑤ Message Copy -->
  <tr>
    <td style="padding:20px 36px 0 36px;">
      <p style="margin:0 0 10px 0;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#1d4ed8;">
        Your Message
      </p>
      <div style="background-color:#f8fafc;border:1px solid #e2e8f0;border-left:3px solid #1d4ed8;border-radius:6px;padding:16px 20px;">
        <p style="margin:0;font-size:14px;line-height:1.75;color:#475569;font-style:italic;">
          &ldquo;${p.message || "No message provided."}&rdquo;
        </p>
      </div>
    </td>
  </tr>

  <!-- ⑥ Divider + "While you wait" -->
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

  <!-- ⑦ All 9 Products Grid -->
  ${allProductsBlock()}

  <!-- ⑧ Video CTA -->
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

  ${sharedFooter(p.currentYear)}

</table>
</td></tr>
</table>
</body></html>`;
}

// ─── User: Booking confirmation ───────────────────────────────────────────────
function buildUserBookingMail(p: {
  name: string; company: string; email: string;
  date: string; slot: string;
  productName: string; productTagline: string;
  currentYear: number; logoUrl: string;
}) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Consultation Confirmed</title>
</head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="padding:32px 16px;">
<tr><td align="center">
<table width="580" cellpadding="0" cellspacing="0" role="presentation"
  style="max-width:580px;width:100%;background-color:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 1px 4px rgba(0,0,0,0.06);">

  <!-- ① Header: dark navy bar with logo -->
  <tr>
    <td style="background-color:#0f172a;padding:26px 36px;">
      <img src="${p.logoUrl}" width="160" alt="Career Lab Consulting" style="display:block;height:auto;max-width:160px;">
    </td>
  </tr>

  <!-- ② Hero Image -->
  ${heroImageBlock()}

  <!-- ③ Greeting & confirmation -->
  <tr>
    <td style="padding:36px 36px 28px 36px;border-bottom:1px solid #e2e8f0;">
      <p style="margin:0 0 8px 0;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#1d4ed8;">
        Consultation Confirmed
      </p>
      <h2 style="margin:0 0 16px 0;font-size:22px;font-weight:800;color:#0f172a;line-height:1.3;">
        Your session is booked, ${p.name.split(" ")[0]}.<br>
        <span style="font-size:18px;font-weight:600;color:#334155;">We'll see you then.</span>
      </h2>
      <p style="margin:0;font-size:15px;color:#475569;line-height:1.75;">
        A solution architect will walk you through <strong style="color:#0f172a;">${p.productName}</strong> and how it can be tailored to the needs of <strong style="color:#0f172a;">${p.company}</strong>.
      </p>
    </td>
  </tr>

  <!-- ④ Appointment Summary -->
  <tr>
    <td style="padding:32px 36px 0 36px;">
      <p style="margin:0 0 16px 0;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#1d4ed8;">
        Your Appointment
      </p>

      <!-- Date & time card -->
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:12px;">
        <tr>
          <td>
            <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-left:4px solid #10b981;border-radius:12px;padding:20px 24px;">
              <table cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="padding-right:40px;vertical-align:top;">
                    <span style="font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#065f46;display:block;margin-bottom:4px;">Date</span>
                    <span style="font-size:16px;font-weight:800;color:#0f172a;">${p.date}</span>
                  </td>
                  <td style="vertical-align:top;">
                    <span style="font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#065f46;display:block;margin-bottom:4px;">Time</span>
                    <span style="font-size:16px;font-weight:800;color:#1d4ed8;">${p.slot} IST</span>
                  </td>
                </tr>
              </table>
            </div>
          </td>
        </tr>
      </table>

      <!-- Product card -->
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:12px;">
        <tr>
          <td>
            <div style="background:linear-gradient(135deg,#ffffff 0%,#f8fafc 100%);border:1px solid #e2e8f0;border-left:4px solid #1d4ed8;border-radius:12px;padding:18px 20px;">
              <span style="font-size:10px;font-weight:700;color:#1d4ed8;text-transform:uppercase;letter-spacing:1px;display:block;margin-bottom:6px;">Session Topic</span>
              <span style="font-size:16px;font-weight:800;color:#0f172a;display:block;margin-bottom:2px;">${p.productName}</span>
              <span style="font-size:12px;color:#64748b;font-weight:500;">${p.productTagline}</span>
            </div>
          </td>
        </tr>
      </table>

      <!-- Company card -->
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:12px;">
        <tr>
          <td>
            <div style="background-color:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:16px 20px;">
              <span style="font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;display:block;margin-bottom:4px;">Company</span>
              <span style="font-size:15px;color:#1e293b;font-weight:700;">${p.company}</span>
            </div>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- ⑤ Preparation checklist -->
  <tr>
    <td style="padding:20px 36px 0 36px;">
      <p style="margin:0 0 14px 0;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#1d4ed8;">
        To Make the Most of Your Session
      </p>
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:20px 24px;">
        ${[
          "Have your current workflow or key pain points noted down.",
          "Consider your team size, budget range, and integration needs.",
          "We will share a meeting link via WhatsApp ahead of the call.",
        ].map(item => `
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:10px;">
          <tr>
            <td style="vertical-align:top;width:18px;padding-right:10px;">
              <div style="width:6px;height:6px;background:#1d4ed8;border-radius:50%;margin-top:6px;"></div>
            </td>
            <td style="vertical-align:top;">
              <p style="margin:0;font-size:13px;color:#334155;line-height:1.65;">${item}</p>
            </td>
          </tr>
        </table>`).join("")}
      </div>
    </td>
  </tr>

  <!-- ⑥ Divider + "While you wait" -->
  <tr>
    <td style="padding:36px 36px 0 36px;">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td style="height:1px;background-color:#e2e8f0;font-size:1px;line-height:1px;">&nbsp;</td>
        </tr>
      </table>
      <p style="margin:20px 0 0 0;font-size:13px;color:#94a3b8;text-align:center;font-style:italic;">
        While our team prepares your session —
      </p>
    </td>
  </tr>

  <!-- ⑦ All 9 Products Grid -->
  ${allProductsBlock()}

  <!-- ⑧ Video CTA -->
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

  ${sharedFooter(p.currentYear)}

</table>
</td></tr>
</table>
</body></html>`;
}

// ─── Routes ───────────────────────────────────────────────────────────────────

router.post("/inquiry", async (req: Request, res: Response) => {
  try {
    const { name, company, email, phone, message, productName, productTagline } = req.body;
    if (!name || !company || !email || !productName)
      return res.status(400).json({ success: false, message: "Missing required fields" });

    const currentYear = new Date().getFullYear();
    const logoUrl = "https://www.careerlabconsulting.com/logo.png";

    await transporter.sendMail({
      from: `"Career Lab Consulting" <${process.env.SMTP_USER}>`,
      to: "info@careerlabconsulting.com",
      subject: `Product Inquiry: ${productName} — ${company}`,
      html: buildAdminInquiryMail({ name, company, email, phone, message, productName, productTagline, currentYear, logoUrl }),
    });

    await transporter.sendMail({
      from: `"Career Lab Consulting" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Your ${productName} Inquiry — Career Lab Consulting`,
      html: buildUserInquiryMail({ name, company, email, message, productName, productTagline, currentYear, logoUrl }),
    });

    res.json({ success: true, message: "Inquiry emails sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/booking", async (req: Request, res: Response) => {
  try {
    const { name, company, email, phone, date, slot, productName, productTagline } = req.body;
    if (!name || !company || !email || !productName || !date || !slot)
      return res.status(400).json({ success: false, message: "Missing required fields" });

    const currentYear = new Date().getFullYear();
    const logoUrl = "https://www.careerlabconsulting.com/logo.png";

    await transporter.sendMail({
      from: `"Career Lab Consulting" <${process.env.SMTP_USER}>`,
      to: "info@careerlabconsulting.com",
      subject: `Booking: ${productName} — ${name} on ${date} at ${slot}`,
      html: buildAdminBookingMail({ name, company, email, phone, date, slot, productName, productTagline, currentYear, logoUrl }),
    });

    await transporter.sendMail({
      from: `"Career Lab Consulting" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Consultation Confirmed: ${productName} on ${date} — Career Lab Consulting`,
      html: buildUserBookingMail({ name, company, email, date, slot, productName, productTagline, currentYear, logoUrl }),
    });

    res.json({ success: true, message: "Booking emails sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;