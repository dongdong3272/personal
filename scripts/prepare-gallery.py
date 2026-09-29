#!/usr/bin/env python3
"""Prepare gallery photos for the site.

Originals belong in gallery-source/ and are not deployed.
Loose JPEGs dropped directly in public/gallery/ are moved there first.

Outputs:
  public/gallery/wall/<n>.jpg   long edge about 1600px (the wall)
  public/gallery/view/<n>.jpg   long edge about 3200px (the lightbox)
  src/data/gallery.json         file name plus width and height, no titles

From the repo root:

  python scripts/prepare-gallery.py
  npm run gallery:prepare
"""

from __future__ import annotations

import json
import re
import shutil
import sys
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "gallery-source"
PUBLIC = ROOT / "public" / "gallery"
WALL = PUBLIC / "wall"
VIEW = PUBLIC / "view"
MANIFEST = ROOT / "src" / "data" / "gallery.json"

WALL_EDGE = 1600
VIEW_EDGE = 3200
WALL_QUALITY = 82
VIEW_QUALITY = 85

SUFFIXES = {".jpg", ".jpeg", ".png", ".webp"}


def sort_key(path: Path) -> tuple[int, int, str]:
    match = re.search(r"(\d+)", path.stem)
    if match:
        return (0, int(match.group(1)), path.name.lower())
    return (1, 0, path.name.lower())


def output_name(path: Path, used: set[str]) -> str:
    match = re.search(r"(\d+)", path.stem)
    if match:
        base = match.group(1)
    else:
        base = re.sub(r"[^A-Za-z0-9_-]+", "-", path.stem).strip("-") or "photo"
    name = f"{base}.jpg"
    index = 2
    while name in used:
        name = f"{base}-{index}.jpg"
        index += 1
    used.add(name)
    return name


def move_loose_originals() -> None:
    if not PUBLIC.is_dir():
        return
    SOURCE.mkdir(parents=True, exist_ok=True)
    for path in sorted(PUBLIC.iterdir(), key=sort_key):
        if not path.is_file() or path.suffix.lower() not in SUFFIXES:
            continue
        dest = SOURCE / path.name
        if dest.exists():
            stem, suffix = path.stem, path.suffix
            index = 2
            while dest.exists():
                dest = SOURCE / f"{stem}-{index}{suffix}"
                index += 1
        shutil.move(str(path), str(dest))
        print(f"moved {path.name} -> {dest.relative_to(ROOT)}")


def fit_long_edge(image: Image.Image, edge: int) -> Image.Image:
    width, height = image.size
    long_edge = max(width, height)
    if long_edge <= edge:
        return image
    scale = edge / long_edge
    size = (max(1, round(width * scale)), max(1, round(height * scale)))
    return image.resize(size, Image.Resampling.LANCZOS)


def save_jpeg(image: Image.Image, dest: Path, quality: int) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    image.convert("RGB").save(
        dest,
        format="JPEG",
        quality=quality,
        optimize=True,
        progressive=True,
    )


def clear_outputs() -> None:
    for folder in (WALL, VIEW):
        folder.mkdir(parents=True, exist_ok=True)
        for old in folder.iterdir():
            if old.is_file() and old.suffix.lower() in SUFFIXES:
                old.unlink()


def main() -> None:
    move_loose_originals()
    if not SOURCE.is_dir():
        sys.exit("No gallery-source/ directory. Put originals there and run again.")

    sources = sorted(
        (
            path
            for path in SOURCE.iterdir()
            if path.is_file() and path.suffix.lower() in SUFFIXES
        ),
        key=sort_key,
    )
    if not sources:
        sys.exit("No photos in gallery-source/.")

    clear_outputs()
    used: set[str] = set()
    manifest: list[dict[str, int | str]] = []

    for path in sources:
        name = output_name(path, used)
        with Image.open(path) as raw:
            image = ImageOps.exif_transpose(raw)
            if image is None:
                image = raw
            width, height = image.size
            save_jpeg(fit_long_edge(image, VIEW_EDGE), VIEW / name, VIEW_QUALITY)
            save_jpeg(fit_long_edge(image, WALL_EDGE), WALL / name, WALL_QUALITY)
        manifest.append({"file": name, "width": width, "height": height})
        print(f"{path.name} -> {name} ({width}x{height})")

    MANIFEST.parent.mkdir(parents=True, exist_ok=True)
    MANIFEST.write_text(
        json.dumps(manifest, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    print(f"Wrote {len(manifest)} photos to {MANIFEST.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
