# Set up Polaris Analytical Email via Cloudflare Email Routing

This doc walks through provisioning `contact@polarisanalytical.com` (and
any other addresses) using **Cloudflare Email Routing** — free, no inbox
of its own, just forwards mail to an existing Gmail/Workspace inbox you
already control.

This is the right setup for Polaris because:
- Polaris is a standalone brand from Viora (per Marv) and should have its
  own domain identity for credibility with research lab clients
- We don't need a full inbox yet — early mail volume will be low
- $0 cost vs $7/mo for a Google Workspace seat
- We can switch to Workspace later without changing the public address

## Prerequisites

- You own `polarisanalytical.com` (registrar = GoDaddy or wherever)
- You have a Cloudflare account
- You have a target Gmail / Workspace inbox to forward mail TO (e.g. your
  personal Gmail, or `hello@viorahealthcare.com`)

## Phase 1 — Add the domain to Cloudflare

If `polarisanalytical.com` is **not yet on Cloudflare**, add it first.
Otherwise skip to Phase 2.

1. Log in to https://dash.cloudflare.com
2. Top-right → **Add a domain** → enter `polarisanalytical.com`
3. Pick the **Free** plan → Continue
4. Cloudflare scans your current DNS records (at GoDaddy) and imports
   them. **Review them carefully** — make sure your existing A records
   for the website + any MX records aren't lost.
5. Cloudflare gives you **2 nameservers** like `something.ns.cloudflare.com`
6. Go to GoDaddy → Domain settings for `polarisanalytical.com` → change
   nameservers from GoDaddy's defaults to Cloudflare's two
7. Wait 5-30 min for nameserver propagation. Cloudflare emails you when
   the domain is "Active" on their network.

## Phase 2 — Enable Email Routing

Once the domain is on Cloudflare:

1. Cloudflare dashboard → select `polarisanalytical.com`
2. Left sidebar → **Email** → **Email Routing**
3. Click **Enable Email Routing**
4. Cloudflare will offer to **automatically add the required DNS
   records**: 3 MX records + 1 SPF TXT record. Click **Add records**.
   It does it for you since the domain is already on Cloudflare.

The records Cloudflare adds:

| Type | Name | Value | Priority |
|---|---|---|---|
| MX | `@` | `route1.mx.cloudflare.net` | 19 |
| MX | `@` | `route2.mx.cloudflare.net` | 31 |
| MX | `@` | `route3.mx.cloudflare.net` | 64 |
| TXT | `@` | `v=spf1 include:_spf.mx.cloudflare.net ~all` | — |

## Phase 3 — Configure routing rules

1. **Email** → **Email Routing** → **Routes** tab
2. Click **Create address**
3. **Custom address**: `contact@polarisanalytical.com`
4. **Action**: "Send to an email"
5. **Destination**: enter your Gmail / Workspace address (e.g.
   `farris.kabalaoui@gmail.com` or `hello@viorahealthcare.com`)
6. **Save**

Cloudflare sends a verification email to the destination — open it +
click the verify link before saving will fully activate.

**Repeat for any other addresses you want:**
- `support@polarisanalytical.com`
- `info@polarisanalytical.com`
- `coa@polarisanalytical.com` (specifically for COA inquiries from labs)

You can also set a **catch-all** that forwards anything sent to
`anything@polarisanalytical.com` to one destination — useful so you
don't miss mail to typo'd addresses.

## Phase 4 — Sending FROM the address (Reply-from)

Cloudflare Email Routing is **forwarding-only by default** — it can
receive but not send. To reply from `contact@polarisanalytical.com` (so
the recipient sees the Polaris address, not your Gmail), you need to
set up "Send as" in your destination inbox:

### If destination is Gmail

1. Gmail → ⚙️ Settings → **Accounts and Import**
2. **Send mail as** → **Add another email address**
3. Name: `Polaris Analytical`
4. Email: `contact@polarisanalytical.com`
5. Uncheck "Treat as alias" (it's a separate domain)
6. Click **Next Step**

Gmail will ask for SMTP credentials. Cloudflare doesn't offer SMTP
sending directly — you have a few options:

**Option A: Use Gmail's relay (easiest)**
- SMTP server: `smtp.gmail.com`
- Port: `587` (TLS)
- Username: your Gmail address
- Password: a Gmail App Password (https://myaccount.google.com/apppasswords)

This sends through your Gmail account but the "From" header shows the
Polaris address. Mail is correctly routed and authenticated via the
Gmail account's SPF/DKIM. Most recipients will see it as legit.

**Option B: Use a transactional sender like Resend or SendGrid**
- Verify `polarisanalytical.com` in Resend (same DNS-record pattern as
  Viora — see `docs/email-deliverability-fix.md`)
- Use Resend's SMTP credentials in Gmail "Send mail as" flow
- Mail is sent through Resend with proper SPF/DKIM for the Polaris
  domain. Cleanest long-term solution.

### If destination is Google Workspace (Viora's)

Same flow but you can also add the Polaris domain as a **secondary
domain** in your Workspace → then create a user/alias on it. That's
more involved and costs nothing extra in Workspace Business plans.

## Phase 5 — Test

1. Send a test email from your personal phone to
   `contact@polarisanalytical.com`
2. Should arrive in your Gmail within ~30s
3. Reply from Gmail using the new "Send mail as" address — check the
   recipient sees `contact@polarisanalytical.com` in the From field
4. Check the reply doesn't land in spam (it shouldn't if Phase 4 is set up correctly)

## Phase 6 — Update the codebase

Once you've confirmed mail flows both ways, update Polaris references in
the repo to use the new address consistently:

```bash
# lib/coas.ts already references contact@polarisanalytical.com
# app/polaris/page.tsx also references it
# No changes needed if the address is contact@polarisanalytical.com
```

If you pick a different address (e.g. `coa@`), search-replace:
```bash
grep -rn "contact@polarisanalytical.com" --include="*.tsx" --include="*.ts"
```

## Costs

- Cloudflare Email Routing: **$0/mo** (free)
- Domain on Cloudflare (DNS only): **$0/mo** (free)
- If you upgrade to Workspace later for the Polaris domain: $7/user/mo

## When to upgrade to full Google Workspace

Migrate to a real Polaris Google Workspace inbox when:
- Multiple team members need to read/respond to Polaris mail
- You want shared labels, threads, full archive
- Mail volume exceeds Cloudflare's forwarding quota (1,000 emails/day,
  enough for early-stage but not at scale)

Migration path: provision Workspace for `polarisanalytical.com` → in
Cloudflare, change the routing destination from your Gmail to the new
Workspace mailbox. Public address stays the same.
