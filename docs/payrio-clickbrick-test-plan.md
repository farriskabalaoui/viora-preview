# Payrio / ClickBrick — End-to-End Test Plan

Now that Payrio underwriting is approved, this is the playbook for
testing the checkout flow before we go fully live on June 1.

**Read once before testing. Then keep this doc open as a checklist.**

## Quick reference

| Thing | Value / location |
|---|---|
| Gateway | ClickBrick (Payrio resells) |
| API domain | `api.clickbrickco.com/v1` |
| Auth header | `X-API-KEY: <secret>` |
| Sandbox key | `KONA_API_KEY` env starting with `kona_test_...` |
| Production key | `KONA_API_KEY` env starting with `kona_prod_...` |
| Vendor ID | `CLICKBRICK_VENDOR_ID` env = `69e6f467a76e4f370dd038ea` |
| Code lives in | `lib/clickbrick.ts`, `app/api/checkout/clickbrick/start/route.ts`, `app/api/checkout/clickbrick/return/route.ts` |
| Cart UI | `components/cart-drawer.tsx` (the "Pay $X →" button) |

## Stage 1: Pre-flight (5 min)

Before touching the checkout, confirm the basics:

### 1a. Confirm keys are set in Vercel

```bash
cd ~/Desktop/Opervex/viora-preview
vercel env ls 2>&1 | grep -E "KONA|CLICKBRICK"
```

Expected:
```
KONA_API_KEY                       Encrypted           Development
KONA_API_KEY                       Encrypted           Production
CLICKBRICK_VENDOR_ID               Encrypted           Development
CLICKBRICK_VENDOR_ID               Encrypted           Production
```

### 1b. Confirm the production key is the LATEST one (not the leaked one)

The key that was pasted into our chat earlier is potentially compromised
and should have been rotated. Verify:

1. Log into the ClickBrick dashboard
2. Apps → Viora Healthcare → API Keys tab
3. Note the prefix/last-4 of the current production key
4. Compare to what's in Vercel — they should match the LATEST rotated key

If they don't match → rotate now (ClickBrick dashboard → Rotate → copy new
key → update in Vercel → redeploy via `vercel --prod`).

### 1c. Confirm Payrio confirmed the achprocessing.com flow

Important separate issue: PayRio's customer success replied
that they don't recognize `achprocessing.com`. ACH-side underwriting
needs to be verified before any ACH/eDebit payments can flow. Card-side
charges via ClickBrick can still proceed even if ACHPC is pending.

**Status to check**: has Irene confirmed achprocessing.com is legitimate?
- ✅ Yes → proceed with full test plan
- ❌ Not yet → only test card transactions; skip any ACH-specific tests
  (we don't currently surface ACH as a payment option anyway)

## Stage 2: Sandbox test (30 min)

Test against the `kona_test_...` key first. No real money moves.

### 2a. Local dev server

```bash
cd ~/Desktop/Opervex/viora-preview
npm run dev
```

Open http://localhost:3500 — the local dev environment uses your
sandbox key from `.env.local`.

### 2b. End-to-end test card flow

1. **Sign up** a fresh test researcher account at `/signup` (use a real
   email you can access — verification SMS will fire via Twilio Verify)
2. Phone-verify with the code sent to your real number
3. Browse `/products` → pick any SKU → **Add to Cart**
4. Click the cart icon → cart drawer slides in
5. Click **"Pay $X →"** button

Expected: browser redirects to `https://pay.clickbrickco.com/...` (or
similar hosted checkout URL). You see a ClickBrick-branded form (not Viora).

### 2c. ClickBrick sandbox test card numbers

These are the standard sandbox cards (verify in ClickBrick dashboard
under Developers → Test Cards if these don't work):

| Card | Expected outcome |
|---|---|
| `4242 4242 4242 4242` | Approve |
| `4111 1111 1111 1111` | Approve |
| `4000 0000 0000 0002` | Decline (generic) |
| `4000 0000 0000 9995` | Decline (insufficient funds) |
| `4000 0000 0000 0119` | Processing (eventual success) |

For all test cards:
- **Expiry**: any future date (e.g. `12/29`)
- **CVV**: any 3 digits (e.g. `123`)
- **ZIP**: any 5 digits

### 2d. Verify each outcome routes correctly

For each test, after submitting on ClickBrick:

| Expected redirect | Outcome |
|---|---|
| `viorahealthcare.com/account/orders?just_paid=<txn>` | Success path |
| `viorahealthcare.com/cart?checkout=failed&reason=...` | Card declined |
| `viorahealthcare.com/cart?checkout=cancelled` | User clicked Cancel on ClickBrick |
| `viorahealthcare.com/account/orders?pending=<id>` | Processing (ACH/eDebit) |

Test each path with the matching test card. If any redirect lands on a
wrong page or 500s, capture the URL + screenshot + log.

### 2e. Inspect the network

In DevTools → Network tab, find the request to:
```
POST /api/checkout/clickbrick/start
```

Response body should look like:
```json
{
  "paymentURL": "https://pay.clickbrickco.com/checkout/session_xxx",
  "sessionId": "session_xxx"
}
```

If `paymentURL` is missing or the response is a 502 with `"error":"..."` →
that's the issue. Capture the error message — usually points at:
- Wrong/missing API key
- Wrong/missing Vendor ID
- ClickBrick rejecting the payload (invalid amount, missing fields)

### 2f. Verify in ClickBrick dashboard

Log into ClickBrick → Transactions tab → you should see each test
charge listed under your Vendor ID with the matching session ID.

## Stage 3: Production smoke test (15 min)

⚠️ **REAL MONEY MOVES.** Do this on `viorahealthcare.com`, not localhost.

### 3a. Use a low-value test product

If you don't have a real low-priced SKU yet, temporarily add one (e.g.
$1 test peptide). Or use the lowest-priced existing SKU (`bpc-157` at
$25 currently).

### 3b. Sign in with your real account

Don't create a brand new account — use one that's already verified
and won't bounce back through SMS verify (Twilio costs real money per
verify).

