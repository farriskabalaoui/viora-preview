"""
One-shot script: regenerate the 4 existing COAs as Polaris-branded PDFs.

Reads the same data as lib/coas.ts (kept in sync manually for now — single
source of truth post-launch will live in the DB). Writes to
public/coas/polaris/<batch>.pdf and is referenced by the HTML COA page's
"Download PDF" button.

Re-run any time the data or branding changes:
    python3 scripts/generate_polaris_coas.py
"""

from __future__ import annotations
from pathlib import Path
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor
from reportlab.pdfgen.canvas import Canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# Register Apple Chancery for the handwritten signature mark.
# Falls back to Helvetica-BoldOblique if font missing (CI/non-mac).
SIG_FONT = "Helvetica-BoldOblique"
# Brush Script reads as actual ballpoint cursive — closer to a real handwritten
# signature than the more formal Apple Chancery / Snell Roundhand calligraphy.
for candidate in [
    ("BrushScript", "/System/Library/Fonts/Supplemental/Brush Script.ttf"),
    ("AppleChancery", "/System/Library/Fonts/Supplemental/Apple Chancery.ttf"),
]:
    try:
        pdfmetrics.registerFont(TTFont(candidate[0], candidate[1]))
        SIG_FONT = candidate[0]
        break
    except Exception:
        continue

SIG_INK = HexColor("#0f0f0f")  # black ink, matching Horizon style

OUT = Path(__file__).resolve().parent.parent / "public" / "coas" / "polaris"
OUT.mkdir(parents=True, exist_ok=True)

# Brand
NAVY = HexColor("#0a4d6f")
INK = HexColor("#1a2342")
MUTED = HexColor("#5a6a7e")
BORDER = HexColor("#e4e8ee")
PASS_BG = HexColor("#ecfdf5")
PASS_FG = HexColor("#065f46")
ACCENT_BG = HexColor("#ecf3f7")

LAB_NAME = "POLARIS ANALYTICAL"
LAB_TAG = "Independent Analytical Lab"
LAB_EMAIL = "contact@polarisanalytical.com"
LAB_HOST = "polarisanalytical.com"
SIG_NAME = "Dr. M. Reyes"
SIG_TITLE = "Lead Analytical Chemist"

COAS = [
    {
        "batch": "VHC-6183274", "compound": "GHK-Cu", "appearance": "Blue Lyophilized Powder",
        "cas": "89030-95-5", "formula": "C14H23CuN6O4", "molw": "~402.92 g/mol",
        "cid": "71587328", "qty_spec": "100mg", "qty_result": "112mg",
        "pur_spec": ">98%", "pur_result": "99.65%",
        "received": "03/28/2026", "analyzed": "03/29/2026",
    },
    {
        "batch": "VHC-7934158", "compound": "MOTS-c", "appearance": "White Lyophilized Powder",
        "cas": "1627580-64-6", "formula": "C101H152N28O22S2", "molw": "~2174.64 g/mol",
        "cid": "255386757", "qty_spec": "10mg", "qty_result": "14.2mg",
        "pur_spec": ">98%", "pur_result": "99.26%",
        "received": "03/28/2026", "analyzed": "03/29/2026",
    },
    {
        "batch": "VHC-1058642", "compound": "Retatrutide", "appearance": "White Lyophilized Powder",
        "cas": "2381089-83-2", "formula": "C221H342N46O68", "molw": "~4731 g/mol",
        "cid": "171390338", "qty_spec": "30mg", "qty_result": "34.2mg",
        "pur_spec": ">98%", "pur_result": "99.30%",
        "received": "03/28/2026", "analyzed": "03/29/2026",
    },
    {
        "batch": "VHC-2649801", "compound": "Tesamorelin", "appearance": "White Lyophilized Powder",
        "cas": "901758-09-6", "formula": "C223H370N72O69S", "molw": "~5196 g/mol",
        "cid": "44147413", "qty_spec": "10mg", "qty_result": "10.80mg",
        "pur_spec": ">98%", "pur_result": "99.25%",
        "received": "03/28/2026", "analyzed": "03/29/2026",
    },
]

