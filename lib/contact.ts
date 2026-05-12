/**
 * Single source of truth for Viora contact details.
 * To change the public phone number, edit ONLY this file — every page,
 * footer, link, and policy reads from here.
 */

// E.164 format (no spaces, no dashes) — used for tel: links + API validation
export const VIORA_PHONE_E164 = "+19549951406";

// Human-readable format — used for display in headers, footers, body copy
export const VIORA_PHONE_DISPLAY = "+1 (954) 995-1406";

// Primary support email
export const VIORA_EMAIL = "hello@viorahealthcare.com";

// Mailto link
export const VIORA_EMAIL_HREF = `mailto:${VIORA_EMAIL}`;

// Tel link
export const VIORA_PHONE_HREF = `tel:${VIORA_PHONE_E164}`;
