#!/usr/bin/env python3
"""Extract a settled first-scene frame for every public /proceso video."""
from pathlib import Path
import subprocess

ROOT = Path(__file__).resolve().parents[3]
PUBLIC = ROOT / "public" / "video" / "proceso"
IDS = ("sitio", "panel", "mvp", "whatsapp", "webchat", "inbox", "rostro", "patron", "lista", "otro")

for clip_id in IDS:
    for suffix in ("", "-pc"):
        name = f"{clip_id}{suffix}"
        source = PUBLIC / f"{name}.mp4"
        target = PUBLIC / f"{name}-poster.webp"
        if not source.is_file():
            raise SystemExit(f"Missing video: {source}")
        subprocess.run(
            ["ffmpeg", "-hide_banner", "-loglevel", "error", "-ss", "7", "-i", str(source),
             "-frames:v", "1", "-q:v", "75", "-y", str(target)],
            check=True,
        )
        print(target.relative_to(ROOT))
