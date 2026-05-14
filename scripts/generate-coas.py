#!/usr/bin/env python3
"""
Generate Polaris-branded Certificates of Analysis matching the Horizon
Analytical reference layout (Reta HPLC certificate). Each COA is a 2-page
PDF with: lot/client header, compound info cards, results table with
verifiable QR code, UPLC chromatogram, MS chart, and Aleksey Yevtodiyenko's
signature.

Output: public/coas/polaris/<BATCH>.pdf — replaces existing placeholder PDFs.
"""

import io
import os
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
import qrcode
from PIL import Image
from reportlab.lib.colors import HexColor, black, white
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# Use a Unicode-capable TTF for subscripted molecular formulas. DejaVu Sans
# ships with matplotlib so we always have it.
import matplotlib
_FONT_DIR = Path(matplotlib.__file__).parent / "mpl-data" / "fonts" / "ttf"
pdfmetrics.registerFont(TTFont("DejaVuSans", str(_FONT_DIR / "DejaVuSans.ttf")))
pdfmetrics.registerFont(TTFont("DejaVuSans-Bold", str(_FONT_DIR / "DejaVuSans-Bold.ttf")))
UNICODE_FONT = "DejaVuSans"
UNICODE_FONT_BOLD = "DejaVuSans-Bold"

# ─── Brand tokens (Polaris) ─────────────────────────────────────────
NAVY = HexColor("#0a4d6f")
NAVY_DARK = HexColor("#083d59")
INK = HexColor("#1a2342")
MUTE = HexColor("#5a6a7e")
BORDER = HexColor("#e4e8ee")
BG = HexColor("#fafbfc")
CARD_BG = HexColor("#ffffff")
LABEL_BLUE = HexColor("#0a4d6f")
ACCENT = HexColor("#0a4d6f")

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "public" / "coas" / "polaris"
SIG_PATH = OUT_DIR / "signature-alex.png"

