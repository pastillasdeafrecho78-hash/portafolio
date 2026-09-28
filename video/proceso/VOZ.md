# Voz ElevenLabs — /proceso

**Estado:** Richard confirmado; los nueve guiones del handoff usan velocidad 0.85 y pausas breves añadidas en edición. La voz y el timing de `sitio` conservan su configuración original.

## Voz definitiva

| Campo | Valor |
|-------|--------|
| **Nombre** | Richard - Social Media |
| **Voice ID** | `Cpm6N9BNC1M75bYS7kO1` |
| **Modelo** | `eleven_multilingual_v2` |
| **Speed** | `0.85` (excepto `sitio`, que se conserva) |
| **Stability** | `0.46` (46%) |
| **Similarity** | `0.78` (78%) |
| **Style** | `0.36` (36%) |
| **Speaker boost** | on |

## Regla

Copiar estos knobs y los textos literales de `HANDOFF-CODEX-VO-RITMO.md`. Después de sintetizar, completar las pausas entre oraciones hasta 200 ms cuando el take no deja ese espacio. No estirar la voz con `atempo`. Los JSON junto a cada MP3 contienen la alineación por palabra corregida después de esas inserciones, la duración medida por ffprobe y los anclajes de escena. `build-clips.py` obtiene de ahí el timing de móvil y PC.

## Descartado

- Kate `EYBbN7OENxAX5QX56IiW` — plana / sin vida para este uso.
