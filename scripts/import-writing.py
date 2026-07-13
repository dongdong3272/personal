#!/usr/bin/env python3
"""
Import a Word (.docx) essay into src/data/writings/ as Markdown.

Preferred filename (same as site convention):
  Title@YYYY-MM-DD@Tag1,Tag2.docx

Examples (PowerShell, from repo root):

  python scripts/import-writing.py "e:\\随笔\\我的父母-杂笔@2025-11-18@Essay,Personal.docx"

  # Also copy a sibling / explicit PDF for the optional download link:
  python scripts/import-writing.py ".\\draft.docx" --pdf ".\\draft.pdf"

  npm run writings:import -- "e:\\随笔\\某篇@2026-01-01@Essay,Personal.docx"
"""

from __future__ import annotations

import argparse
import re
import shutil
import sys
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET

W_NS = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
NS = {"w": W_NS}


def q(tag: str) -> str:
    return f"{{{W_NS}}}{tag}"


def paragraph_text(p: ET.Element) -> str:
    parts: list[str] = []
    for node in p.iter(q("t")):
        if node.text:
            parts.append(node.text)
        if node.tail:
            parts.append(node.tail)
    return "".join(parts).strip()


def paragraph_meta(p: ET.Element) -> tuple[str, bool, int | None]:
    """Return (style, is_list, ilvl)."""
    style = ""
    is_list = False
    ilvl: int | None = None
    p_pr = p.find("w:pPr", NS)
    if p_pr is None:
        return style, is_list, ilvl

    ps = p_pr.find("w:pStyle", NS)
    if ps is not None:
        style = ps.get(q("val")) or ""

    num_pr = p_pr.find("w:numPr", NS)
    if num_pr is not None:
        is_list = True
        ilvl_el = num_pr.find("w:ilvl", NS)
        if ilvl_el is not None:
            raw = ilvl_el.get(q("val"))
            ilvl = int(raw) if raw is not None and raw.isdigit() else 0
        else:
            ilvl = 0

    return style, is_list, ilvl


def is_heading_style(style: str) -> int | None:
    """Map Word heading styles to markdown heading level."""
    if not style:
        return None
    m = re.match(r"^(?:Heading|标题)\s*(\d+)$", style, re.I)
    if m:
        return min(int(m.group(1)), 3)
    if style.lower() in {"title", "标题"}:
        return 1
    return None


def looks_like_section_heading(text: str) -> bool:
    """Chinese essay section titles that were plain paragraphs in Word."""
    if len(text) > 40:
        return False
    return bool(
        re.match(
            r"^(?:[一二三四五六七八九十百]+、|结语[:：]|序言|前言|后记)",
            text,
        )
    )


def docx_to_markdown_body(docx_path: Path) -> str:
    with zipfile.ZipFile(docx_path) as zf:
        xml = zf.read("word/document.xml")
    root = ET.fromstring(xml)

    lines: list[str] = []
    prev_blank = True

    for p in root.iter(q("p")):
        text = paragraph_text(p)
        style, is_list, ilvl = paragraph_meta(p)

        if not text:
            if not prev_blank and lines:
                lines.append("")
                prev_blank = True
            continue

        heading_level = is_heading_style(style)
        if heading_level is None and looks_like_section_heading(text):
            heading_level = 2

        if heading_level is not None:
            if lines and lines[-1] != "":
                lines.append("")
            lines.append(f"{'#' * heading_level} {text}")
            lines.append("")
            prev_blank = True
            continue

        if is_list:
            level = ilvl or 0
            indent = "  " * level
            # Top-level Word lists → ordered; nested → bullets (matches review essays)
            marker = "1." if level == 0 else "-"
            lines.append(f"{indent}{marker} {text}")
            prev_blank = False
            continue

        if lines and not prev_blank and lines[-1].startswith(("1. ", "- ", "  ")):
            lines.append("")
        lines.append(text)
        lines.append("")
        prev_blank = True

    body = "\n".join(lines).strip() + "\n"
    # Collapse 3+ blank lines
    body = re.sub(r"\n{3,}", "\n\n", body)
    return body