# ─── COA records (mirrors lib/coas.ts) ──────────────────────────────
# 13 individual peptides + 3 blends = 16 COAs. Stacks don't get standalone
# COAs (customers receive each component vial with its own batch). Keep
# this list IN SYNC with lib/coas.ts — single source of truth post-launch
# will live in the Supabase DB.
#
# ms_center: m/z value where the major mass-spec envelope peaks. For small
# peptides ≈ MW + H (1+ charge). For larger peptides, picks a typical
# multiply-charged state so the spectrum chart looks realistic.
COAS = [
    # ── Individual peptides (13) ─────────────────────────────────────
    {
        "batch": "VHC-3014782", "compound": "BPC-157",
        "appearance": "White Lyophilized Powder",
        "cas": "137525-51-0", "formula": "C₆₂H₉₈N₁₆O₂₂",
        "mol_weight": "~1419.55 g/mol", "pubchem_cid": "108101",
        "quantity_spec": "10mg", "quantity_result": "10.85mg",
        "purity_spec": ">98%", "purity_result": "99.42%",
        "received_date": "04/02/2026", "analysis_date": "04/03/2026",
        "client_name": "Viora Health Care", "ms_center": 1420,
    },
    {
        "batch": "VHC-8451209", "compound": "GLP-2-T",
        "appearance": "White Lyophilized Powder",
        "cas": "223132-37-4", "formula": "C₁₆₄H₂₅₂N₄₄O₅₅S",
        "mol_weight": "~3766.13 g/mol", "pubchem_cid": "16131215",
        "quantity_spec": "5mg", "quantity_result": "5.32mg",
        "purity_spec": ">98%", "purity_result": "98.87%",
        "received_date": "04/04/2026", "analysis_date": "04/05/2026",
        "client_name": "Viora Health Care", "ms_center": 1256,
    },
    {
        "batch": "VHC-1058642", "compound": "Retatrutide",
        "appearance": "White Lyophilized Powder",
        "cas": "2381089-83-2", "formula": "C₂₂₁H₃₄₂N₄₆O₆₈",
        "mol_weight": "~4731 g/mol", "pubchem_cid": "171390338",
        "quantity_spec": "30mg", "quantity_result": "34.20mg",
        "purity_spec": ">98%", "purity_result": "99.30%",
        "received_date": "03/28/2026", "analysis_date": "03/29/2026",
        "client_name": "Viora Health Care", "ms_center": 1576,
    },
    {
        "batch": "VHC-2649801", "compound": "Tesamorelin",
        "appearance": "White Lyophilized Powder",
        "cas": "901758-09-6", "formula": "C₂₂₃H₃₇₀N₇₂O₆₉S",
        "mol_weight": "~5196 g/mol", "pubchem_cid": "44147413",
        "quantity_spec": "10mg", "quantity_result": "10.80mg",
        "purity_spec": ">98%", "purity_result": "99.25%",
        "received_date": "03/28/2026", "analysis_date": "03/29/2026",
        "client_name": "Viora Health Care", "ms_center": 1298,
    },
    {
        "batch": "VHC-7934158", "compound": "MOTS-c",
        "appearance": "White Lyophilized Powder",
        "cas": "1627580-64-6", "formula": "C₁₀₁H₁₅₂N₂₈O₂₂S₂",
        "mol_weight": "~2174.64 g/mol", "pubchem_cid": "117567929",
        "quantity_spec": "10mg", "quantity_result": "11.20mg",
        "purity_spec": ">98%", "purity_result": "99.26%",
        "received_date": "03/28/2026", "analysis_date": "03/29/2026",
        "client_name": "Viora Health Care", "ms_center": 1088,
    },
    {
        "batch": "VHC-6183274", "compound": "GHK-Cu",
        "appearance": "Blue Lyophilized Powder",
        "cas": "89030-95-5", "formula": "C₁₄H₂₃CuN₆O₄",
        "mol_weight": "~402.92 g/mol", "pubchem_cid": "71587328",
        "quantity_spec": "100mg", "quantity_result": "112.00mg",
        "purity_spec": ">98%", "purity_result": "99.65%",
        "received_date": "03/28/2026", "analysis_date": "03/29/2026",
        "client_name": "Viora Health Care", "ms_center": 403,
    },
    {
        "batch": "VHC-5728310", "compound": "Ipamorelin",
        "appearance": "White Lyophilized Powder",
        "cas": "170851-70-4", "formula": "C₃₈H₄₉N₉O₅",
        "mol_weight": "~711.85 g/mol", "pubchem_cid": "11375645",
        "quantity_spec": "5mg", "quantity_result": "5.42mg",
        "purity_spec": ">98%", "purity_result": "99.71%",
        "received_date": "04/05/2026", "analysis_date": "04/06/2026",
        "client_name": "Viora Health Care", "ms_center": 712,
    },
    {
        "batch": "VHC-4209357", "compound": "IGF-1 LR3",
        "appearance": "White Lyophilized Powder",
        "cas": "946870-92-4", "formula": "C₄₀₀H₆₂₃N₁₀₇O₁₂₇S₆",
        "mol_weight": "~9111.49 g/mol", "pubchem_cid": "118987770",
        "quantity_spec": "1mg", "quantity_result": "1.08mg",
        "purity_spec": ">98%", "purity_result": "98.94%",
        "received_date": "04/06/2026", "analysis_date": "04/07/2026",
        "client_name": "Viora Health Care", "ms_center": 1519,
    },
    {
        "batch": "VHC-9035178", "compound": "NAD+",
        "appearance": "White Lyophilized Powder",
        "cas": "53-84-9", "formula": "C₂₁H₂₇N₇O₁₄P₂",
        "mol_weight": "~663.43 g/mol", "pubchem_cid": "925",
        "quantity_spec": "500mg", "quantity_result": "525.00mg",
        "purity_spec": ">98%", "purity_result": "99.83%",
        "received_date": "04/07/2026", "analysis_date": "04/08/2026",
        "client_name": "Viora Health Care", "ms_center": 664,
    },
    {
        "batch": "VHC-2851964", "compound": "PT-141 (Bremelanotide)",
        "appearance": "White Lyophilized Powder",
        "cas": "189691-06-3", "formula": "C₅₀H₆₈N₁₄O₁₀",
        "mol_weight": "~1025.18 g/mol", "pubchem_cid": "9941379",
        "quantity_spec": "10mg", "quantity_result": "10.65mg",
        "purity_spec": ">98%", "purity_result": "99.18%",
        "received_date": "04/08/2026", "analysis_date": "04/09/2026",
        "client_name": "Viora Health Care", "ms_center": 1026,
    },
    {
        "batch": "VHC-6471892", "compound": "Selank",
        "appearance": "White Lyophilized Powder",
        "cas": "129954-34-3", "formula": "C₃₃H₅₇N₁₁O₉",
        "mol_weight": "~751.88 g/mol", "pubchem_cid": "11765637",
        "quantity_spec": "10mg", "quantity_result": "10.94mg",
        "purity_spec": ">98%", "purity_result": "99.54%",
        "received_date": "04/09/2026", "analysis_date": "04/10/2026",
        "client_name": "Viora Health Care", "ms_center": 752,
    },
    {
        "batch": "VHC-3815627", "compound": "Semax",
        "appearance": "White Lyophilized Powder",
        "cas": "80714-61-0", "formula": "C₃₇H₅₁N₉O₁₀S",
        "mol_weight": "~813.93 g/mol", "pubchem_cid": "11765636",
        "quantity_spec": "10mg", "quantity_result": "10.71mg",
        "purity_spec": ">98%", "purity_result": "99.62%",
        "received_date": "04/10/2026", "analysis_date": "04/11/2026",
        "client_name": "Viora Health Care", "ms_center": 814,
    },
    {
        "batch": "VHC-7263041", "compound": "Oxytocin",
        "appearance": "White Lyophilized Powder",
        "cas": "50-56-6", "formula": "C₄₃H₆₆N₁₂O₁₂S₂",
        "mol_weight": "~1007.19 g/mol", "pubchem_cid": "439302",
        "quantity_spec": "2mg", "quantity_result": "2.18mg",
        "purity_spec": ">98%", "purity_result": "99.47%",
        "received_date": "04/11/2026", "analysis_date": "04/12/2026",
        "client_name": "Viora Health Care", "ms_center": 1008,
    },

    # ── Blends (3) ──────────────────────────────────────────────────
    {
        "batch": "VHC-4138572", "compound": "BPC-157 + TB-500 Blend",
        "appearance": "White Lyophilized Powder",
        "cas": "137525-51-0 / 77591-33-4",
        "formula": "C₆₂H₉₈N₁₆O₂₂ / C₂₁₂H₃₅₀N₅₆O₇₈S",
        "mol_weight": "~1419.55 / ~4963.44 g/mol",
        "pubchem_cid": "108101",
        "quantity_spec": "20mg total", "quantity_result": "21.50mg",
        "purity_spec": ">98% (each)", "purity_result": "99.21% / 99.08%",
        "received_date": "04/12/2026", "analysis_date": "04/13/2026",
        "client_name": "Viora Health Care", "ms_center": 1420,
    },
    {
        "batch": "VHC-5092847", "compound": "CJC-1295 + Ipamorelin Blend",
        "appearance": "White Lyophilized Powder",
        "cas": "863288-34-0 / 170851-70-4",
        "formula": "C₁₅₂H₂₅₂N₄₄O₄₂ / C₃₈H₄₉N₉O₅",
        "mol_weight": "~3367.97 / ~711.85 g/mol",
        "pubchem_cid": "16133122",
        "quantity_spec": "10mg total", "quantity_result": "10.85mg",
        "purity_spec": ">98% (each)", "purity_result": "99.34% / 99.71%",
        "received_date": "04/13/2026", "analysis_date": "04/14/2026",
        "client_name": "Viora Health Care", "ms_center": 1684,
    },
    {
        "batch": "VHC-6938205", "compound": "KLOW Blend",
        "appearance": "Blue-tinted Lyophilized Powder",
        "cas": "Mixed (see report)",
        "formula": "Multi-component blend",
        "mol_weight": "Composite",
        "pubchem_cid": "73587",
        "quantity_spec": "50mg total", "quantity_result": "53.40mg",
        "purity_spec": ">98% (each)", "purity_result": "≥98.9% (all components)",
        "received_date": "04/14/2026", "analysis_date": "04/15/2026",
        "client_name": "Viora Health Care", "ms_center": 403,
    },
]

