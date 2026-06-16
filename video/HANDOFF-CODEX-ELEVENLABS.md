# Handoff Codex — Audio Eleven Labs + Video HyperFrames

**Para:** Codex (no Cursor)  
**Proyecto:** Portafolio Salvador Barba  
**Objetivo:** Generar VO en Eleven Labs, sincronizarlo al video hero de 30s sin huecos muertos, re-renderizar e integrar en la landing.

---

## 1. Mapa del repo (dónde está todo)

```
/home/SalvadorTD/Desktop/portafolio/
├── src/components/VideoHero.tsx      ← <video> en la landing (hero)
├── src/components/sections/Hero.tsx  ← sección hero + video debajo del retrato
├── public/video/
│   ├── hero-demo.mp4                 ← video actual en producción (30s, sin audio)
│   ├── hero-demo.webm
│   └── hero-poster.svg
│
└── video/                            ← PROYECTO HYPERFRAMES (trabajar aquí)
    ├── index.html                    ← composición master (timeline 30s)
    ├── hyperframes.json
    ├── package.json                  ← npm run dev | check | render
    ├── SCRIPT.md                     ← captions on-screen (desactualizado parcialmente)
    ├── STORYBOARD.md
    ├── assets/
    │   └── logo-sa.svg
    ├── compositions/                 ← una escena por archivo
    │   ├── scene-hook.html           ← 0:00–0:04
    │   ├── scene-landing.html        ← 0:04–0:09
    │   ├── scene-form.html           ← 0:09–0:14
    │   ├── scene-whatsapp.html       ← 0:14–0:18
    │   ├── scene-dashboard.html      ← 0:18–0:26
    │   └── scene-cta.html            ← 0:26–0:30
    ├── out/                          ← salida de render (crear si no existe)
    │   └── hero-demo.mp4
    └── audio/                        ← CREAR: poner aquí WAV de Eleven Labs
        ├── vo-full.wav               ← narración completa (preferido)
        ├── vo-full.mp3
        └── transcript.json           ← timestamps post-transcribe (opcional)
```

**Referencia de copy/servicios (landing):**  
`/home/SalvadorTD/think-deep-ia-agentica/` — sitio previo con textos reales.

**Landing local:** `npm run dev` en `/home/SalvadorTD/Desktop/portafolio` → http://localhost:3001

---

## 2. Specs del video

| Parámetro | Valor |
|-----------|-------|
| Duración total | **30.000 s** exactos |
| Resolución | 1920 × 1080 |
| FPS render | 30 (900 frames) |
| Audio actual | **ninguno** |
| Formato entrega web | MP4 (H.264) + WebM (VP9), muted=false tras integrar audio |

Verificar duración:
```bash
ffprobe -v error -show_entries format=duration -of csv=p=0 public/video/hero-demo.mp4
# debe imprimir: 30.000000
```

---

## 3. Timeline visual (escenas) — `video/index.html`

| # | Scene ID | Archivo | Inicio | Fin | Duración |
|---|----------|---------|--------|-----|----------|
| 1 | scene-hook | compositions/scene-hook.html | 0.0 | 4.0 | 4.0 s |
| 2 | scene-landing | compositions/scene-landing.html | 4.0 | 9.0 | 5.0 s |
| 3 | scene-form | compositions/scene-form.html | 9.0 | 14.0 | 5.0 s |
| 4 | scene-whatsapp | compositions/scene-whatsapp.html | 14.0 | 18.0 | 4.0 s |
| 5 | scene-dashboard | compositions/scene-dashboard.html | 18.0 | 26.0 | 8.0 s |
| 6 | scene-cta | compositions/scene-cta.html | 26.0 | 30.0 | 4.0 s |

Atributos en HTML (líneas 46–51 de `index.html`):
```html
data-start="0"  data-duration="4"   <!-- hook -->
data-start="4"  data-duration="5"   <!-- landing -->
data-start="9"  data-duration="5"   <!-- form -->
data-start="14" data-duration="4"   <!-- whatsapp -->
data-start="18" data-duration="8"   <!-- dashboard -->
data-start="26" data-duration="4"   <!-- cta -->
```

---

## 4. Timeline captions on-screen (track 2) — gaps actuales

Captions en `index.html` líneas 59–66. **Hay ~0.7 s de hueco entre cada frase** (out → siguiente `t`).

