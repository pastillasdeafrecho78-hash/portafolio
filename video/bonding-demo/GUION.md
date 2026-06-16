# Guion final — Demo Bonding Communication

**Duración total:** 40 s · **Formato principal:** 1080×1920 (9:16)  
**Objetivo:** Demostrar flujo completo de localización audiovisual multilingüe (subtítulos, voz IA natural, sincronización, automatización).

---

## Mapa de timeline (sincronizado a audio ElevenLabs)

| # | Escena | Inicio | Fin | Dur. | Idioma VO |
|---|--------|--------|-----|------|-----------|
| 1 | Presentación ES | 0.000 | 7.802 | 7.802 s | Español |
| 2 | Inglés | 7.802 | 16.718 | 8.916 s | Inglés |
| 3 | Catalán | 16.718 | 21.502 | 4.783 s | Catalán |
| 4 | Francés | 21.502 | 27.864 | 6.362 s | Francés |
| 5 | Italiano | 27.864 | 33.715 | 5.851 s | Italiano |
| 6 | Cierre ES | 33.715 | 40.263 | 6.548 s | Español |

**Total:** 40.263 s · cada escena visual = duración exacta del clip de voz.

---

## ESCENA 1 — Presentación inicial (español) · 0:00–0:07

**Visual:** Salvador como presentador. Fondo oscuro limpio. Timeline de edición, ondas de audio, líneas de subtítulo flotando, íconos de video/código/capas de traducción. Acento cyan.

**Texto en pantalla (headline):**  
`Localización audiovisual asistida por IA`

**Texto en pantalla (sub):**  
`Subtítulos · Traducción · Transcripción · Spotting · Voz IA natural`

**Voz (español):**  
> Hola, soy Salvador Barba García. Ayudo a convertir contenido audiovisual en versiones localizadas, naturales y listas para publicar.

**Subtítulo burn-in (español):** mismo texto de VO, en dos líneas.

**Transición salida:** wipe diagonal + subtítulos ES se deslizan y se reescriben como EN.

---

## ESCENA 2 — Inglés · 0:07–0:13.5

**Visual:** UI cambia a inglés. Subtítulos se reescriben en tiempo real. Mapa/red global sutil, líneas de conexión, acento indigo. Sin clichés de banderas.

**Texto en pantalla:**  
`Subtitles • Translation • Voice localization`

**Voz (inglés):**  
> I work with AI-assisted workflows for transcription, subtitling, translation, synchronization and voice localization.

**Transición:** morph de tipografía + crossfade a paleta catalana.

---

## ESCENA 3 — Catalán · 0:13.5–0:19.5

**Visual:** Geometría mediterránea sutil (mosaico abstracto), rojo/amarillo en acentos mínimos. Subtítulos en catalán. Referencia moderna a Barcelona sin saturar.

**Texto en pantalla:**  
`Català • Subtítols • Adaptació audiovisual`

**Voz (catalán):**  
> Puc adaptar contingut audiovisual al català amb subtítols, veu i sincronització.

---

## ESCENA 4 — Francés · 0:19.5–0:25.5

**Visual:** Estética editorial cinematográfica. Tonos negro + cream. Elementos de guion, marcas de timecode, sous-titres flotantes. Elegante, no caricaturesco.

**Texto en pantalla:**  
`Français • Sous-titres • Voix IA naturelle`

**Voz (francés):**  
> Je peux adapter des vidéos en français avec une voix naturelle, des sous-titres précis et une synchronisation claire.

---

## ESCENA 5 — Italiano · 0:25.5–0:31.5

**Visual:** Energía cálida. Terracotta + tipografía elegante. Movimiento fluido. Referencias sutiles a cine/diseño italiano.

**Texto en pantalla:**  
`Italiano • Localizzazione • Voce naturale`

**Voz (italiano):**  
> Posso localizzare contenuti audiovisivi in italiano, mantenendo ritmo, intenzione e naturalezza.

---

## ESCENA 6 — Cierre multilingüe · 0:31.5–0:40

**Visual:** Todas las capas convergen: subtítulos en 5 idiomas, ondas de voz, timeline, snippets de código (.srt), avatar, clips localizados. Sensación de pipeline completo.

**Texto en pantalla (principal):**  
`Una idea. Cinco idiomas. Varias voces. Una entrega lista para publicar.`

**Voz (español):**  
> Puedo preparar una muestra gratuita de hasta 30 segundos para demostrar el flujo completo de localización audiovisual.

**Texto final (hold 2 s):**  
```
Salvador Barba García
Localización audiovisual multilingüe asistida por IA
Subtítulos · Traducción · Transcripción · Spotting · Voz IA natural
```

---

## Notas de producción

1. **6 archivos de audio** ElevenLabs (uno por escena) → concatenar en `audio/vo-full.wav`.
2. **Subtítulos SRT** en `subtitles/` — uno por idioma + `es-cierre.srt` para escena 6.
3. **Render vertical:** `npm run render` → `out/bonding-demo-vertical.mp4`
4. **Render horizontal:** `npm run render:landscape` → `out/bonding-demo-horizontal.mp4`