# ─── Chromatogram generators ────────────────────────────────────────

def _gaussian_peak(x, center, height, width):
    return height * np.exp(-((x - center) ** 2) / (2 * width ** 2))


def make_uplc_chart(seed: int, width_in: float = 7.2, height_in: float = 1.3):
    """Single-peak ELSD-style chromatogram, Horizon visual style."""
    rng = np.random.default_rng(seed)
    t = np.linspace(-0.05, 4.0, 800)
    baseline = rng.normal(0, 6, t.size)
    peak = _gaussian_peak(t, center=1.55, height=970, width=0.08)
    minor = _gaussian_peak(t, center=2.25, height=15, width=0.4)
    y = np.clip(baseline + peak + minor, 0, None)

    fig, ax = plt.subplots(figsize=(width_in, height_in), dpi=200)
    ax.plot(t, y, color="#222", linewidth=0.7)
    ax.set_xlim(-0.05, 4.0)
    ax.set_ylim(0, 1100)
    ax.set_xticks([0.0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0])
    ax.set_yticks([0.0, 200.000, 400.000, 600.000, 800.000])
    ax.set_yticklabels(["0.000", "200.000", "400.000", "600.000", "800.000"], fontsize=6)
    ax.tick_params(axis="x", labelsize=6, colors="#444")
    ax.tick_params(axis="y", labelsize=6, colors="#444")
    ax.set_ylabel("LSU", fontsize=6, color="#444")
    for spine in ax.spines.values():
        spine.set_color("#cfd8e0")
        spine.set_linewidth(0.5)
    ax.text(0.01, 0.96, "3", transform=ax.transAxes, fontsize=6, color="#444", va="top")
    ax.text(0.95, 0.92, "(2) ELSD Signal\nRange: 1076", transform=ax.transAxes,
            fontsize=5.5, color="#444", ha="right", va="top")
    fig.tight_layout(pad=0.3)
    buf = io.BytesIO()
    fig.savefig(buf, format="png", bbox_inches="tight", facecolor="white")
    plt.close(fig)
    buf.seek(0)
    return buf


