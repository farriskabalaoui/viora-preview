import { NextResponse } from "next/server";
import {
  getSession,
  getTransactionsForSession,
} from "@/lib/clickbrick";

export const runtime = "nodejs";

/**
 * ClickBrick redirects the customer's browser here after they finish on the
 * hosted checkout page. We get back:
 *
 *   /api/checkout/clickbrick/return?status=success&sessionId=<id>     (good)
 *   /api/checkout/clickbrick/return?status=cancel                    (user bailed)
 *
 * Their docs aren't explicit about the exact query params they append on
 * top of our success/cancel URL — so we accept several common shapes:
 *   sessionId, session_id, sid, id
 *
 * Our job: verify the session status server-to-server (don't trust the
 * query string alone) and bounce the customer to a friendly success or
 * cancel page on viorahealthcare.com.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const status = url.searchParams.get("status");
  const sessionId =
    url.searchParams.get("sessionId") ??
    url.searchParams.get("session_id") ??
    url.searchParams.get("sid") ??
    url.searchParams.get("id");

  // Cancel branch — user clicked Cancel on the ClickBrick checkout
  if (status === "cancel") {
    return NextResponse.redirect(`${url.origin}/cart?checkout=cancelled`);
  }

  if (!sessionId) {
    // No session id and not a cancel — treat as malformed, send to cart
    return NextResponse.redirect(
      `${url.origin}/cart?checkout=error&reason=missing_session`,
    );
  }

  // Server-to-server verify of the session state. Don't trust the
  // status query string alone — it's easy to spoof if anyone wanted to.
  const sessionRes = await getSession(sessionId);
  if (!sessionRes.ok) {
    console.error("[clickbrick/return] getSession failed", sessionRes);
    return NextResponse.redirect(
      `${url.origin}/cart?checkout=error&reason=verify_failed`,
    );
  }

  const sessionStatus = String(sessionRes.data.status ?? "").toLowerCase();

  // Map ClickBrick session statuses → app outcomes
  const isPaid =
    sessionStatus === "completed" ||
    sessionStatus === "succeeded" ||
    sessionStatus === "paid";
  const isPending =
    sessionStatus === "pending" ||
    sessionStatus === "processing" ||
    sessionStatus === "";
  const isFailed =
    sessionStatus === "failed" ||
    sessionStatus === "declined" ||
    sessionStatus === "cancelled" ||
    sessionStatus === "canceled" ||
    sessionStatus === "expired";

  if (isPaid) {
    // Look up the transaction so we have a record id to show
    const txRes = await getTransactionsForSession(sessionId);
    const txId =
      txRes.ok && txRes.data.length > 0 ? txRes.data[0]._id : sessionId;
    return NextResponse.redirect(
      `${url.origin}/account/orders?just_paid=${encodeURIComponent(txId)}`,
    );
  }

  if (isFailed) {
    return NextResponse.redirect(
      `${url.origin}/cart?checkout=failed&reason=${encodeURIComponent(sessionStatus)}`,
    );
  }

  // Pending — ClickBrick is still processing (e.g. eDebit ACH that
  // settles later). Tell the user we'll email when it settles.
  if (isPending) {
    return NextResponse.redirect(
      `${url.origin}/account/orders?pending=${encodeURIComponent(sessionId)}`,
    );
  }

  // Unknown status — log + send to cart
  console.warn(
    "[clickbrick/return] unknown session status",
    sessionId,
    sessionStatus,
  );
  return NextResponse.redirect(
    `${url.origin}/cart?checkout=unknown&status=${encodeURIComponent(sessionStatus)}`,
  );
}
