#!/usr/bin/env python3
"""
Generate marketing QR codes for print materials (packing slips, vial
boxes, thank-you cards, business cards, etc.).

NOT to be confused with scripts/generate-coas.py — that one generates
the batch-specific QRs that go INSIDE each COA PDF, pointing to
polarisanalytical.com/coa/<batch>. This script is for general-purpose
marketing QRs pointing to fixed pages on viorahealthcare.com.

Outputs:
    public/qr/<name>.png       — high-error-correction, scuff-resistant
                                 PNGs ready for print
    Each PNG also lives at https://viorahealthcare.com/qr/<name>.png
    so the marketing team can grab them via URL without cloning the repo.

Each QR encodes a URL with UTM tracking params so Google Analytics /
Plausible / Vercel Analytics can attribute scans → orders.

Run:
    python3 scripts/generate-qr-codes.py

Add a new QR:
    1. Add a (filename, url) entry to QR_OUTPUTS below
    2. Re-run this script
    3. Commit the new PNG
"""
from __future__ import annotations
import os
import qrcode

# (filename, url) — order doesn't matter
QR_OUTPUTS = [
    # Customer-facing marketing
    (
        "reorder.png",
        "https://viorahealthcare.com/products"
        "?utm_source=package&utm_medium=qr&utm_campaign=reorder",
    ),
    (
        "coas-verify.png",
        "https://viorahealthcare.com/coas"
        "?utm_source=package&utm_medium=qr&utm_campaign=coa_verify",
    ),
    (
        "site.png",
        "https://viorahealthcare.com"
        "?utm_source=package&utm_medium=qr&utm_campaign=site",
    ),
    (
        "signup.png",
        "https://viorahealthcare.com/signup"
        "?utm_source=package&utm_medium=qr&utm_campaign=signup",
    ),
    # Add more as needed (research library, affiliate, contact, etc.)
    # ("research.png", "https://viorahealthcare.com/research?utm_source=...&utm_medium=qr&utm_campaign=..."),
]

# Viora brand color for the QR foreground. Stays on-brand on white labels.
BRAND_COLOR = "#284C3E"  # forest green

OUT = os.path.join(os.path.dirname(__file__), "..", "public", "qr")
os.makedirs(OUT, exist_ok=True)


def make_qr(url: str, path: str) -> int:
    """Generate one QR. Returns file size in bytes."""
    qr = qrcode.QRCode(
        version=None,
        box_size=20,  # 20px per data module → crisp print at any DPI
        border=2,
        # 30% error correction — survives scuffing, smudges, partial
        # occlusion on physical vials and boxes
        error_correction=qrcode.constants.ERROR_CORRECT_H,
    )
    qr.add_data(url)
    qr.make(fit=True)
    img = qr.make_image(fill_color=BRAND_COLOR, back_color="white")
    img.save(path)
    return os.path.getsize(path)


def main() -> None:
    print(f"Writing QR PNGs to {os.path.realpath(OUT)}\n")
    for fn, url in QR_OUTPUTS:
        path = os.path.join(OUT, fn)
        size = make_qr(url, path)
        print(f"  {fn:24}  {size // 1024} KB  ->  {url}")
    print(
        "\nAll QRs:"
        "\n  - Foreground color: Viora forest green (#284C3E)"
        "\n  - Error correction: 30% (high — survives scuffs/lighting)"
        "\n  - Resolution: ~600x600px (scales cleanly to any print size)"
    )


if __name__ == "__main__":
    main()