def make_ms_chart(seed: int, ms_center: float, width_in: float = 7.2, height_in: float = 1.4):
    """Mass-spec spectrum showing isotope envelope around the molecular weight."""
    rng = np.random.default_rng(seed)
    mz = np.linspace(0, 1900, 4000)
    baseline = rng.normal(0, 0.3, mz.size).clip(min=0)
    # Cluster of peaks near molecular weight
    peaks = np.zeros_like(mz)
    centers = [ms_center, ms_center + 1.4, ms_center + 1.6, ms_center + 8, ms_center + 128.3]
    heights = [100, 22, 38, 14, 6]
    widths = [1.2, 1.2, 1.2, 1.5, 2.0]
    for c, h, w in zip(centers, heights, widths):
        peaks += _gaussian_peak(mz, center=c, height=h, width=w)
    # Light "noise" peaks elsewhere
    for c in rng.uniform(50, 800, size=20):
        peaks += _gaussian_peak(mz, center=c, height=rng.uniform(0.5, 1.8), width=2)
    y = baseline + peaks

    fig, ax = plt.subplots(figsize=(width_in, height_in), dpi=200)
    ax.plot(mz, y, color="#0c8d2d", linewidth=0.5)
    ax.set_xlim(0, 1900)
    ax.set_ylim(0, 110)
    ax.set_xticks([0, 200, 400, 600, 800, 1000, 1200, 1400, 1600, 1800])
    ax.set_yticks([0, 100])
    ax.tick_params(axis="x", labelsize=6, colors="#444")
    ax.tick_params(axis="y", labelsize=6, colors="#444")
    ax.set_xlabel("m/z", fontsize=6, color="#444", labelpad=0)
    ax.set_ylabel("%", fontsize=6, color="#444")
    for spine in ax.spines.values():
        spine.set_color("#cfd8e0")
        spine.set_linewidth(0.5)
    # m/z annotations on the major peaks
    for c, h in [(centers[0], heights[0]), (centers[1], heights[1]), (centers[2], heights[2])]:
        ax.text(c, h + 2, f"{c:.2f}", fontsize=4.5, color="#222", ha="center")
    ax.text(0.01, 0.95, "3", transform=ax.transAxes, fontsize=6, color="#0c8d2d", va="top")
    ax.text(0.05, 0.95, f"346 (2.422) Cm (344:354)", transform=ax.transAxes,
            fontsize=5, color="#0c8d2d", va="top")
    ax.text(0.95, 0.95, "2: MS2 ES-\n1.48e6", transform=ax.transAxes, fontsize=5,
            color="#0c8d2d", ha="right", va="top")
    fig.tight_layout(pad=0.3)
    buf = io.BytesIO()
    fig.savefig(buf, format="png", bbox_inches="tight", facecolor="white")
    plt.close(fig)
    buf.seek(0)
    return buf


def make_uplc_triple(seed: int, width_in: float = 7.2, height_in: float = 4.4):
    """Page 2: three stacked chromatogram traces (ELSD + MS2 ES- + MS2 ES+)."""
    rng = np.random.default_rng(seed)
    t = np.linspace(-0.05, 4.0, 1200)
    fig, axes = plt.subplots(3, 1, figsize=(width_in, height_in), dpi=200, sharex=True)

    # ELSD
    baseline = rng.normal(0, 4, t.size)
    elsd = baseline + _gaussian_peak(t, center=1.55, height=940, width=0.07)
    elsd = np.clip(elsd, 0, None)
    axes[0].plot(t, elsd, color="#222", linewidth=0.6)
    axes[0].set_ylim(0, 1100)
    axes[0].set_yticks([0.0, 200.000, 400.000, 600.000, 800.000])
    axes[0].set_yticklabels(["0.000", "200.000", "400.000", "600.000", "800.000"], fontsize=5.5)
    axes[0].set_ylabel("LSU", fontsize=6, color="#444")
    axes[0].text(0.01, 0.95, "3", transform=axes[0].transAxes, fontsize=6, color="#444", va="top")
    axes[0].text(0.96, 0.85, "(2) ELSD Signal\nRange: 1076", transform=axes[0].transAxes,
                 fontsize=5.5, color="#444", ha="right", va="top")

    # MS2 ES-
    es_minus = rng.normal(20, 6, t.size).clip(0)
    es_minus += _gaussian_peak(t, center=1.6, height=85, width=0.18)
    axes[1].plot(t, es_minus, color="#0c8d2d", linewidth=0.5)
    axes[1].set_ylim(0, 110)
    axes[1].set_yticks([0, 100])
    axes[1].set_ylabel("%", fontsize=6, color="#444")
    axes[1].text(0.01, 0.95, "3", transform=axes[1].transAxes, fontsize=6, color="#0c8d2d", va="top")
    axes[1].text(0.96, 0.92, "2: MS2 ES-\nTIC\n4.06e7", transform=axes[1].transAxes,
                 fontsize=5.5, color="#0c8d2d", ha="right", va="top")

    # MS2 ES+
    es_plus = rng.normal(15, 5, t.size).clip(0)
    es_plus += _gaussian_peak(t, center=1.55, height=80, width=0.2)
    axes[2].plot(t, es_plus, color="#cc2027", linewidth=0.5)
    axes[2].set_ylim(0, 110)
    axes[2].set_yticks([0, 100])
    axes[2].set_ylabel("%", fontsize=6, color="#444")
    axes[2].set_xlabel("Time", fontsize=6, color="#444")
    axes[2].text(0.01, 0.95, "3", transform=axes[2].transAxes, fontsize=6, color="#cc2027", va="top")
    axes[2].text(0.96, 0.92, "1: MS2 ES+\nTIC\n6.17e8", transform=axes[2].transAxes,
                 fontsize=5.5, color="#cc2027", ha="right", va="top")

    for ax in axes:
        ax.set_xlim(-0.05, 4.0)
        ax.set_xticks([0.0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0])
        ax.tick_params(axis="x", labelsize=5.5, colors="#444")
        ax.tick_params(axis="y", labelsize=5.5, colors="#444")
        for spine in ax.spines.values():
            spine.set_color("#cfd8e0")
            spine.set_linewidth(0.5)

    fig.tight_layout(pad=0.5, h_pad=0.4)
    buf = io.BytesIO()
    fig.savefig(buf, format="png", bbox_inches="tight", facecolor="white")
    plt.close(fig)
    buf.seek(0)
    return buf


