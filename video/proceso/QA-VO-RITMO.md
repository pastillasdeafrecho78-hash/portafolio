# Verificación de voz y ritmo · 2026-09-28

- Nueve guiones idénticos a los textos aprobados del handoff.
- Richard / eleven_multilingual_v2 / speed 0.85; pausas completadas hasta 200 ms entre oraciones y 140 ms en punto y coma cuando hacía falta.
- Dieciocho composiciones pasaron HyperFrames check (lint, runtime, layout, motion y contraste), sin errores ni advertencias. Los avisos informativos de superposición corresponden a los fundidos de 350 ms.
- Dieciocho MP4 a 30 fps con voz completa. Móvil y PC usan el mismo MP3.
- Desfase de señal medido: 0 ms al inicio y al final en los dieciocho MP4, con resolución de 2 ms. Correlación mínima: 0.9997.
- Las escenas se anclan al comienzo hablado de la idea; el fundido comienza 200 ms antes y el titular termina de entrar 230 ms después.
- Dieciocho posters renovados; build de Next.js aprobado.
- Doce archivos de sitio (audio, composiciones y MP4) idénticos a sus hashes previos. Sitio no se regeneró.

| Tema | Voz (s) | Video móvil / PC (s) |
|---|---:|---:|
| panel | 39.710 | 40.633 |
| mvp | 32.069 | 33.000 |
| whatsapp | 32.647 | 33.567 |
| webchat | 38.005 | 38.933 |
| inbox | 32.360 | 33.267 |
| rostro | 29.021 | 29.933 |
| patron | 29.648 | 30.567 |
| lista | 27.650 | 28.567 |
| otro | 41.752 | 42.667 |

La prueba de señal verifica que el render conserva el audio y no añade desplazamiento ni deriva. Los anclajes semánticos provienen de la alineación por palabra entregada por ElevenLabs, actualizada tras las pausas. Esto no sustituye la valoración humana del tono y la pronunciación.

Repetir: python video/proceso/scripts/verify-voice-sync.py --report video/proceso/QA-VO-RITMO.json
