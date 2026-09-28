#!/usr/bin/env python3
"""Generate approved ElevenLabs takes, add breathing room, and retain exact alignment.

Requires ELEVENLABS_API_KEY in the environment. Raw responses stay in an ignored
work directory so repeated edits never buy the same take twice.
"""
import argparse
import base64
import hashlib
import json
import os
from pathlib import Path
import re
import subprocess
import urllib.request
import wave

ROOT = Path(__file__).resolve().parents[1]
CONFIG = json.loads((ROOT / "scripts/vo-scripts.json").read_text())
ANCHORS = {
    "panel": ["Primero vemos", "Después dejamos", "Si lo usa", "Y si hay que sacar"],
    "mvp": ["Antes de llenarla", "Con eso armamos", "Una persona real", "Después ajustamos"],
    "whatsapp": ["Primero vemos", "Armamos un flujo", "Si se sale", "Empezamos con"],
    "webchat": ["Alguien pregunta", "Definimos juntos", "Si no hay respuesta", "Y cuidamos"],
    "inbox": ["Cuando todo", "Después dejamos", "Si hace falta criterio", "Empezamos con"],
    "rostro": ["Primero acordamos", "La cámara toma", "Si no, alguien", "Empezamos con un acceso"],
    "patron": ["Primero elegimos", "La cámara observa", "Cada aviso", "Probamos luz"],
    "lista": ["Primero definimos", "Llega la consulta", "Si el nombre", "Después podemos"],
    "otro": ["Primero aterrizamos", "Luego el momento", "Con eso dibujamos", "El siguiente paso"],
}


def run(args):
    return subprocess.check_output(args)


def generate(clip_id):
    text = CONFIG["scripts"][clip_id]
    payload = {"text": text, "model_id": CONFIG["model"], "voice_settings": CONFIG["settings"]}
    fingerprint = hashlib.sha256(json.dumps(payload, sort_keys=True).encode()).hexdigest()
    work = ROOT / ".voice-work" / clip_id
    work.mkdir(parents=True, exist_ok=True)
    cache = work / f"{fingerprint}.json"
    if cache.exists():
        response = json.loads(cache.read_text())
    else:
        request = urllib.request.Request(
            f"https://api.elevenlabs.io/v1/text-to-speech/{CONFIG['voice_id']}/with-timestamps?output_format=mp3_44100_128",
            data=json.dumps(payload).encode(),
            headers={"xi-api-key": os.environ["ELEVENLABS_API_KEY"], "Content-Type": "application/json"},
            method="POST",
        )
        with urllib.request.urlopen(request, timeout=180) as result:
            response = json.load(result)
        cache.write_text(json.dumps(response))
    raw = work / "raw.mp3"
    raw.write_bytes(base64.b64decode(response["audio_base64"]))
    alignment = response.get("alignment") or response["normalized_alignment"]
    chars = alignment["characters"]
    spoken = "".join(chars)
    if spoken != text:
        raise ValueError(f"{clip_id}: API alignment differs from literal approved script")
    starts = alignment["character_start_times_seconds"]
    ends = alignment["character_end_times_seconds"]
    pcm = run(["ffmpeg", "-v", "error", "-i", str(raw), "-f", "s16le", "-ac", "1", "-ar", "44100", "-"])
    insertions = []
    for match in re.finditer(r"[.;](?=\s+\S)", spoken):
        before = match.start() - 1
        while before >= 0 and not spoken[before].isalnum():
            before -= 1
        after = match.end()
        while after < len(spoken) and not spoken[after].isalnum():
            after += 1
        gap = max(0, starts[after] - ends[before])
        target = .20 if match.group() == "." else .14
        if gap < target:
            cut = (ends[before] + max(ends[before], starts[after])) / 2
            insertions.append((cut, target - gap))
    chunks = []
    previous = 0
    for cut, pause in insertions:
        sample = round(cut * 44100) * 2
        chunks += [pcm[previous:sample], bytes(round(pause * 44100) * 2)]
        previous = sample
    chunks.append(pcm[previous:])
    edited = work / "paced.wav"
    with wave.open(str(edited), "wb") as wav:
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(44100)
        wav.writeframes(b"".join(chunks))
    out = ROOT / clip_id / "audio" / f"{clip_id}-vo.mp3"
    out.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(["ffmpeg", "-v", "error", "-i", str(edited), "-c:a", "libmp3lame", "-b:a", "192k", "-y", str(out)], check=True)
    def shifted(time):
        return round(time + sum(pause for cut, pause in insertions if cut <= time), 5)
    aligned_starts = list(map(shifted, starts))
    aligned_ends = list(map(shifted, ends))
    words = [{"word": m.group(), "start": aligned_starts[m.start()], "end": aligned_ends[m.end()-1]} for m in re.finditer(r"\S+", spoken)]
    length = float(run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(out)]))
    blocks = [{"phrase": phrase, "speech_start": aligned_starts[spoken.index(phrase)]} for phrase in ANCHORS[clip_id]]
    end = aligned_starts[spoken.rindex("Think Deep")]
    metadata = {
        "text": text, "voice_id": CONFIG["voice_id"], "model": CONFIG["model"],
        "settings": CONFIG["settings"], "duration": length,
        "added_pause_seconds": round(sum(p for _, p in insertions), 5),
        "pauses": [{"source_time": round(c, 5), "added": round(p, 5)} for c, p in insertions],
        "words": words, "scenes": blocks, "end_speech_start": end,
        "audio_sha256": hashlib.sha256(out.read_bytes()).hexdigest(),
    }
    out.with_suffix(".json").write_text(json.dumps(metadata, ensure_ascii=False, indent=2)+"\n")
    print(f"{clip_id}: {length:.3f}s; added {metadata['added_pause_seconds']:.3f}s breathing room; scenes {[b['speech_start'] for b in blocks]}", flush=True)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("ids", nargs="*", choices=list(ANCHORS))
    args = parser.parse_args()
    for clip_id in args.ids or ANCHORS:
        generate(clip_id)