### 3c. Add to cart → Pay $X →

Use a real card you control. Charge will actually settle.

Expected:
- ClickBrick redirects you back to Viora
- The transaction appears in your bank account / card statement within
  minutes (pending) and settles within 1-3 days (Mon-Fri only)
- Order appears in `/account/orders`
- ClickBrick dashboard shows the transaction

### 3d. Refund the test charge immediately

To avoid being out the money:

1. ClickBrick dashboard → Transactions → find your test charge
2. Click **Refund** → full amount
3. Confirm refund posts to your card statement (1-3 days)

OR via our code:

```ts
import { refundTransaction } from "@/lib/clickbrick";
await refundTransaction("<transaction-id>");
```

(No UI for this yet — would be a one-off curl or REPL call.)

## Stage 4: Edge cases (15 min)

### 4a. Card declined

Test the decline test card in sandbox. Confirm:
- User sees a clear error (not a generic crash)
- Cart contents are preserved (they can retry)
- No partial transaction shows in ClickBrick

### 4b. User cancels

Click "Cancel" on the ClickBrick checkout page. Confirm:
- Redirects to `/cart?checkout=cancelled`
- Cart contents still there
- No charge attempted

### 4c. Timeout / network failure

Hard to simulate, but: if ClickBrick is down or slow, our route should
return a 502 with a clear error, not hang forever.

### 4d. Unauthenticated user attempts checkout

Open an incognito window → add item to cart (works because cart is
local) → click **Pay $X →**.

Expected: redirected to `/login?returnTo=/cart` instead of trying to
checkout. After signing in, they should be back at the cart and able
to complete.

### 4e. Empty cart

The button should be disabled. Confirm.

### 4f. Out-of-stock item in cart

If we mark a product as `out_of_stock` via the stock lib, the user
shouldn't be able to start a checkout containing it. (Currently we
don't actively prevent this — flagging for future hardening.)

## Stage 5: Refund flow check (10 min)

Currently no admin UI for refunds — they happen via the ClickBrick
dashboard or by calling `refundTransaction()` programmatically. Until
we build an admin refund button:

### Process for handling a refund request

1. Customer emails `hello@viorahealthcare.com` asking for a refund
2. Look up their order in `/account/orders` → note the txn ID
3. Log into ClickBrick → Transactions → find the txn → Refund
4. Email customer confirmation (manual for now)

### TODO (post-launch)

- Build refund button on the `/growth` admin page that calls
  `refundTransaction()` directly
- Auto-email the customer when a refund posts
- Sync refund status back to the user's order history via webhook

## Stage 6: Webhook / async events

ClickBrick may send webhooks for async events (settled, refunded,
disputed). We don't currently have a webhook handler — Currently we
rely on the user's redirect-back to verify session status.

**Status: not blocking launch, but worth setting up.**

To set up:
1. Add a webhook handler route at `app/api/checkout/clickbrick/webhook/route.ts`
2. Register the URL in ClickBrick dashboard → Webhooks
3. Verify signature on each incoming webhook (ClickBrick docs needed)
4. Update local order state based on the event

This makes order tracking more reliable than depending on the user
clicking through the redirect (e.g. if they close the tab after paying).

## Test checklist (paste into Slack when done)

```
[ ] 1a. Vercel env vars present (KONA + CLICKBRICK_VENDOR_ID, both envs)
[ ] 1b. Prod API key matches dashboard (rotated key, not leaked one)
[ ] 1c. ACHPC confirmation status known (legit or skip ACH tests)

Sandbox:
[ ] 2b. /signup → /verify → /products → cart → checkout redirect works
[ ] 2c. Test card 4242 → success → /account/orders?just_paid=...
[ ] 2c. Test card 4000...0002 → decline → /cart?checkout=failed
[ ] 2c. Cancel on ClickBrick → /cart?checkout=cancelled
[ ] 2e. POST /start returns paymentURL + sessionId
[ ] 2f. Transaction visible in ClickBrick dashboard

Production:
[ ] 3c. Real card, real $X charge, lands in /account/orders
[ ] 3c. Bank statement shows pending charge within 5 min
[ ] 3d. Refund posts within 24h

Edge cases:
[ ] 4a. Decline UX clean
[ ] 4b. Cancel UX clean
[ ] 4d. Logged-out user redirected to /login first
```

When you finish — paste this checklist with results into our chat and
I'll triage anything broken.