| Beat | Texto pantalla | Entrada (s) | Salida (s) | Visible (s) | Hueco antes |
|------|----------------|-------------|------------|-------------|-------------|
| 1 | Sitios y sistemas para tu negocio | 0.30 | 3.50 | 3.20 | — |
| — | *(silencio visual)* | 3.50 | 4.20 | 0.70 | ⚠ gap |
| 2 | Webs que convierten | 4.20 | 8.50 | 4.30 | ⚠ gap |
| — | *(silencio)* | 8.50 | 9.20 | 0.70 | ⚠ gap |
| 3 | Captura clientes 24/7 | 9.20 | 13.50 | 4.30 | ⚠ gap |
| — | *(silencio)* | 13.50 | 14.20 | 0.70 | ⚠ gap |
| 4 | Responde al instante | 14.20 | 17.50 | 3.30 | ⚠ gap |
| — | *(silencio)* | 17.50 | 18.20 | 0.70 | ⚠ gap |
| 5 | Todo bajo control | 18.20 | 25.50 | 7.30 | ⚠ gap |
| — | *(silencio)* | 25.50 | 26.20 | 0.70 | ⚠ gap |
| 6 | salvador.dev — Escríbenos | 26.20 | 29.50 | 3.30 | ⚠ gap |
| — | *(hold final)* | 29.50 | 30.00 | 0.50 | — |

**Codex debe:** o bien (A) llenar esos gaps con VO continuo, o (B) ajustar los `t` / `out` en el timeline de captions para que coincidan con el audio sin dead air.

---

## 5. Guion VO para Eleven Labs (español MX, continuo, ~28–29 s hablado)

Voz sugerida: masculina, profesional, cercana. No vendedor agresivo.  
Velocidad Eleven Labs: **~0.95–1.0** (natural).  
**Un solo take continuo** es preferible para evitar gaps; si usan clips separados, ver tabla de duración objetivo abajo.

### Texto completo (copiar a Eleven Labs)

```
Desarrollo sitios web y sistemas digitales para negocios que necesitan verse profesionales y operar mejor.

Construyo páginas corporativas y landings que convierten visitas en prospectos reales.

Formularios conectados a tu correo para captar clientes las veinticuatro horas.

Integro WhatsApp para que puedas responder al instante desde el celular.

También armo paneles y dashboards para ordenar pedidos, usuarios y reportes.

Soy Salvador Barba. Escríbeme y vemos tu proyecto.
```

**Palabras:** ~62 | **Objetivo hablado:** 28.0–29.5 s | **Caracteres:** ~420

---

## 6. Guion por clip (si Eleven Labs exporta por segmento)

Usar si generan **6 archivos WAV** — duraciones objetivo para **cero gap** (VO back-to-back dentro de cada ventana de escena):

| Clip | Archivo sugerido | Ventana escena | Duración VO objetivo | Texto exacto |
|------|------------------|----------------|----------------------|--------------|
| 1 | `audio/01-hook.wav` | 0.00 – 4.00 s | **3.8 s** | «Desarrollo sitios web y sistemas digitales para negocios que necesitan verse profesionales y operar mejor.» |
| 2 | `audio/02-landing.wav` | 4.00 – 9.00 s | **4.8 s** | «Construyo páginas corporativas y landings que convierten visitas en prospectos reales.» |
| 3 | `audio/03-form.wav` | 9.00 – 14.00 s | **4.8 s** | «Formularios conectados a tu correo para captar clientes las veinticuatro horas.» |
| 4 | `audio/04-whatsapp.wav` | 14.00 – 18.00 s | **3.8 s** | «Integro WhatsApp para que puedas responder al instante desde el celular.» |
| 5 | `audio/05-dashboard.wav` | 18.00 – 26.00 s | **7.8 s** | «También armo paneles y dashboards para ordenar pedidos, usuarios y reportes de tu operación.» |
| 6 | `audio/06-cta.wav` | 26.00 – 30.00 s | **3.8 s** | «Soy Salvador Barba. Escríbeme y vemos tu proyecto.» |

**Regla:** cada clip debe empezar ~**0.15 s** después del corte de escena y terminar ~**0.05 s** antes del siguiente corte. Total hablado ≈ **29.0 s**, dejando 1 s de respiración solo al final.

### Captions on-screen actualizados (alinear con VO)

| Beat | Nuevo texto pantalla (opcional) | In | Out |
|------|----------------------------------|-----|-----|
| 1 | Sitios y sistemas para tu negocio | 0.15 | 3.85 |
| 2 | Webs que convierten | 4.05 | 8.85 |
| 3 | Captura clientes 24/7 | 9.05 | 13.85 |
| 4 | Responde al instante | 14.05 | 17.85 |
| 5 | Todo bajo control | 18.05 | 25.85 |
| 6 | Salvador Barba — Escríbeme | 26.05 | 29.85 |

Editar array `beats` en `video/index.html` (~línea 59) con estos valores.

---

## 7. Workflow Eleven Labs → HyperFrames (pasos para Codex)

