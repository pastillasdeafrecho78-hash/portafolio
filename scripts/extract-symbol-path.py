#!/usr/bin/env python3
"""Build the DrawSVG *mask* path for symbol.png.

The visible mark is always public/brand/symbol.png (brand file).
This script only produces a centerline used inside an SVG <mask> so
GSAP DrawSVG can reveal the real asset — never a redrawn stroke.
"""

from __future__ import annotations

import math
from collections import deque
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "public" / "brand" / "symbol.png"
OUT_SVG = ROOT / "public" / "brand" / "symbol-path.svg"
OUT_TS = ROOT / "src" / "lib" / "symbolPath.ts"

SAMPLE_RAYS = 1440
SMOOTH_PASSES = 60
TARGET_NODES = 16
STROKE_PAD = 1.28  # cover antialiased ring edges


def is_ink(px, x: int, y: int, w: int, h: int) -> bool:
    if not (0 <= x < w and 0 <= y < h):
        return False
    r, g, b, a = px[x, y]
    return a > 28 and r > 120 and g > 70 and (r - b) > 30


def hole_center(ink: list[list[bool]], w: int, h: int) -> tuple[float, float]:
    border = [[False] * w for _ in range(h)]
    q: deque[tuple[int, int]] = deque()
    for x in range(w):
        for y in (0, h - 1):
            if not ink[y][x]:
                border[y][x] = True
                q.append((x, y))
    for y in range(h):
        for x in (0, w - 1):
            if not ink[y][x] and not border[y][x]:
                border[y][x] = True
                q.append((x, y))
    while q:
        x, y = q.popleft()
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < w and 0 <= ny < h and not border[ny][nx] and not ink[ny][nx]:
                border[ny][nx] = True
                q.append((nx, ny))
    hole = [
        (x, y)
        for y in range(h)
        for x in range(w)
        if not ink[y][x] and not border[y][x]
    ]
    if not hole:
        raise SystemExit("Could not find interior hole in symbol.png")
    return sum(p[0] for p in hole) / len(hole), sum(p[1] for p in hole) / len(hole)


def centerline(
    ink: list[list[bool]], w: int, h: int, hx: float, hy: float
) -> tuple[list[tuple[float, float]], float]:
    mids: list[tuple[float, float]] = []
    ths: list[float] = []
    max_r = math.hypot(w, h)
    for i in range(SAMPLE_RAYS):
        ang = (2 * math.pi * i) / SAMPLE_RAYS
        ca, sa = math.cos(ang), math.sin(ang)
        hits: list[float] = []
        prev = False
        r = 0.0
        while r <= max_r:
            x = int(round(hx + ca * r))
            y = int(round(hy + sa * r))
            inside = 0 <= x < w and 0 <= y < h and ink[y][x]
            if inside != prev:
                hits.append(r)
                prev = inside
            r += 0.2
        if len(hits) < 2:
            continue
        inner, outer = hits[0], hits[1]
        mid = (inner + outer) / 2
        mids.append((hx + ca * mid, hy + sa * mid))
        ths.append(outer - inner)
    if len(mids) < TARGET_NODES:
        raise SystemExit(f"Too few centerline samples: {len(mids)}")
    return mids, sum(ths) / len(ths)


def smooth(pts: list[tuple[float, float]], passes: int) -> list[tuple[float, float]]:
    out = list(pts)
    n = len(out)
    for _ in range(passes):
        nxt: list[tuple[float, float]] = []
        for i in range(n):
            a = out[(i - 2) % n]
            b = out[(i - 1) % n]
            c = out[i]
            d = out[(i + 1) % n]
            e = out[(i + 2) % n]
            nxt.append(
                (
                    (a[0] + 4 * b[0] + 6 * c[0] + 4 * d[0] + e[0]) / 16,
                    (a[1] + 4 * b[1] + 6 * c[1] + 4 * d[1] + e[1]) / 16,
                )
            )
        out = nxt
    return out


def arclen_decimate(pts: list[tuple[float, float]], k: int) -> list[tuple[float, float]]:
    n = len(pts)
    lens = [0.0]
    for i in range(1, n + 1):
        a = pts[i - 1]
        b = pts[i % n]
        lens.append(lens[-1] + math.hypot(b[0] - a[0], b[1] - a[1]))
    total = lens[-1]
    out: list[tuple[float, float]] = []
    j = 0
    for i in range(k):
        target = i * total / k
        while j < len(lens) - 1 and lens[j + 1] < target:
            j += 1
        t0 = lens[j]
        t1 = lens[j + 1] if j + 1 < len(lens) else total
        a = pts[j % n]
        b = pts[(j + 1) % n]
        t = (target - t0) / max(t1 - t0, 1e-9)
        out.append((a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t))
    return out


def path_d(pts: list[tuple[float, float]], tension: float = 0.2) -> str:
    n = len(pts)
    start = pts[0]
    parts = [f"M{start[0]:.2f} {start[1]:.2f}"]
    for i in range(n):
        p0 = pts[(i - 1) % n]
        p1 = pts[i]
        p2 = pts[(i + 1) % n]
        p3 = pts[(i + 2) % n]
        c1 = (p1[0] + (p2[0] - p0[0]) * tension, p1[1] + (p2[1] - p0[1]) * tension)
        c2 = (p2[0] - (p3[0] - p1[0]) * tension, p2[1] - (p3[1] - p1[1]) * tension)
        parts.append(
            f"C{c1[0]:.2f} {c1[1]:.2f} {c2[0]:.2f} {c2[1]:.2f} {p2[0]:.2f} {p2[1]:.2f}"
        )
    parts.append("Z")
    return " ".join(parts)


def main() -> None:
    im = Image.open(SRC).convert("RGBA")
    w, h = im.size
    px = im.load()
    assert px is not None
    ink = [[is_ink(px, x, y, w, h) for x in range(w)] for y in range(h)]
    hx, hy = hole_center(ink, w, h)
    print(f"Image {w}x{h}, hole center ({hx:.1f}, {hy:.1f})")
    mids, avg_th = centerline(ink, w, h, hx, hy)
    mids = smooth(mids, SMOOTH_PASSES)
    nodes = arclen_decimate(mids, TARGET_NODES)
    d = path_d(nodes)
    stroke = avg_th * STROKE_PAD

    OUT_SVG.write_text(
        f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" fill="none">
  <path id="think-deep-symbol" d="{d}" stroke="#F0C94A" stroke-width="{stroke:.2f}" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
'''
    )
    OUT_TS.write_text(
        f'''/** Draw-mask path in native symbol.png coords ({w}×{h}). */
export const SYMBOL_PATH_D =
  "{d}";

export const SYMBOL_VIEWBOX = "0 0 {w} {h}";
export const SYMBOL_WIDTH = {w};
export const SYMBOL_HEIGHT = {h};
/** Stroke width for the reveal mask — covers the real ring ink. */
export const SYMBOL_STROKE_WIDTH = {stroke:.2f};
'''
    )
    print(f"Wrote {OUT_SVG}")
    print(f"Wrote {OUT_TS}")
    print(f"nodes={TARGET_NODES} stroke={stroke:.2f}")


if __name__ == "__main__":
    main()
