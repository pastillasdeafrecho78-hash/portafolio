# Prompts HyperFrames — escena por escena

Usar con `design.md` como referencia de marca. Formato base: **1080×1920**, GSAP seek-driven, `gsap.from()` hacia layout estático final.

---

## ESCENA 1 — `compositions/scene-01-es.html` (0–7 s)

**Prompt:**
> Composición vertical 9:16, fondo `#07080C` con gradiente radial cyan tenue. Retrato circular de Salvador Barba (`assets/salvador-barba.png`) centrado arriba, marco con borde `rgba(56,189,248,0.35)`. Debajo, mock de interfaz NLE: timeline horizontal con clips violeta/cyan, regla de timecode `00:00:00:00`, pistas Audio 1 / Sub ES / Video. Tres líneas de subtítulo flotantes en español con animación de entrada stagger. Headline grande: «Localización audiovisual asistida por IA». Subhead en mono: «Subtítulos · Traducción · Transcripción · Spotting · Voz IA natural». Ondas de audio SVG animadas. Iconos minimalistas: play, cc, code `</>`. Animación: retrato scale-in back.out, UI slide-up, subtítulos fade stagger. Salida 6.4–7 s: wipe diagonal + blur hacia escena EN.

**Elementos clave:** presentador humano, pipeline técnico, no corporativo genérico.

---

## ESCENA 2 — `compositions/scene-02-en.html` (7–13.5 s)

**Prompt:**
> Misma estructura vertical. Paleta indigo `#6366F1`. Subtítulos en inglés reescribiéndose (typewriter o crossfade de líneas). Fondo con red de nodos globales sutiles (SVG, opacidad 0.12). Panel UI con labels en inglés: «Transcription», «Subtitling», «Sync». Headline: «Subtitles • Translation • Voice localization». Retrato Salvador con halo indigo. Transición entrada: subtítulos ES morph a EN (opacity crossfade 0.4 s). Salida: dissolve a geometría catalana.

---

## ESCENA 3 — `compositions/scene-03-ca.html` (13.5–19.5 s)

**Prompt:**
> Vertical 9:16. Acentos rojo `#E11D48` y amarillo `#FACC15` en líneas geométricas tipo mosaico mediterráneo (abstracto, no bandera). Subtítulos en catalán. Headline: «Català • Subtítols • Adaptació audiovisual». UI con pista «Sub CA» activa en timeline. Tipografía limpia Inter. Entrada: tiles geométricos scale-in stagger. Retrato con borde dual rojo/amarillo sutil.

---

## ESCENA 4 — `compositions/scene-04-fr.html` (19.5–25.5 s)

**Prompt:**
> Estética editorial francesa cinematográfica. Fondo negro profundo, acentos cream `#D4C4A8`. Elementos: página de guion con marcas, timecode `01:12:34:08`, bloc de sous-titres flotante. Headline serif-accent (Inter 800): «Français • Sous-titres • Voix IA naturelle». Grain sutil CSS. Movimiento lento, elegante. Sin Torre Eiffel ni clichés.

---

## ESCENA 5 — `compositions/scene-05-it.html` (25.5–31.5 s)

**Prompt:**
> Energía cálida terracotta `#EA580C`. Tipografía elegante, motion fluido (ease power2). Subtítulos italianos. Headline: «Italiano • Localizzazione • Voce naturale». Referencia sutil a cine (clapper abstracto, no emoji). Timeline con pista «VO IT» resaltada. Entrada con slide horizontal suave.

---

## ESCENA 6 — `compositions/scene-06-outro.html` (31.5–40 s)

**Prompt:**
> Cierre multilingüe. Capas apiladas: 5 columnas de subtítulos mini (ES/EN/CA/FR/IT), ondas de voz superpuestas, snippet código `.srt` en mono, timeline completa, avatar Salvador abajo. Headline secuencial: «Una idea. Cinco idiomas. Varias voces.» → «Una entrega lista para publicar.» Hold final 37–40 s: nombre «Salvador Barba García», línea de servicios, logo pequeño. Animación: capas convergen al centro (scale 0.95→1), glow cyan final.

---

## Master `index.html`

**Prompt:**
> Timeline 40 s, 1080×1920. 6 sub-compositions en track 1 con cortes en 7, 13.5, 19.5, 25.5, 31.5. Audio track 3: `audio/vo-full.wav` (concat de 6 clips ElevenLabs). Track 2 opcional: captions burn-in sincronizados a beats del guion. Transiciones entre escenas: 0.35 s crossfade o shader wipe si registry disponible. Registrar timelines en `window.__timelines`.

---

## Render landscape (16:9)

Reutilizar mismas composiciones cambiando `data-width="1920" data-height="1080"` y ajustando padding en CSS (`padding: 80px 160px` en `.scene-content`). Ejecutar:

```bash
npm run render:landscape
```