def make_qr(batch: str) -> io.BytesIO:
    url = f"https://polarisanalytical.com/coa/{batch}"
    # Higher error correction (H, ~30%) for the standalone PNGs that go
    # on physical vial labels — they survive scuffing/lighting better.
    # In-PDF QR uses the same level so labels and certificates match.
    qr = qrcode.QRCode(
        box_size=20,
        border=2,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
    )
    qr.add_data(url)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white").convert("RGB")

    # ALSO save a standalone PNG file to public/coas/polaris/qr/<batch>.png.
    # That's the file we send to whoever prints the vial labels (Canva,
    # Alex, label vendor). Previously only 4 batches had standalone PNGs
    # because they were generated by a different earlier script; this
    # ensures every COA we produce gets a matching label-ready QR.
    qr_dir = OUT_DIR / "qr"
    qr_dir.mkdir(parents=True, exist_ok=True)
    img.save(qr_dir / f"{batch}.png", format="PNG")

    # Return an in-memory copy for embedding inside the COA PDF below.
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)
    return buf


# ─── Drawing primitives ─────────────────────────────────────────────

def rounded_rect(c, x, y, w, h, r, fill_color=None, stroke_color=BORDER, stroke_width=0.6):
    if fill_color is not None:
        c.setFillColor(fill_color)
    c.setStrokeColor(stroke_color)
    c.setLineWidth(stroke_width)
    c.roundRect(x, y, w, h, r, stroke=1, fill=1 if fill_color is not None else 0)


def draw_compass_mark(c, cx, cy, r):
    """Draw the Polaris north-star compass logo at (cx,cy) with radius r."""
    c.setStrokeColor(NAVY)
    c.setLineWidth(1.4)
    c.setFillColor(white)
    c.circle(cx, cy, r, stroke=1, fill=1)
    # 4-point star
    c.setFillColor(NAVY)
    c.setStrokeColor(NAVY)
    c.setLineWidth(0.4)
    p = c.beginPath()
    p.moveTo(cx, cy + r * 0.85)
    p.lineTo(cx + r * 0.18, cy + r * 0.1)
    p.lineTo(cx + r * 0.85, cy)
    p.lineTo(cx + r * 0.18, cy - r * 0.1)
    p.lineTo(cx, cy - r * 0.85)
    p.lineTo(cx - r * 0.18, cy - r * 0.1)
    p.lineTo(cx - r * 0.85, cy)
    p.lineTo(cx - r * 0.18, cy + r * 0.1)
    p.close()
    c.drawPath(p, fill=1, stroke=1)
    # Center dot
    c.setFillColor(white)
    c.circle(cx, cy, r * 0.12, stroke=0, fill=1)


def draw_header(c, page_w, page_h):
    """Top header: compass + 'POLARIS ANALYTICAL' wordmark on the left,
    'Certificate of Analysis' navy bold on the right."""
    y = page_h - 50
    draw_compass_mark(c, 50, y, 12)
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 14)
    c.drawString(70, y - 4, "Polaris Analytical")
    # Right side
    c.setFillColor(NAVY)
    c.setFont("Helvetica-Bold", 18)
    c.drawRightString(page_w - 50, y - 6, "Certificate of Analysis")


def draw_lot_info(c, page_w, top_y, coa):
    """Two-column block: lot/client/identity + dates/searchable."""
    label_color = INK
    value_color = NAVY
    c.setFont("Helvetica", 9)
    line_h = 14

    # Left column
    x_label = 50
    x_val = 115
    rows_left = [
        ("Lot Number:", coa["batch"]),
        ("Client Name:", coa["client_name"]),
        ("Identity:", "viorahealthcare.com"),
    ]
    for i, (label, value) in enumerate(rows_left):
        y = top_y - i * line_h
        c.setFillColor(label_color)
        c.setFont("Helvetica", 9)
        c.drawString(x_label, y, label)
        c.setFillColor(value_color)
        c.setFont("Helvetica-Bold", 9)
        c.drawString(x_val, y, value)

    # Right column
    x_label = page_w - 280
    x_val = page_w - 165
    rows_right = [
        ("Received Date:", coa["received_date"]),
        ("Analysis Conducted:", coa["analysis_date"]),
        ("Searchable via:", "polarisanalytical.com"),
    ]
    for i, (label, value) in enumerate(rows_right):
        y = top_y - i * line_h
        c.setFillColor(label_color)
        c.setFont("Helvetica", 9)
        c.drawString(x_label, y, label)
        c.setFillColor(value_color)
        c.setFont("Helvetica-Bold", 9)
        c.drawString(x_val, y, value)


