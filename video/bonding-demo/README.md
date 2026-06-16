# Bonding Communication — Demo audiovisual

Pieza de presentación personal multilingüe (40 s) para propuesta freelance.

## Archivos clave

| Archivo | Contenido |
|---------|-----------|
| `GUION.md` | Guion final por escenas |
| `HYPERFRAMES-PROMPTS.md` | Prompts detallados por escena |
| `ELEVENLABS-VOICES.md` | Voces y settings ElevenLabs |
| `audio/vo-scripts.md` | Textos exactos para TTS |
| `PROPOSAL-MESSAGE.md` | Mensaje para Yesi |
| `subtitles/*.srt` | Subtítulos ES, EN, CA, FR, IT |
| `compositions/` | 6 escenas HyperFrames |
| `index.html` | Master 9:16 (1080×1920) |
| `PROMPT-LANDING.md` | Prompt reutilizable para la mini landing |
| `/bonding` (Next.js) | Landing chiquita en producción: foto + video + .srt |

## Mini landing

Ruta: **`/bonding`** en el portafolio Next.js.

Cuando el video esté renderizado:
```bash
cp video/bonding-demo/out/bonding-demo-vertical.mp4 public/bonding/demo-vertical.mp4
```

## Workflow

```bash
cd video/bonding-demo

# 1. Generar 6 clips en ElevenLabs (ver ELEVENLABS-VOICES.md)
# 2. Concatenar → audio/vo-full.wav

# 3. Preview
npm run dev

# 4. Validar
npm run check

# 5. Render vertical (WhatsApp / LinkedIn)
npm run render

# 6. Render horizontal (opcional, requiere ajustar dimensiones en composiciones)
npm run render:landscape
```

## Pendiente para render final

- [ ] `audio/vo-full.wav` (6 clips ElevenLabs concatenados)
- [ ] Ajustar timings SRT tras medir audio real (`ffprobe`)
- [ ] `npm run check` sin errores
- [ ] `npm run render` → `out/bonding-demo-vertical.mp4`
