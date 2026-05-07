/**
 * Plain-text SMS templates. Keep under 160 chars where possible to avoid
 * multi-segment billing on standard GSM. Verify OTP messages are sent by
 * Twilio Verify itself (their template), not from here.
 */

export function smsOrderConfirmed({ orderId, total }: { orderId: string; total: number }) {
  return `Viora: order #${orderId} confirmed. Total $${total.toFixed(2)}. We'll text tracking when it ships. Reply STOP to opt out.`;
}

export function smsOrderShipped({
  orderId,
  carrier,
  tracking,
}: {
  orderId: string;
  carrier: string;
  tracking: string;
}) {
  return `Viora: order #${orderId} shipped via ${carrier}. Track: ${tracking}. Reply STOP to opt out.`;
}

export function smsCoaReady({ compound, batch }: { compound: string; batch: string }) {
  return `Viora: COA for ${compound} batch #${batch} is live in your portal. viorahealthcare.com/account/coa-history`;
}

export function smsHotlineAck() {
  return `Viora: thanks for reaching out. A team member will reply within 1 business day. For urgent: hello@viorahealthcare.com`;
}