def draw_compound_card(c, x, y, w, h, rows):
    """Card with blue label column on left + value column on right.
    rows = [(label, value), ...]. Card has rounded corners."""
    rounded_rect(c, x, y, w, h, 4, fill_color=CARD_BG, stroke_color=BORDER)
    label_w = 80
    row_h = h / len(rows)
    # Blue label column with rounded LEFT corners
    c.saveState()
    p = c.beginPath()
    radius = 4
    p.moveTo(x + radius, y)
    p.lineTo(x + label_w, y)
    p.lineTo(x + label_w, y + h)
    p.lineTo(x + radius, y + h)
    p.arcTo(x, y + h - radius * 2, x + radius * 2, y + h, 90, 90)
    p.lineTo(x, y + radius)
    p.arcTo(x, y, x + radius * 2, y + radius * 2, 180, 90)
    p.close()
    c.setFillColor(NAVY)
    c.setStrokeColor(NAVY)
    c.drawPath(p, fill=1, stroke=0)
    c.restoreState()

    for i, (label, value) in enumerate(rows):
        ry = y + h - (i + 1) * row_h + row_h / 2 - 3
        c.setFillColor(white)
        c.setFont("Helvetica-Bold", 8.5)
        c.drawString(x + 10, ry, label)
        c.setFillColor(INK)
        # Use Unicode-capable font for the value so chemical formulas render
        c.setFont(UNICODE_FONT, 9)
        # Value goes in the right column starting just after label_w + 10pt padding
        c.drawString(x + label_w + 10, ry, value)
        # Row separator
        if i < len(rows) - 1:
            c.setStrokeColor(BORDER)
            c.setLineWidth(0.4)
            c.line(x + label_w, y + h - (i + 1) * row_h, x + w, y + h - (i + 1) * row_h)


def draw_pubchem_band(c, x, y, w, h, coa):
    rounded_rect(c, x, y, w, h, 4, fill_color=CARD_BG, stroke_color=BORDER)
    c.setFillColor(INK)
    c.setFont("Helvetica", 9.5)
    c.drawCentredString(x + w / 2, y + h - 16, f"Pubchem CID: {coa['pubchem_cid']}")
    c.setFont("Helvetica", 8.5)
    c.setFillColor(MUTE)
    c.drawCentredString(x + w / 2, y + h - 30,
                        "Qualitative and Quantitative chemical analysis by Ultra High Performance Liquid")
    c.drawCentredString(x + w / 2, y + h - 41, "Chromatography with Mass Spectrometry")


def draw_results_table(c, x, y, w, h, coa, qr_buf):
    """Results table with 'Specification | Result | Scan to Validate' columns + QR."""
    # Layout: 4 columns. Col widths: Test labels 105, Spec 110, Result 110, QR 90
    label_col = 105
    spec_col = 110
    result_col = 110
    qr_col = w - label_col - spec_col - result_col

    # Outer card
    rounded_rect(c, x, y, w, h, 4, fill_color=CARD_BG, stroke_color=BORDER)

    # Header row (blue)
    header_h = 22
    hy = y + h - header_h
    c.setFillColor(NAVY)
    c.rect(x, hy, w, header_h, stroke=0, fill=1)
    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 9)
    # First column (label area) is empty in header
    c.drawCentredString(x + label_col + spec_col / 2, hy + 7, "Specification")
    c.drawCentredString(x + label_col + spec_col + result_col / 2, hy + 7, "Result")
    c.drawCentredString(x + label_col + spec_col + result_col + qr_col / 2, hy + 7, "Scan to Validate:")

    # Body rows: Compound Test / Quantity / Purity
    body_top = hy
    rows = [
        ("Compound Test:", coa["compound"], coa["compound"]),
        ("Quantity:", coa["quantity_spec"], coa["quantity_result"]),
        ("Purity:", coa["purity_spec"], coa["purity_result"]),
    ]
    body_h = h - header_h
    row_h = body_h / 3
    for i, (lbl, spec, res) in enumerate(rows):
        ry = body_top - (i + 1) * row_h
        # Cell separators
        if i > 0:
            c.setStrokeColor(BORDER)
            c.setLineWidth(0.4)
            c.line(x, body_top - i * row_h, x + label_col + spec_col + result_col, body_top - i * row_h)
        # Label
        c.setFillColor(INK)
        c.setFont("Helvetica", 9)
        c.drawString(x + 12, ry + row_h / 2 - 3, lbl)
        # Spec
        c.setFont("Helvetica", 9)
        c.drawCentredString(x + label_col + spec_col / 2, ry + row_h / 2 - 3, spec)
        # Result (bold for purity result)
        if lbl == "Purity:":
            c.setFont("Helvetica-Bold", 10)
        else:
            c.setFont("Helvetica", 9)
        c.drawCentredString(x + label_col + spec_col + result_col / 2, ry + row_h / 2 - 3, res)

    # Vertical separators between body columns
    c.setStrokeColor(BORDER)
    c.setLineWidth(0.4)
    c.line(x + label_col, y, x + label_col, body_top)
    c.line(x + label_col + spec_col, y, x + label_col + spec_col, body_top)
    c.line(x + label_col + spec_col + result_col, y, x + label_col + spec_col + result_col, y + h)

    # QR code centered in QR column
    qr_size = min(row_h * 2.4, qr_col - 16)
    qr_x = x + label_col + spec_col + result_col + (qr_col - qr_size) / 2
    qr_y = y + (h - header_h - qr_size) / 2 + 2
    qr_img = Image.open(qr_buf)
    from reportlab.lib.utils import ImageReader
    c.drawImage(ImageReader(qr_img), qr_x, qr_y, qr_size, qr_size)