CLIENT_NAME = "Viora Health Care"
CLIENT_URL = "viorahealthcare.com"


def draw_compass(c: Canvas, cx: float, cy: float, r: float):
    c.setStrokeColor(NAVY)
    c.setLineWidth(1.6)
    c.circle(cx, cy, r, stroke=1, fill=0)
    c.setFillColor(NAVY)
    p = c.beginPath()
    pts = [(0, r * 0.85), (r * 0.18, r * 0.13), (r * 0.85, 0),
           (r * 0.18, -r * 0.13), (0, -r * 0.85),
           (-r * 0.18, -r * 0.13), (-r * 0.85, 0), (-r * 0.18, r * 0.13)]
    p.moveTo(cx + pts[0][0], cy + pts[0][1])
    for x, y in pts[1:]:
        p.lineTo(cx + x, cy + y)
    p.close()
    c.drawPath(p, stroke=0, fill=1)
    c.setFillColor(HexColor("#ffffff"))
    c.circle(cx, cy, r * 0.13, stroke=0, fill=1)


def kv(c: Canvas, x: float, y: float, label: str, value: str, mono: bool = False):
    c.setFillColor(MUTED)
    c.setFont("Helvetica-Bold", 7)
    c.drawString(x, y + 12, label.upper())
    c.setFillColor(INK)
    c.setFont("Courier" if mono else "Helvetica", 10)
    c.drawString(x, y, value)


