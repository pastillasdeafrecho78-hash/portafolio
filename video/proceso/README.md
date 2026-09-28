# Videos de `/proceso`

Diez recorridos visuales de Think Deep, cada uno en formato móvil (1080 × 1920) y escritorio (1920 × 1080). Los archivos que usa Next.js están en `public/video/proceso/` con nombres `{id}.mp4`, `{id}-pc.mp4` y sus posters WebP. Los diez llevan narración Richard Social Media; el reproductor de `/proceso` inicia silenciado y deja activar el sonido.

## Regenerar

```bash
python video/proceso/scripts/build-clips.py
hyperframes check video/proceso/panel
hyperframes render -f 30 -q looks -o public/video/proceso/panel.mp4 video/proceso/panel
python video/proceso/scripts/make-posters.py
```

El generador acepta uno o varios IDs para trabajar solo en esas composiciones. Ejecuta `hyperframes check` en cada versión antes del render final. Los nueve guiones de voz vigentes son los textos literales del [`handoff de voz y ritmo`](HANDOFF-CODEX-VO-RITMO.md), guardados en `scripts/vo-scripts.json`. La estructura visual se genera desde `scripts/build-clips.py`.

## Voz y sincronización

`scripts/produce-voice.py` requiere `ELEVENLABS_API_KEY` en el entorno. Genera Richard a velocidad 0.85, completa las pausas breves entre oraciones y guarda la alineación corregida por palabra en `audio/{id}-vo.json`. Los takes originales se conservan en `.voice-work/`, ignorado por Git, para reutilizarlos sin repetir la solicitud de síntesis. `sitio` conserva su voz y sus tiempos anteriores.

Después de regenerar la voz, ejecuta `build-clips.py` con los mismos IDs: obtiene del JSON la duración y el inicio hablado de cada escena. Renderiza ambas versiones y verifica los MP4 finales:

```bash
python video/proceso/scripts/verify-voice-sync.py
```

La prueba compara la señal al inicio y al final, los anclajes de las escenas, la duración y la igualdad de takes entre móvil y PC. Los resultados de esta entrega están en [`QA-VO-RITMO.md`](QA-VO-RITMO.md) y `QA-VO-RITMO.json`.
