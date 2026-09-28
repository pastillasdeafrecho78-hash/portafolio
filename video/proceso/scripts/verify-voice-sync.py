#!/usr/bin/env python3
"""Check delivered audio, scene anchors, duration and mobile/PC parity."""
import argparse
from array import array
import hashlib
import json
import math
from pathlib import Path
import re
import subprocess

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT.parents[1] / "public/video/proceso"
IDS = ("panel", "mvp", "whatsapp", "webchat", "inbox", "rostro", "patron", "lista", "otro")


def probe(path):
    return json.loads(subprocess.check_output(["ffprobe", "-v", "error", "-show_streams", "-show_format", "-of", "json", str(path)]))


def samples(path):
    result = array("h")
    result.frombytes(subprocess.check_output(["ffmpeg", "-v", "error", "-i", str(path), "-vn", "-ac", "1", "-ar", "2000", "-f", "s16le", "-"]))
    return result[::4]  # 500 Hz; lag resolution is 2 ms.


def correlate(reference, actual, begin, count, max_lag=40):
    ref = reference[begin:begin+count]
    energy = sum(v*v for v in ref)
    best = (-1, None)
    for lag in range(-max_lag, max_lag+1):
        start = begin + lag
        if start < 0:
            continue
        candidate = actual[start:start+count]
        if len(candidate) != len(ref):
            continue
        denominator = math.sqrt(energy * sum(v*v for v in candidate))
        score = sum(a*b for a, b in zip(ref, candidate)) / denominator if denominator else 0
        if score > best[0]:
            best = (score, lag / 500)
    return {"correlation": round(best[0], 5), "offset_seconds": best[1]}


def verify(clip_id):
    metadata = json.loads((ROOT / clip_id / "audio" / f"{clip_id}-vo.json").read_text())
    voice = ROOT / clip_id / "audio" / f"{clip_id}-vo.mp3"
    assert hashlib.sha256(voice.read_bytes()).hexdigest() == metadata["audio_sha256"], f"{clip_id}: stale word alignment"
    reference = samples(voice)
    result = {"id": clip_id, "voice_duration": metadata["duration"], "scenes": metadata["scenes"], "variants": []}
    for suffix in ("", "-pc"):
        name = clip_id + suffix
        copy = ROOT / name / "audio" / f"{clip_id}-vo.mp3"
        assert copy.read_bytes() == voice.read_bytes(), f"{name}: different take"
        video = PUBLIC / f"{name}.mp4"
        info = probe(video)
        video_stream = next(s for s in info["streams"] if s["codec_type"] == "video")
        audio_stream = next(s for s in info["streams"] if s["codec_type"] == "audio")
        expected = json.loads((ROOT / name / "meta.json").read_text())
        assert (video_stream["width"], video_stream["height"]) == (expected["width"], expected["height"]), name
        assert video_stream["r_frame_rate"] == "30/1", name
        assert abs(float(info["format"]["duration"]) - expected["duration"]) < .04, f"{name}: stale render duration"
        assert float(audio_stream["duration"]) >= metadata["duration"] - .07, f"{name}: voice clipped"
        actual = samples(video)
        first = correlate(reference, actual, 500, 2000)
        last = correlate(reference, actual, max(0, len(reference)-2000), 1800)
        for measurement in (first, last):
            assert measurement["correlation"] > .97, f"{name}: rendered audio differs: {measurement}"
            assert abs(measurement["offset_seconds"]) <= .02, f"{name}: desynchronized audio: {measurement}"
        html = (ROOT / name / "index.html").read_text()
        for i, scene in enumerate(metadata["scenes"], 1):
            pattern = rf'tl\.fromTo\("\.scene-{i}",.*?\}}, ([\d.]+)\);'
            transition = float(re.search(pattern, html).group(1))
            assert abs(transition - (scene["speech_start"]-.2)) < .0011, f"{name}: wrong scene {i}"
        peak = max(abs(v) for v in actual)
        assert peak < 32767, f"{name}: clipped audio samples"
        result["variants"].append({"name": name, "duration": float(info["format"]["duration"]), "start": first, "end": last, "peak_dbfs": round(20*math.log10(peak/32768), 2)})
        print(f"{name}: PASS; start {first['offset_seconds']:+.3f}s, end {last['offset_seconds']:+.3f}s; correlation {first['correlation']:.4f}/{last['correlation']:.4f}", flush=True)
    return result


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("ids", nargs="*", choices=IDS)
    parser.add_argument("--report", type=Path)
    args = parser.parse_args()
    results = [verify(clip_id) for clip_id in args.ids or IDS]
    if args.report:
        args.report.write_text(json.dumps(results, ensure_ascii=False, indent=2)+"\n")
