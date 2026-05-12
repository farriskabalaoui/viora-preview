/**
 * Email template strings — used by Resend (or any other SMTP) when wired.
 *
 * Each template returns { subject, html, text } so we can swap the sender
 * without rewriting copy.
 *
 * Brand-aligned: deep forest green (#284C3E), Raleway-ish system font
 * fallback for email clients that strip web fonts.
 */

const BRAND = "#284C3E";
const BRAND_SOFT = "#ECF3EE";
const FOREGROUND = "#2A2A2A";
const MUTED = "#5A6A5E";
const BORDER = "#E0E7E2";

function shell(content: string, preheader = "") {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f7faf9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:${FOREGROUND}">
<div style="display:none;max-height:0;overflow:hidden;color:transparent">${preheader}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7faf9">
  <tr><td align="center" style="padding:24px">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border:1px solid ${BORDER};border-radius:16px;overflow:hidden">
      <tr><td style="padding:24px 32px;border-bottom:1px solid ${BORDER}">
        <div style="font-size:18px;font-weight:800;color:${BRAND};letter-spacing:-0.01em">VIORA <span style="font-size:9px;font-weight:600;letter-spacing:0.22em;color:${MUTED};text-transform:uppercase">Health Care</span></div>
      </td></tr>
      <tr><td style="padding:32px">${content}</td></tr>
      <tr><td style="padding:20px 32px;border-top:1px solid ${BORDER};background:#fafbfc;font-size:11px;color:${MUTED};line-height:1.6">
        Viora Healthcare · Manufactured & packed in the United States · For research use only<br/>
        Questions? Reply to this email or text +1 (954) 995-1406
      </td></tr>
    </table>
  </td></tr>
</table></body></html>`;
}

export function welcomeEmail({ name }: { name: string }) {
  const html = shell(`
    <h1 style="margin:0 0 16px;font-size:24px;font-weight:700;color:${FOREGROUND}">Welcome to Viora, ${name}</h1>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.6">Your portal access is active. You can now browse the full research catalog, place orders, and track every COA per batch.</p>
    <p style="margin:0 0 24px;font-size:15px;line-height:1.6">A reminder: every Viora compound is for laboratory research use only. Not for human or animal consumption, diagnostic, or therapeutic use.</p>
    <a href="https://viorahealthcare.com/products" style="display:inline-block;padding:12px 24px;background:${BRAND};color:#fff;text-decoration:none;border-radius:999px;font-weight:600;font-size:14px">Browse compounds</a>
    <p style="margin:24px 0 0;font-size:13px;color:${MUTED};line-height:1.6">Need help? Just reply to this email or text us at +1 (954) 995-1406.</p>
  `, `Your Viora portal access is active.`);
  return {
    subject: "Welcome to Viora",
    html,
    text: `Welcome to Viora, ${name}.\n\nYour portal access is active. Browse the catalog at viorahealthcare.com/products.\n\nReminder: research use only — not for human consumption.`,
  };
}

export function orderConfirmationEmail({
  name,
  orderId,
  items,
  total,
}: {
  name: string;
  orderId: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
}) {
  const itemsHtml = items
    .map(
      (it) => `
    <tr>
      <td style="padding:8px 0;font-size:14px;color:${FOREGROUND}">${it.name} <span style="color:${MUTED}">× ${it.qty}</span></td>
      <td style="padding:8px 0;font-size:14px;color:${FOREGROUND};text-align:right">$${(it.price * it.qty).toFixed(2)}</td>
    </tr>
  `,
    )
    .join("");

  const html = shell(`
    <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:${FOREGROUND}">Order confirmed</h1>
    <p style="margin:0 0 24px;font-size:14px;color:${MUTED}">Order #${orderId} · Thanks, ${name}.</p>
    <table role="presentation" width="100%" style="border-collapse:collapse;border-top:1px solid ${BORDER};border-bottom:1px solid ${BORDER}">
      ${itemsHtml}
      <tr><td colspan="2" style="padding:12px 0 0;font-size:15px;font-weight:700;text-align:right;border-top:1px solid ${BORDER}">Total: $${total.toFixed(2)}</td></tr>
    </table>
    <p style="margin:24px 0 0;font-size:14px;line-height:1.6">We'll email tracking the moment your order ships. Each item ships with its batch COA — you can also view all your COAs anytime in your portal.</p>
    <p style="margin:16px 0 0">
      <a href="https://viorahealthcare.com/account/orders" style="color:${BRAND};font-weight:600;text-decoration:none">View order in portal →</a>
    </p>
  `, `Order #${orderId} confirmed — ships from our U.S. facility.`);
  return {
    subject: `Viora order #${orderId} confirmed`,
    html,
    text: `Order #${orderId} confirmed.\nTotal: $${total.toFixed(2)}\n\nWe'll email tracking when it ships.`,
  };
}

export function passwordResetEmail({ resetUrl }: { resetUrl: string }) {
  const html = shell(`
    <h1 style="margin:0 0 16px;font-size:24px;font-weight:700;color:${FOREGROUND}">Reset your password</h1>
    <p style="margin:0 0 24px;font-size:15px;line-height:1.6">Click the button below to set a new password. This link expires in 1 hour.</p>
    <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:${BRAND};color:#fff;text-decoration:none;border-radius:999px;font-weight:600;font-size:14px">Reset password</a>
    <p style="margin:24px 0 0;font-size:13px;color:${MUTED};line-height:1.6">If you didn't request this, ignore this email — your password stays the same.</p>
  `, `Reset your Viora password.`);
  return {
    subject: "Reset your Viora password",
    html,
    text: `Reset your Viora password: ${resetUrl}\n\nThis link expires in 1 hour. If you didn't request it, ignore this email.`,
  };
}

export function coaDeliveryEmail({
  name,
  compound,
  batch,
  coaUrl,
}: {
  name: string;
  compound: string;
  batch: string;
  coaUrl: string;
}) {
  const html = shell(`
    <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:${FOREGROUND}">Your batch COA is ready</h1>
    <p style="margin:0 0 24px;font-size:15px;line-height:1.6">Hi ${name} — the Certificate of Analysis for the ${compound} batch (#${batch}) you received is now live in your portal and attached.</p>
    <div style="padding:16px;background:${BRAND_SOFT};border-radius:12px;margin-bottom:24px">
      <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:${BRAND}">Compound · Batch</div>
      <div style="margin-top:4px;font-size:18px;font-weight:700;color:${FOREGROUND}">${compound} · ${batch}</div>
    </div>
    <a href="${coaUrl}" style="display:inline-block;padding:12px 24px;background:${BRAND};color:#fff;text-decoration:none;border-radius:999px;font-weight:600;font-size:14px">View COA</a>
    <p style="margin:24px 0 0;font-size:13px;color:${MUTED};line-height:1.6">All your COAs are permanently archived in your portal at viorahealthcare.com/account/coa-history.</p>
  `, `${compound} batch ${batch} COA is live.`);
  return {
    subject: `Viora COA · ${compound} batch ${batch}`,
    html,
    text: `Your COA for ${compound} batch ${batch} is ready: ${coaUrl}`,
  };
}
