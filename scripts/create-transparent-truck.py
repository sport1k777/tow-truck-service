#!/usr/bin/env python3
"""Create a true RGBA tow-truck PNG with background removed."""

from __future__ import annotations

import io
import sys
from pathlib import Path

import numpy as np
from PIL import Image
from rembg import remove
from scipy.ndimage import binary_dilation, gaussian_filter


def strip_floor_plate(
    alpha: np.ndarray,
    rgb: np.ndarray,
    *,
    min_row_span: int = 240,
    row_start_ratio: float = 0.63,
    max_luminance: float = 50.0,
) -> np.ndarray:
    height, _width = alpha.shape
    lum = rgb.mean(axis=2)
    sat = rgb.max(axis=2) - rgb.min(axis=2)
    blue_glow = (rgb[:, :, 2] > rgb[:, :, 0] + 6) & (rgb[:, :, 2] > 55)
    amber = (rgb[:, :, 0] > 150) & (rgb[:, :, 1] > 70) & (rgb[:, :, 2] < 120)

    result = alpha.astype(np.float32).copy()
    row_start = int(height * row_start_ratio)

    for y in range(row_start, height):
        row = (result > 16) & (lum[y] < max_luminance) & (~blue_glow[y]) & (~amber[y])
        if not row.any():
            continue
        xs = np.where(row)[0]
        if xs.max() - xs.min() > min_row_span:
            result[y, row] = 0

    fringe = (result > 0) & (result < 245) & (sat < 22) & (lum > 198) & (~blue_glow)
    result[fringe] = 0

    subject = result > 40
    glow_zone = blue_glow & binary_dilation(subject, iterations=24)
    boost = np.clip((rgb[:, :, 2] - rgb[:, :, 0]) * 2.1, 0, 255)
    result[glow_zone] = np.maximum(result[glow_zone], boost[glow_zone] * 0.65)
    return np.clip(gaussian_filter(result, sigma=0.45), 0, 255).astype(np.uint8)


def process(input_path: Path, output_path: Path) -> None:
    cutout_bytes = remove(
        input_path.read_bytes(),
        alpha_matting=True,
        alpha_matting_foreground_threshold=240,
        alpha_matting_background_threshold=20,
        alpha_matting_erode_size=10,
    )
    cutout = Image.open(io.BytesIO(cutout_bytes)).convert('RGBA')
    rgba = np.array(cutout)
    rgba[:, :, 3] = strip_floor_plate(rgba[:, :, 3], rgba[:, :, :3].astype(np.float32))
    rgba[rgba[:, :, 3] == 0, :3] = 0

    output_path.parent.mkdir(parents=True, exist_ok=True)
    Image.fromarray(rgba).save(output_path, format='PNG', compress_level=1, optimize=False)

    alpha = rgba[:, :, 3]
    print(f'Wrote {output_path}')
    print(f'Size: {output_path.stat().st_size} bytes, {rgba.shape[1]}x{rgba.shape[0]} RGBA')
    print(f'Transparent: {(alpha < 8).sum()}  Semi: {((alpha >= 8) & (alpha <= 240)).sum()}')


def main() -> None:
    root = Path(__file__).resolve().parents[1]
    input_path = Path(sys.argv[1]) if len(sys.argv) > 1 else root / 'public/tow-truck.png'
    output_path = Path(sys.argv[2]) if len(sys.argv) > 2 else input_path
    process(input_path, output_path)


if __name__ == '__main__':
    main()
