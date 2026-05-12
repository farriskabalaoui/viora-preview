# Email Deliverability Fix — Resend → viorahealthcare.com

Marv reported verification emails landing in spam during the 2026-05-12 call.
This document captures the DNS records that need to live in GoDaddy so Resend's
outbound mail is authenticated against `viorahealthcare.com` and stops being
flagged.

## TL;DR — what you need to do

1. Log into the **Resend dashboard** at <https://resend.com/domains>
2. Click on the `viorahealthcare.com` domain entry (or add it if missing)
3. Resend will show you a list of DNS records to add — copy them
4. Log into **GoDaddy DNS Management** for `viorahealthcare.com`
5. Add each record exactly as Resend shows (TTL: 1 hour is fine)
6. Back in Resend, click **Verify Domain** — should turn green within 5-15 min
7. Test by signing up a new account on viorahealthcare.com — verification email
   should now land in inbox, not spam

## What records Resend asks for

Resend uses AWS SES under the hood, so the records follow the SES auth pattern.
Exactly three categories:

### 1. SPF (Sender Policy Framework) — TXT record

Tells receiving mail servers which servers are allowed to send "from"
viorahealthcare.com.

| Field | Value |
|---|---|
| Type | TXT |
| Name | `send` (i.e. record applies to `send.viorahealthcare.com`) |
| Value | `v=spf1 include:amazonses.com ~all` |

**Note:** you already have an SPF macro at the apex (`v=spf1 include:dc-aa8e722993._spfm.viorahealthcare.com ~all`) for Google Workspace mail. The new record is for the `send` subdomain Resend uses, not the apex — they coexist.

### 2. DKIM (DomainKeys Identified Mail) — 3 CNAME records

Cryptographic signature that proves emails haven't been tampered with and
actually originate from your authorized infrastructure.

Resend will give you three CNAME records like:

| Type | Name | Value |
|---|---|---|
| CNAME | `<token-1>._domainkey.send` | `<token-1>.dkim.amazonses.com` |
| CNAME | `<token-2>._domainkey.send` | `<token-2>.dkim.amazonses.com` |
| CNAME | `<token-3>._domainkey.send` | `<token-3>.dkim.amazonses.com` |

The `<token-X>` values are unique to your Resend account — copy them from the
Resend dashboard. **Don't invent them.**

### 3. Return-path / MX — MX record

You may already have this — it's the AWS SES feedback handler that processes
bounces and complaints:

| Type | Name | Value | Priority |
|---|---|---|---|
| MX | `send` | `feedback-smtp.us-east-1.amazonses.com` | 10 |

✅ This record was already in your GoDaddy DNS (screenshot from earlier in the cutover).

## Why emails go to spam without these

When Gmail (and Outlook, Apple Mail, etc.) receive an email claiming to be
from `noreply@viorahealthcare.com`, it asks:

1. **SPF check** — is the sending server actually allowed to send for this domain?
2. **DKIM check** — is the cryptographic signature valid against a public key in DNS?
3. **DMARC check** — does the domain have a policy declaring how to handle failures?

If any of those fail (or worse, the records are missing entirely), modern
email providers treat the message as suspicious and dump it in spam. This is
exactly what's happening to Viora's verification emails right now.

## Bonus: add DMARC after the above is green

Once SPF + DKIM are passing for the `send` subdomain, add a DMARC record to
the apex to tighten policy:

| Type | Name | Value |
|---|---|---|
| TXT | `_dmarc` | `v=DMARC1; p=none; rua=mailto:dmarc-reports@viorahealthcare.com; adkim=r; aspf=r` |

`p=none` is a monitoring-only policy — it doesn't block anything. After a
week or two of monitoring (and creating the `dmarc-reports@` mailbox), tighten
to `p=quarantine` then `p=reject`.

## Verification — make sure it's actually working

After the records resolve (5-15 min), test from your terminal:

```bash
# SPF check
dig +short TXT send.viorahealthcare.com | grep spf

# DKIM check (use one of your selector tokens)
dig +short CNAME <token-1>._domainkey.send.viorahealthcare.com

# End-to-end test — send yourself a verification email and check headers
# In Gmail: open the email → 3-dot menu → "Show original" → look for:
#   SPF: PASS
#   DKIM: PASS
#   DMARC: PASS (or BESTGUESSPASS if no DMARC record yet)
```

Or use https://www.mail-tester.com — Resend sends a test, you paste the
provided test address, and it gives a deliverability score 0-10. Aim for 9+.

## If you're still landing in spam after this

Common remaining causes:

1. **Reputation warm-up** — brand-new sending domains take 1-2 weeks to build
   reputation. Send small volumes initially (Resend recommends < 50/day for
   first week, ramp gradually).
2. **Spam-trigger words in subject/body** — avoid "FREE", excessive caps,
   "Act now!", and mismatched display name vs. from address.
3. **Image-to-text ratio** — emails that are mostly images get flagged. Keep
   text content > 60% by character count.
4. **Generic "noreply@" sender** — some providers downrank these. Consider
   `verify@viorahealthcare.com` or `team@viorahealthcare.com` instead.

## Code is already ready

The Viora app already uses Resend correctly with the right sender domain:

- `lib/resend.ts` — Resend SDK wrapper, reads `RESEND_FROM` env var
- `RESEND_FROM` env var defaults to `Viora Healthcare <hello@viorahealthcare.com>` — should change to `<verify@send.viorahealthcare.com>` or similar once the `send.` subdomain is fully authenticated
- `lib/email-templates.tsx` — properly structured HTML templates

**No code changes required for the spam fix — this is purely a DNS task.**

Once you've added the records and Resend says "Verified" in green, the next
verification email should land in inbox.
