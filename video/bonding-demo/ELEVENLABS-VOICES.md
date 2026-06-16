# ElevenLabs — voces y configuración por idioma

**Modelo recomendado (todos los idiomas):** `eleven_multilingual_v2`  
**Evitar:** `eleven_monolingual_v1` (no cubre catalán/italiano con naturalidad).

## Settings base (todas las voces)

```json
{
  "model_id": "eleven_multilingual_v2",
  "voice_settings": {
    "stability": 0.48,
    "similarity_boost": 0.76,
    "style": 0.32,
    "use_speaker_boost": true,
    "speed": 0.97
  }
}
```

Ajustar `speed` 0.94–1.0 para encajar ventanas de timeline.

---

## Por escena / idioma

| Escena | Idioma | Voz ElevenLabs sugerida | Voice ID (buscar en librería) | Notas |
|--------|--------|-------------------------|-------------------------------|-------|
| 1 + 6 | Español | **Richard - Social Media** | `Cpm6N9BNC1M75bYS7kO1` | Ya usada en portafolio. Cercana, profesional, no vendedor. |
| 2 | Inglés | **Josh** o **Chris** | `TxGEqnHWrfWFTfGW9XjX` (Josh) | Inglés neutro internacional, buen ritmo técnico. |
| 3 | Catalán | **Matías** o **Serena** (multilingual) | Probar `pNInz6obpgDQGcFmaJgB` (Adam) con texto CA | Catalán: validar pronunciación; regenerar si suena castellanizado. Alternativa: **Brian** multilingual. |
| 4 | Francés | **Antoine** o **Charlotte** | Buscar «Antoine» en Voice Library | Tono editorial, claro, no teatral. |
| 5 | Italiano | **Giovanni** o **Matilda** | Buscar «Giovanni» en Voice Library | Cálido, expresivo, ritmo natural. |

### Si una voz no suena nativa en catalán
1. Probar **eleven_multilingual_v2** con voz «European» de la libría.
2. Dividir frase en dos takes más cortos.
3. Post-proceso: normalizar loudness entre clips (`ffmpeg loudnorm`).

---

## Archivos de audio esperados

```
audio/
├── 01-es-intro.wav      # escena 1
├── 02-en.wav
├── 03-ca.wav
├── 04-fr.wav
├── 05-it.wav
├── 06-es-cierre.wav     # escena 6
└── vo-full.wav          # concat final
```

### Concat con ffmpeg

```bash
cd video/bonding-demo
cat > audio/concat-list.txt << 'EOF'
file '01-es-intro.wav'
file '02-en.wav'
file '03-ca.wav'
file '04-fr.wav'
file '05-it.wav'
file '06-es-cierre.wav'
EOF
ffmpeg -f concat -safe 0 -i audio/concat-list.txt -c copy audio/vo-full.wav
```

---

## Textos exactos para pegar en ElevenLabs

Ver `audio/vo-scripts.md` — un bloque por idioma, sin títulos ni comillas.

---

## MCP / API (proyecto existente)

```json
{
  "api_key_env": "~/.config/servimos/elevenlabs.env",
  "mcp_command": "/home/SalvadorTD/.local/bin/elevenlabs-mcp-codex"
}
```

Generar cada clip por separado para controlar duración por escena.