def parse_name_meta(stem: str) -> tuple[str, str, list[str]]:
    parts = stem.split("@")
    if len(parts) < 2:
        return stem, "", []
    title = parts[0].strip()
    date = parts[1].strip()
    tags: list[str] = []
    if len(parts) >= 3 and parts[2].strip():
        tags = [t.strip() for t in parts[2].split(",") if t.strip()]
    return title, date, tags


def build_frontmatter(title: str, date: str, tags: list[str]) -> str:
    tag_lines = "\n".join(f"  - {t}" for t in tags) if tags else "  - Essay"
    date_line = date if date else "1970-01-01"
    return f"---\ntitle: {title}\ndate: {date_line}\ntags:\n{tag_lines}\n---\n\n"


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Convert a Word essay (.docx) into site Markdown under src/data/writings/"
    )
    parser.add_argument("docx", type=Path, help="Path to the .docx file")
    parser.add_argument(
        "--pdf",
        type=Path,
        default=None,
        help="Optional PDF to copy alongside (default: same stem next to the docx)",
    )
    parser.add_argument(
        "--title",
        default=None,
        help="Override title (default: from Title@date@tags.docx)",
    )
    parser.add_argument("--date", default=None, help="Override date YYYY-MM-DD")
    parser.add_argument(
        "--tags",
        default=None,
        help='Override tags, comma-separated, e.g. "Essay,Personal"',
    )
    parser.add_argument(
        "--out-dir",
        type=Path,
        default=None,
        help="Output directory (default: src/data/writings)",
    )
    args = parser.parse_args()

    docx_path: Path = args.docx.expanduser().resolve()
    if not docx_path.is_file():
        print(f"ERROR: docx not found: {docx_path}", file=sys.stderr)
        return 1
    if docx_path.suffix.lower() != ".docx":
        print("ERROR: input must be a .docx file", file=sys.stderr)
        return 1

    repo_root = Path(__file__).resolve().parent.parent
    out_dir = (args.out_dir or (repo_root / "src" / "data" / "writings")).resolve()
    out_dir.mkdir(parents=True, exist_ok=True)

    stem = docx_path.stem
    title, date, tags = parse_name_meta(stem)
    if args.title:
        title = args.title
    if args.date:
        date = args.date
    if args.tags is not None:
        tags = [t.strip() for t in args.tags.split(",") if t.strip()]

    if not date:
        print(
            "WARNING: filename has no @YYYY-MM-DD@ — use Title@YYYY-MM-DD@Tags.docx "
            "or pass --date",
            file=sys.stderr,
        )

    body = docx_to_markdown_body(docx_path)
    # Drop a leading title line that duplicates the H1/frontmatter title
    body_lines = body.splitlines()
    if body_lines and body_lines[0].strip() in {title, f"# {title}", f"## {title}"}:
        body = "\n".join(body_lines[1:]).lstrip() + ("\n" if body.endswith("\n") else "")

    md_name = f"{stem}.md"
    # If user overrode title/date/tags but kept odd stem, still write using stem
    # so PDF sibling matching by basename keeps working.
    md_path = out_dir / md_name
    md_path.write_text(build_frontmatter(title, date, tags) + body, encoding="utf-8")
    print(f"Wrote {md_path}")

    pdf_src = args.pdf.expanduser().resolve() if args.pdf else docx_path.with_suffix(".pdf")
    if pdf_src.is_file():
        pdf_dest = out_dir / f"{stem}.pdf"
        shutil.copy2(pdf_src, pdf_dest)
        print(f"Copied PDF → {pdf_dest}")
    else:
        print(
            "Note: no PDF found (optional). Site will still show the article; "
            "Download PDF link appears only if a matching .pdf exists."
        )

    print("Done. Run `npm run dev` and open /personal/writings to check.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