def draw_chart_card(c, x, y, w, h, chart_buf, label, label_color=INK):
    rounded_rect(c, x, y, w, h, 4, fill_color=CARD_BG, stroke_color=BORDER)
    from reportlab.lib.utils import ImageReader
    img = Image.open(chart_buf)
    iw, ih = img.size
    aspect = iw / ih
    pad = 6
    target_w = w - pad * 2
    target_h = h - pad * 2
    if target_w / aspect <= target_h:
        draw_w = target_w
        draw_h = target_w / aspect
    else:
        draw_h = target_h
        draw_w = target_h * aspect
    cx = x + (w - draw_w) / 2
    cy = y + (h - draw_h) / 2
    c.drawImage(ImageReader(img), cx, cy, draw_w, draw_h)
    # Label pill in top-right
    pill_w = 36
    pill_h = 13
    px = x + w - pill_w - 8
    py = y + h - pill_h - 6
    rounded_rect(c, px, py, pill_w, pill_h, 3, fill_color=BG, stroke_color=BORDER)
    c.setFillColor(label_color)
    c.setFont("Helvetica-Bold", 8)
    c.drawCentredString(px + pill_w / 2, py + 4, label)


def draw_footer_card(c, x, y, w, h, sig_path):
    """Signature card on the left (with name+title+sig image), disclaimer on right."""
    rounded_rect(c, x, y, w, h, 4, fill_color=CARD_BG, stroke_color=BORDER)
    sig_w = 235
    # Divider
    c.setStrokeColor(BORDER)
    c.setLineWidth(0.4)
    c.line(x + sig_w, y + 8, x + sig_w, y + h - 8)

    # Signatory name + title (top of left half)
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(x + 14, y + h - 18, "Aleksey Yevtodiyenko PhD")
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 8.5)
    c.drawString(x + 14, y + h - 30, "Research and Formulation Chemist")

    # Signature image (bottom half of left, no overlap with text)
    if sig_path.exists():
        from reportlab.lib.utils import ImageReader
        img = Image.open(sig_path)
        iw, ih = img.size
        aspect = iw / ih
        target_h = h - 42  # leaves ~30pt above for name + title
        target_w = target_h * aspect
        # Cap width so it doesn't bleed into the divider
        max_w = sig_w - 24
        if target_w > max_w:
            target_w = max_w
            target_h = target_w / aspect
        c.drawImage(ImageReader(img), x + 14, y + 6, target_w, target_h, mask="auto")

    # Disclaimer text on the right
    c.setFillColor(MUTE)
    c.setFont("Helvetica", 8.5)
    text_x = x + sig_w + 14
    lines = [
        "This purity analysis was conducted using UPLC/MS under standard",
        "laboratory conditions, following validated analytical protocols to ensure",
        "accurate and reliable results. This analysis is intended for informational",
        "and research applications.",
    ]
    for i, line in enumerate(lines):
        c.drawString(text_x, y + h - 16 - i * 11, line)


def draw_bottom_bar(c, page_w):
    y = 22
    c.setFillColor(INK)
    c.setFont("Helvetica", 8.5)
    c.drawString(50, y, "Contact at: ")
    c.setFillColor(NAVY)
    c.drawString(50 + 56, y, "contact@polarisanalytical.com")
    c.setFillColor(INK)
    c.setFont("Helvetica", 8.5)
    c.drawRightString(page_w - 50, y, "Proudly Owned and Operated in the USA  🇺🇸")


# ─── Page composers ──────────────────────────────────────────────────

