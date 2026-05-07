"""
Generate a Polaris favicon (PNG) from the same compass-rose geometry used in
the SVG component. Outputs:
  public/polaris-icon.png        (192x192 — favicon)
  public/polaris-apple-icon.png  (180x180 — apple touch icon)

Re-run if branding changes:
    python3 scripts/generate_polaris_favicon.py
"""
from pathlib import Path
from PIL import Image, ImageDraw

OUT = Path(__file__).resolve().parent.parent / "public"

NAVY = (10, 77, 111, 255)
NAVY_FAINT = (10, 77, 111, 47)
TEAL = (86, 178, 177, 255)
WHITE = (255, 255, 255, 255)
BG = (255, 255, 255, 255)


def render(size: int, out_path: Path):
    img = Image.new("RGBA", (size, size), BG)
    d = ImageDraw.Draw(img, "RGBA")
    s = size / 64.0  # geometry was designed in 64-unit viewBox

    def p(x, y):
        return (x * s, y * s)

    def poly(pts, fill):
        d.polygon([p(*pt) for pt in pts], fill=fill)

    # Outer ring
    border = int(2.4 * s)
    d.ellipse([p(3, 3), p(61, 61)], outline=NAVY, width=border)
    # Inner faint ring
    d.ellipse([p(9, 9), p(55, 55)], outline=NAVY_FAINT, width=max(1, int(0.8 * s)))

    # Major cardinal star (N/S/E/W)
    poly(
        [(32, 7), (34.4, 30), (49, 32), (34.4, 34), (32, 57), (29.6, 34), (15, 32), (29.6, 30)],
        NAVY,
    )

    # Minor diagonal rays — semi-transparent navy
    for triangle in [
        [(46, 18), (33.5, 30.5), (31.5, 28.5)],
        [(46, 46), (33.5, 33.5), (31.5, 35.5)],
        [(18, 46), (30.5, 33.5), (32.5, 35.5)],
        [(18, 18), (30.5, 30.5), (32.5, 28.5)],
    ]:
        poly(triangle, (10, 77, 111, 140))

    # Teal true-north accent
    poly([(32, 7), (29.6, 13.5), (34.4, 13.5)], TEAL)

    # Center hub
    d.ellipse([p(28.8, 28.8), p(35.2, 35.2)], fill=WHITE)
    d.ellipse([p(30.5, 30.5), p(33.5, 33.5)], fill=NAVY)

    img.save(out_path)
    print(f"✓ {out_path.relative_to(out_path.parent.parent)}")


render(192, OUT / "polaris-icon.png")
render(180, OUT / "polaris-apple-icon.png")
render(32, OUT / "polaris-favicon-32.png")
