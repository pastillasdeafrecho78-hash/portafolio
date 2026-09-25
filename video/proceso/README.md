# Videos de `/proceso`

Diez recorridos visuales de Think Deep, cada uno en formato móvil (1080 × 1920) y escritorio (1920 × 1080). Los archivos que usa Next.js están en `public/video/proceso/` con nombres `{id}.mp4`, `{id}-pc.mp4` y sus posters WebP. «Sitio web» conserva la narración original. Los otros nueve se leen sin audio, también cuando el reproductor inicia silenciado.

## Regenerar

```bash
python video/proceso/scripts/build-clips.py
hyperframes check video/proceso/panel
hyperframes render -f 30 -q looks -o public/video/proceso/panel.mp4 video/proceso/panel
python video/proceso/scripts/make-posters.py
```

El generador acepta uno o varios IDs para trabajar solo en esas composiciones. Ejecuta `hyperframes check` en cada versión antes del render final. Los guiones de voz que aún no se produjeron están en [`docs/GUIONES-PROCESO-REVISION.md`](../../docs/GUIONES-PROCESO-REVISION.md). La estructura visual vigente se genera desde `scripts/build-clips.py`; los borradores antiguos están en `archive/` solo como referencia local.