### A. Generar audio (Eleven Labs)

1. Pegar guion sección 5 (o clips sección 6).
2. Exportar: **WAV 44.1 kHz** o **MP3 192 kbps+**.
3. Guardar en `video/audio/`.
4. Si es un solo archivo: `video/audio/vo-full.wav`.

### B. Medir duración real

```bash
cd /home/SalvadorTD/Desktop/portafolio/video
ffprobe -v error -show_entries format=duration -of csv=p=0 audio/vo-full.wav
```

Si dura **> 29.8 s** → acortar guion o regenerar más rápido.  
Si dura **< 27 s** → agregar una frase corta en beat 5 (dashboard tiene 8 s de ventana).

### C. Transcribir para timestamps (recomendado)

```bash
cd /home/SalvadorTD/Desktop/portafolio/video
npx hyperframes transcribe audio/vo-full.wav --model small --language es
# genera transcript.json con word-level timestamps
```

Usar `transcript.json` para ajustar captions y `data-start` si hace falta micro-sync.

### D. Integrar audio en `index.html`

Agregar track de audio en el root composition (`#root`), **track-index="3"**:

```html
<audio
  id="narration"
  data-composition-id="narration"
  data-start="0"
  data-duration="30"
  data-track-index="3"
  src="audio/vo-full.wav"
  preload="auto"
></audio>
```

HyperFrames sincroniza playback con el timeline en render. Ver skill `hyperframes` + `hyperframes-media`.

Si usan clips separados, concatenar primero:

```bash
# ejemplo concat con ffmpeg
ffmpeg -f concat -safe 0 -i audio/concat-list.txt -c copy audio/vo-full.wav
```

`concat-list.txt`:
```
file '01-hook.wav'
file '02-landing.wav'
...
```

### E. Preview y render

```bash
cd /home/SalvadorTD/Desktop/portafolio/video
npm run dev          # preview en browser
npm run check        # lint + validate + inspect
npm run render       # → out/hero-demo.mp4 (con audio)
```

### F. Copiar a landing

```bash
cp video/out/hero-demo.mp4 public/video/hero-demo.mp4
ffmpeg -y -i public/video/hero-demo.mp4 -c:v libvpx-vp9 -crf 32 -b:v 0 -c:a libopus public/video/hero-demo.webm
```

### G. Actualizar `VideoHero.tsx`

Cuando el video tenga audio intencional:

```tsx
// src/components/VideoHero.tsx
<video autoPlay muted loop playsInline ...>
```

Cambiar a:
- **`muted`** solo si el hero debe ser silencioso en autoplay (política browsers).
- Patrón común: autoplay muted + botón "Activar audio", O dejar muted en loop y audio solo en render para redes.

Para **autoplay con sonido en landing** (limitado en Chrome/Safari): mantener `muted` en web, o documentar click-to-unmute.

---

## 8. Comandos rápidos (cheat sheet Codex)

```bash
# Preview video
cd /home/SalvadorTD/Desktop/portafolio/video && npm run dev

# Render final
cd /home/SalvadorTD/Desktop/portafolio/video && npm run render

# Landing
cd /home/SalvadorTD/Desktop/portafolio && npm run dev

# Duración video
ffprobe -v error -show_entries format=duration -of csv=p=0 public/video/hero-demo.mp4
```

---

## 9. Skills Cursor/HyperFrames (leer antes de tocar)

- `/home/SalvadorTD/.agents/skills/hyperframes/SKILL.md` — composiciones, timeline, GSAP
- `/home/SalvadorTD/.agents/skills/hyperframes-cli/SKILL.md` — lint, inspect, render
- `/home/SalvadorTD/.agents/skills/hyperframes-media/SKILL.md` — tts, transcribe (alternativa local a Eleven Labs)

---

## 10. Checklist de entrega Codex

- [ ] `video/audio/vo-full.wav` existe y dura 28–29.5 s
- [ ] Captions en `index.html` sin gaps > 0.3 s vs VO
- [ ] Texto CTA final dice **Salvador Barba** (no "SA" ni "salvador.dev" solo)
- [ ] `npm run check` pasa sin errores
- [ ] Render 30 s con audio en `video/out/hero-demo.mp4`
- [ ] Copiado a `public/video/` (+ webm)
- [ ] Probado en landing http://localhost:3001

---

## 11. Notas de marca (no inventar)

- Nombre: **Salvador Barba**
- Rol: Desarrollador web freelance
- WhatsApp: 488 177 4543 (`524881774543`)
- Email: salvador@thinkdeepgroup.com
- Proyectos reales: Sitio agencia, ServimOS/Pedimos, Panel BI
- **No** usar copy genérico "Hola soy…" ni branding "SA"