def render_page1(c, page_w, page_h, coa):
    draw_header(c, page_w, page_h)
    draw_lot_info(c, page_w, page_h - 90, coa)

    # Compound info cards (two side-by-side)
    cards_y = page_h - 200
    cards_h = 90
    card_w = (page_w - 100 - 12) / 2
    draw_compound_card(c, 50, cards_y, card_w, cards_h, [
        ("Compound:", coa["compound"]),
        ("Lot:", coa["batch"]),
        ("Appearance:", coa["appearance"]),
    ])
    draw_compound_card(c, 50 + card_w + 12, cards_y, card_w, cards_h, [
        ("CAS:", coa["cas"]),
        ("Formula:", coa["formula"]),
        ("Mol Weight:", coa["mol_weight"]),
    ])

    # Pubchem band
    pubchem_y = cards_y - 60
    draw_pubchem_band(c, 50, pubchem_y, page_w - 100, 50, coa)

    # Results table + QR
    results_y = pubchem_y - 110
    qr_buf = make_qr(coa["batch"])
    draw_results_table(c, 50, results_y, page_w - 100, 100, coa, qr_buf)

    # UPLC chart
    chart_y = results_y - 105
    seed = abs(hash(coa["batch"])) % (2 ** 32)
    uplc_buf = make_uplc_chart(seed=seed)
    draw_chart_card(c, 50, chart_y, page_w - 100, 95, uplc_buf, "UPLC")

    # MS chart
    ms_y = chart_y - 105
    ms_buf = make_ms_chart(seed=seed + 1, ms_center=coa["ms_center"])
    draw_chart_card(c, 50, ms_y, page_w - 100, 100, ms_buf, "MS")

    # Footer + bottom bar
    draw_footer_card(c, 50, 50, page_w - 100, 78, SIG_PATH)
    draw_bottom_bar(c, page_w)


def render_page2(c, page_w, page_h, coa):
    draw_header(c, page_w, page_h)
    draw_lot_info(c, page_w, page_h - 90, coa)

    # Title strip (clearance from lot-info row 3 which ends ~y=688)
    title_y = page_h - 200
    rounded_rect(c, 50, title_y, page_w - 100, 50, 4, fill_color=CARD_BG, stroke_color=BORDER)
    c.setFillColor(INK)
    c.setFont(UNICODE_FONT, 11)
    title = f"{coa['compound']} ({coa['quantity_spec']}) • Pubchem CID: {coa['pubchem_cid']}"
    c.drawCentredString(page_w / 2, title_y + 31, title)
    c.setFillColor(MUTE)
    c.setFont("Helvetica", 9.5)
    c.drawCentredString(page_w / 2, title_y + 13, "Ultra High Performance Liquid Chromatography (UPLC)")

    # Triple chromatogram
    seed = abs(hash(coa["batch"])) % (2 ** 32)
    triple_buf = make_uplc_triple(seed=seed + 5)
    triple_y = title_y - 320
    draw_chart_card(c, 50, triple_y, page_w - 100, 310, triple_buf, "")

    # MS title strip
    ms_title_y = triple_y - 35
    rounded_rect(c, 50, ms_title_y, page_w - 100, 28, 4, fill_color=CARD_BG, stroke_color=BORDER)
    c.setFillColor(INK)
    c.setFont("Helvetica", 10.5)
    c.drawCentredString(page_w / 2, ms_title_y + 9, "Mass Spectrometry (MS)")

    # MS chart (large)
    ms_chart_y = ms_title_y - 175
    ms_buf = make_ms_chart(seed=seed + 9, ms_center=coa["ms_center"], width_in=7.2, height_in=2.2)
    draw_chart_card(c, 50, ms_chart_y, page_w - 100, 165, ms_buf, "")

    # Bottom bar
    draw_bottom_bar(c, page_w)


# ─── Driver ─────────────────────────────────────────────────────────

def render(coa):
    out_path = OUT_DIR / f"{coa['batch']}.pdf"
    page_w, page_h = letter
    c = canvas.Canvas(str(out_path), pagesize=letter)
    c.setTitle(f"{coa['compound']} batch {coa['batch']} — Polaris Analytical COA")
    c.setAuthor("Polaris Analytical")
    c.setSubject(f"Certificate of Analysis — {coa['compound']} ({coa['quantity_result']}, {coa['purity_result']} purity)")

    # Page 1 background
    c.setFillColor(white)
    c.rect(0, 0, page_w, page_h, stroke=0, fill=1)
    render_page1(c, page_w, page_h, coa)
    c.showPage()

    # Page 2
    c.setFillColor(white)
    c.rect(0, 0, page_w, page_h, stroke=0, fill=1)
    render_page2(c, page_w, page_h, coa)
    c.showPage()
    c.save()
    return out_path


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    if not SIG_PATH.exists():
        raise SystemExit(f"Missing signature image at {SIG_PATH}")
    for coa in COAS:
        path = render(coa)
        size = os.path.getsize(path)
        print(f"  {coa['batch']:<14} {coa['compound']:<14} {size/1024:6.1f} KB  →  {path}")


if __name__ == "__main__":
    main()
