import { readFile } from "node:fs/promises";
import path from "node:path";

/**
 * Host-aware /favicon.ico handler.
 *
 * Browsers request /favicon.ico directly (ignoring HTML <link> metadata),
 * so the per-page metadata.icons override on /polaris doesn't reach this
 * URL. We branch on the Host header to serve the right ICO for each tenant.
 *
 * - polarisanalytical.com (and www.) → polaris compass-rose
 * - everything else → Viora "VH" mark
 */

const ONE_DAY = 60 * 60 * 24;

export async function GET(req: Request) {
  const host = (req.headers.get("host") ?? "").toLowerCase();
  const polarisHost = (process.env.POLARIS_HOSTNAME ?? "polarisanalytical.com").toLowerCase();
  const isPolaris = host === polarisHost || host === `www.${polarisHost}`;

  const filename = isPolaris ? "polaris-favicon.ico" : "viora-favicon.ico";
  const file = await readFile(path.join(process.cwd(), "public", filename));
  const body = new Uint8Array(file);

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "image/x-icon",
      "Cache-Control": `public, max-age=${ONE_DAY}, s-maxage=${ONE_DAY}`,
    },
  });
}
