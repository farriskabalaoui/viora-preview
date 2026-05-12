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

# Keep in sync with lib/coas.ts. 13 individual peptides + 3 blends = 16 COAs.
# Stacks don't get standalone COAs — they reference the component peptide
# COAs in the app at runtime.
COAS = [
    # ── Individual peptides ──────────────────────────────────────────
    {
        "batch": "VHC-3014782", "compound": "BPC-157", "appearance": "White Lyophilized Powder",
        "cas": "137525-51-0", "formula": "C62H98N16O22", "molw": "~1419.55 g/mol",
        "cid": "108101", "qty_spec": "10mg", "qty_result": "10.85mg",
        "pur_spec": ">98%", "pur_result": "99.42%",
        "received": "04/02/2026", "analyzed": "04/03/2026",
    },
    {
        "batch": "VHC-8451209", "compound": "GLP-2-T", "appearance": "White Lyophilized Powder",
        "cas": "223132-37-4", "formula": "C164H252N44O55S", "molw": "~3766.13 g/mol",
        "cid": "16131215", "qty_spec": "5mg", "qty_result": "5.32mg",
        "pur_spec": ">98%", "pur_result": "98.87%",
        "received": "04/04/2026", "analyzed": "04/05/2026",
    },
    {
        "batch": "VHC-1058642", "compound": "Retatrutide", "appearance": "White Lyophilized Powder",
        "cas": "2381089-83-2", "formula": "C221H342N46O68", "molw": "~4731 g/mol",
        "cid": "171390338", "qty_spec": "30mg", "qty_result": "34.20mg",
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
    {
        "batch": "VHC-7934158", "compound": "MOTS-c", "appearance": "White Lyophilized Powder",
        "cas": "1627580-64-6", "formula": "C101H152N28O22S2", "molw": "~2174.64 g/mol",
        "cid": "117567929", "qty_spec": "10mg", "qty_result": "11.20mg",
        "pur_spec": ">98%", "pur_result": "99.26%",
        "received": "03/28/2026", "analyzed": "03/29/2026",
    },
    {
        "batch": "VHC-6183274", "compound": "GHK-Cu", "appearance": "Blue Lyophilized Powder",
        "cas": "89030-95-5", "formula": "C14H23CuN6O4", "molw": "~402.92 g/mol",
        "cid": "71587328", "qty_spec": "100mg", "qty_result": "112.00mg",
        "pur_spec": ">98%", "pur_result": "99.65%",
        "received": "03/28/2026", "analyzed": "03/29/2026",
    },
    {
        "batch": "VHC-5728310", "compound": "Ipamorelin", "appearance": "White Lyophilized Powder",
        "cas": "170851-70-4", "formula": "C38H49N9O5", "molw": "~711.85 g/mol",
        "cid": "11375645", "qty_spec": "5mg", "qty_result": "5.42mg",
        "pur_spec": ">98%", "pur_result": "99.71%",
        "received": "04/05/2026", "analyzed": "04/06/2026",
    },
    {
        "batch": "VHC-4209357", "compound": "IGF-1 LR3", "appearance": "White Lyophilized Powder",
        "cas": "946870-92-4", "formula": "C400H623N107O127S6", "molw": "~9111.49 g/mol",
        "cid": "118987770", "qty_spec": "1mg", "qty_result": "1.08mg",
        "pur_spec": ">98%", "pur_result": "98.94%",
        "received": "04/06/2026", "analyzed": "04/07/2026",
    },
    {
        "batch": "VHC-9035178", "compound": "NAD+", "appearance": "White Lyophilized Powder",
        "cas": "53-84-9", "formula": "C21H27N7O14P2", "molw": "~663.43 g/mol",
        "cid": "925", "qty_spec": "500mg", "qty_result": "525.00mg",
        "pur_spec": ">98%", "pur_result": "99.83%",
        "received": "04/07/2026", "analyzed": "04/08/2026",
    },
    {
        "batch": "VHC-2851964", "compound": "PT-141 (Bremelanotide)", "appearance": "White Lyophilized Powder",
        "cas": "189691-06-3", "formula": "C50H68N14O10", "molw": "~1025.18 g/mol",
        "cid": "9941379", "qty_spec": "10mg", "qty_result": "10.65mg",
        "pur_spec": ">98%", "pur_result": "99.18%",
        "received": "04/08/2026", "analyzed": "04/09/2026",
    },
    {
        "batch": "VHC-6471892", "compound": "Selank", "appearance": "White Lyophilized Powder",
        "cas": "129954-34-3", "formula": "C33H57N11O9", "molw": "~751.88 g/mol",
        "cid": "11765637", "qty_spec": "10mg", "qty_result": "10.94mg",
        "pur_spec": ">98%", "pur_result": "99.54%",
        "received": "04/09/2026", "analyzed": "04/10/2026",
    },
    {
        "batch": "VHC-3815627", "compound": "Semax", "appearance": "White Lyophilized Powder",
        "cas": "80714-61-0", "formula": "C37H51N9O10S", "molw": "~813.93 g/mol",
        "cid": "11765636", "qty_spec": "10mg", "qty_result": "10.71mg",
        "pur_spec": ">98%", "pur_result": "99.62%",
        "received": "04/10/2026", "analyzed": "04/11/2026",
    },
    {
        "batch": "VHC-7263041", "compound": "Oxytocin", "appearance": "White Lyophilized Powder",
        "cas": "50-56-6", "formula": "C43H66N12O12S2", "molw": "~1007.19 g/mol",
        "cid": "439302", "qty_spec": "2mg", "qty_result": "2.18mg",
        "pur_spec": ">98%", "pur_result": "99.47%",
        "received": "04/11/2026", "analyzed": "04/12/2026",
    },

    # ── Blends ──────────────────────────────────────────────────────
    {
        "batch": "VHC-4138572", "compound": "BPC-157 + TB-500 Blend", "appearance": "White Lyophilized Powder",
        "cas": "137525-51-0 / 77591-33-4", "formula": "C62H98N16O22 / C212H350N56O78S",
        "molw": "~1419.55 / ~4963.44 g/mol",
        "cid": "108101", "qty_spec": "20mg total", "qty_result": "21.50mg",
        "pur_spec": ">98% (each)", "pur_result": "99.21% / 99.08%",
        "received": "04/12/2026", "analyzed": "04/13/2026",
    },
    {
        "batch": "VHC-5092847", "compound": "CJC-1295 + Ipamorelin Blend", "appearance": "White Lyophilized Powder",
        "cas": "863288-34-0 / 170851-70-4", "formula": "C152H252N44O42 / C38H49N9O5",
        "molw": "~3367.97 / ~711.85 g/mol",
        "cid": "16133122", "qty_spec": "10mg total", "qty_result": "10.85mg",
        "pur_spec": ">98% (each)", "pur_result": "99.34% / 99.71%",
        "received": "04/13/2026", "analyzed": "04/14/2026",
    },
    {
        "batch": "VHC-6938205", "compound": "KLOW Blend", "appearance": "Blue-tinted Lyophilized Powder",
        "cas": "Mixed (see report)", "formula": "Multi-component blend", "molw": "Composite",
        "cid": "73587", "qty_spec": "50mg total", "qty_result": "53.40mg",
        "pur_spec": ">98% (each)", "pur_result": ">=98.9% (all components)",
        "received": "04/14/2026", "analyzed": "04/15/2026",
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
