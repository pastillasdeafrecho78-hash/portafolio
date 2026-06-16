#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
source ~/.config/servimos/elevenlabs.env

API="https://api.elevenlabs.io/v1/text-to-speech"
MODEL="eleven_multilingual_v2"
V_ES="Cpm6N9BNC1M75bYS7kO1"
V_EN="TxGEqnHWrfWFTfGW9XjX"

gen() {
  local file="$1" voice="$2" text="$3"
  echo "→ $file"
  python3 - "$voice" "$text" "audio/${file}" << 'PY'
import json, os, sys, urllib.request
voice, text, out = sys.argv[1], sys.argv[2], sys.argv[3]
key = os.environ["ELEVENLABS_API_KEY"]
body = json.dumps({
    "text": text,
    "model_id": "eleven_multilingual_v2",
    "voice_settings": {
        "stability": 0.48,
        "similarity_boost": 0.76,
        "style": 0.32,
        "use_speaker_boost": True,
    },
}).encode()
req = urllib.request.Request(
    f"https://api.elevenlabs.io/v1/text-to-speech/{voice}",
    data=body,
    headers={"xi-api-key": key, "Content-Type": "application/json", "Accept": "audio/mpeg"},
    method="POST",
)
with urllib.request.urlopen(req) as res, open(out, "wb") as f:
    f.write(res.read())
PY
}

gen "01-es-intro.mp3" "$V_ES" "Hola, soy Salvador Barba García. Ayudo a convertir contenido audiovisual en versiones localizadas, naturales y listas para publicar."
gen "02-en.mp3" "$V_EN" "I work with AI-assisted workflows for transcription, subtitling, translation, synchronization and voice localization."
gen "03-ca.mp3" "$V_ES" "Puc adaptar contingut audiovisual al català amb subtítols, veu i sincronització."
gen "04-fr.mp3" "$V_ES" "Je peux adapter des vidéos en français avec une voix naturelle, des sous-titres précis et une synchronisation claire."
gen "05-it.mp3" "$V_ES" "Posso localizzare contenuti audiovisivi in italiano, mantenendo ritmo, intenzione e naturalezza."
gen "06-es-cierre.mp3" "$V_ES" "Puedo preparar una muestra gratuita de hasta 30 segundos para demostrar el flujo completo de localización audiovisual."

printf "%s\n" "file '01-es-intro.mp3'" "file '02-en.mp3'" "file '03-ca.mp3'" "file '04-fr.mp3'" "file '05-it.mp3'" "file '06-es-cierre.mp3'" > audio/concat-list.txt
ffmpeg -y -f concat -safe 0 -i audio/concat-list.txt -c copy audio/vo-full.mp3
ffmpeg -y -i audio/vo-full.mp3 -ar 44100 -ac 1 audio/vo-full.wav
ffprobe -v error -show_entries format=duration -of csv=p=0 audio/vo-full.wav