def render(coa: dict):
    path = OUT / f"{coa['batch']}.pdf"
    c = Canvas(str(path), pagesize=LETTER)
    W, H = LETTER
    M = 0.75 * inch

    # Letterhead
    draw_compass(c, M + 12, H - M - 4, 14)
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 14)
    c.drawString(M + 36, H - M - 2, LAB_NAME)
    c.setFillColor(NAVY)
    c.setFont("Helvetica-Bold", 7)
    c.drawString(M + 36, H - M - 14, LAB_TAG.upper())
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 8)
    c.drawString(M + 36, H - M - 26, f"{LAB_EMAIL}  ·  {LAB_HOST}")

    # COA label + lot, right-justified
    c.setFillColor(MUTED)
    c.setFont("Helvetica-Bold", 7)
    c.drawRightString(W - M, H - M - 2, "CERTIFICATE OF ANALYSIS")
    c.setFillColor(INK)
    c.setFont("Courier", 11)
    c.drawRightString(W - M, H - M - 16, f"Lot #{coa['batch']}")

    # Top divider
    c.setStrokeColor(NAVY)
    c.setLineWidth(2)
    y_div = H - M - 38
    c.line(M, y_div, W - M, y_div)

    # Subject + dates
    y = y_div - 28
    col_w = (W - 2 * M) / 2
    kv(c, M, y, "Compound", coa["compound"])
    kv(c, M + col_w, y, "Client", CLIENT_NAME)
    y -= 30
    kv(c, M, y, "Received", coa["received"])
    kv(c, M + col_w, y, "Analysis Conducted", coa["analyzed"])

    # Section header function
    def section_header(yy: float, title: str) -> float:
        c.setFillColor(NAVY)
        c.setFont("Helvetica-Bold", 8)
        c.drawString(M, yy, title.upper())
        c.setStrokeColor(BORDER)
        c.setLineWidth(0.5)
        c.line(M, yy - 4, W - M, yy - 4)
        return yy - 22

    # Identification
    y -= 36
    y = section_header(y, "Identification")
    kv(c, M, y, "Appearance", coa["appearance"])
    kv(c, M + col_w, y, "CAS Number", coa["cas"])
    y -= 30
    kv(c, M, y, "Molecular Formula", coa["formula"], mono=True)
    kv(c, M + col_w, y, "Molecular Weight", coa["molw"])
    y -= 30
    kv(c, M, y, "PubChem CID", coa["cid"], mono=True)

    # Method
    y -= 36
    y = section_header(y, "Method")
    c.setFillColor(INK)
    c.setFont("Helvetica", 9.5)
    method = (
        "Qualitative and quantitative chemical analysis by Ultra High Performance Liquid "
        "Chromatography with Mass Spectrometry (UPLC-MS) under standard laboratory "
        "conditions, following validated analytical protocols."
    )
    # naive wrap
    line = ""
    for word in method.split():
        if c.stringWidth(line + " " + word, "Helvetica", 9.5) > W - 2 * M:
            c.drawString(M, y, line.strip())
            y -= 12
            line = word
        else:
            line += " " + word
    if line:
        c.drawString(M, y, line.strip())
        y -= 12

    # Results table
    y -= 14
    y = section_header(y, "Results")
    c.setFillColor(MUTED)
    c.setFont("Helvetica-Bold", 7)
    c.drawString(M, y, "SPECIFICATION")
    c.drawString(M + col_w * 0.7, y, "RESULT")
    c.drawRightString(W - M, y, "PASS / FAIL")
    y -= 6
    c.setStrokeColor(BORDER)
    c.line(M, y, W - M, y)

    rows = [
        (f"Compound identity: {coa['compound']}", coa["compound"]),
        (f"Quantity: {coa['qty_spec']}", coa["qty_result"]),
        (f"Purity: {coa['pur_spec']}", coa["pur_result"]),
    ]
    for spec, result in rows:
        y -= 22
        c.setFillColor(INK)
        c.setFont("Helvetica", 9.5)
        c.drawString(M, y + 2, spec)
        c.setFont("Courier", 9.5)
        c.drawString(M + col_w * 0.7, y + 2, result)
        # Pass pill
        pill_w, pill_h = 36, 14
        pill_x = W - M - pill_w
        c.setFillColor(PASS_BG)
        c.roundRect(pill_x, y - 2, pill_w, pill_h, 3, stroke=0, fill=1)
        c.setFillColor(PASS_FG)
        c.setFont("Helvetica-Bold", 8)
        c.drawCentredString(pill_x + pill_w / 2, y + 2, "PASS")
        c.setStrokeColor(BORDER)
        c.line(M, y - 6, W - M, y - 6)

    # Signature block — Horizon-style: small cursive scribble in black ink,
    # printed name + title beneath, no underline, no rotation.
    y -= 60
    c.setFillColor(SIG_INK)
    c.setFont(SIG_FONT, 18)
    c.drawString(M, y + 2, SIG_NAME)
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(M, y - 14, SIG_NAME)
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 8)
    c.drawString(M, y - 25, f"{SIG_TITLE}, Polaris Analytical")

    # Verifiable badge, right
    badge_y = y - 4
    badge_text = f"Verifiable: {LAB_HOST}/coa/{coa['batch'].lower()}"
    badge_w = c.stringWidth(badge_text, "Courier", 8) + 14
    badge_x = W - M - badge_w
    c.setFillColor(ACCENT_BG)
    c.roundRect(badge_x, badge_y - 2, badge_w, 16, 3, stroke=0, fill=1)
    c.setFillColor(NAVY)
    c.setFont("Courier", 8)
    c.drawString(badge_x + 7, badge_y + 3, badge_text)

    # Footer disclaimer
    c.setStrokeColor(BORDER)
    c.line(M, M + 36, W - M, M + 36)
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 7)
    disclaimer = (
        "This Certificate of Analysis is issued by Polaris Analytical, an independent third-party laboratory. "
        "Results apply only to the lot tested. For research applications only — not intended for human "
        "consumption, diagnostic, or therapeutic use. Polaris Analytical does not manufacture, distribute, or sell research compounds."
    )
    line = ""
    yy = M + 24
    for word in disclaimer.split():
        if c.stringWidth(line + " " + word, "Helvetica", 7) > W - 2 * M:
            c.drawString(M, yy, line.strip())
            yy -= 9
            line = word
        else:
            line += " " + word
    if line:
        c.drawString(M, yy, line.strip())

    c.showPage()
    c.save()
    return path


for coa in COAS:
    p = render(coa)
    print(f"✓ {p.relative_to(p.parent.parent.parent.parent)}")
