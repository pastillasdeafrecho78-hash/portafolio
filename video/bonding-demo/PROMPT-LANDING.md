# Prompt — Mini landing Bonding (reutilizable)

Copia y pega este prompt tal cual para generar o iterar la landing. Usa assets ya existentes del repo.

---

## Prompt

Crea una **landing page mínima de una sola pantalla** (sin menú largo ni secciones de portafolio completo) para presentar un demo audiovisual de localización multilingüe dirigido a **Bonding Communication**.

### Stack y ubicación
- Next.js 15 + Tailwind v4 en `/src/app/bonding/page.tsx`
- Reutilizar tokens y clases de `src/app/globals.css` (`.container-page`, `.button`, `.eyebrow`, etc.)
- **No** duplicar el portafolio completo: solo esta página chiquita, tipo “tarjeta de presentación + video”.

### Assets obligatorios (ya en el repo)
- **Foto retrato:** `/salvador-barba.png` (misma imagen del hero del portafolio)
- **Logo opcional:** `/logo-salvador-barba.png`
- **Video demo vertical 9:16:** `/bonding/demo-vertical.mp4` (40 s, cuando esté renderizado)
- **Poster del video:** `/bonding/poster.svg` o frame del video
- **Subtítulos descargables:** `/bonding/subtitles/es.srt`, `en.srt`, `ca.srt`, `fr.srt`, `it.srt`, `multilingue-completo.srt`

### Tono y copy
- Cercano pero profesional. El presentador se presenta como **“Chava”** (apodo) con nombre completo debajo: **Salvador Barba García**.
- Headline tipo: *“Hola — soy Chava”* + subtítulo: *Localización audiovisual multilingüe asistida por IA*.
- Una línea de contexto: demo gratuita para evaluar flujo completo (transcripción → subtítulos → voz IA natural → entrega).
- **Nunca** usar “voz sintética”. Usar: *voz de IA natural* / *voz generada con IA de sonido natural y expresivo*.

### Layout (mobile-first, vertical)
```
┌─────────────────────────┐
│  [foto circular]        │
│  Hola — soy Chava       │
│  Salvador Barba García  │
│  1 línea de rol         │
├─────────────────────────┤
│  ▶ Video 9:16           │
│  (click to play audio)  │
├─────────────────────────┤
│  Qué incluye el demo    │
│  • 5 idiomas (lista)    │
│  • 40 s · 6 escenas     │
│  • Subtítulos .srt      │
│  • Voz IA por idioma    │
├─────────────────────────┤
│  Descargar subtítulos   │
│  [ES] [EN] [CA] [FR] [IT]│
├─────────────────────────┤
│  CTA WhatsApp / correo  │
└─────────────────────────┘
```

### Contenido — especificaciones rápidas del video

**Idiomas en el demo:** Español → Inglés → Catalán → Francés → Italiano → cierre ES.

**Qué demuestra el video (bullets cortos):**
- Localización audiovisual asistida por IA (no solo traducción)
- Subtítulos sincronizados por idioma
- Cambio de voz IA natural por versión localizada
- Pipeline: transcripción, adaptación, spotting, revisión .srt, entrega lista para publicar

**Documentos incluidos (enlaces de descarga):**
| Archivo | Descripción |
|---------|-------------|
| `es.srt` | Subtítulos escena español + cierre |
| `en.srt` | Subtítulos escena inglés |
| `ca.srt` | Subtítulos escena catalán |
| `fr.srt` | Subtítulos escena francés |
| `it.srt` | Subtítulos escena italiano |
| `multilingue-completo.srt` | Timeline completa 40 s |

**Servicios que vende (chips o lista compacta):**
Subtítulos · Traducción · Transcripción · Spotting · Voz IA natural

**Combinaciones lingüísticas (texto pequeño):**
ES↔EN · CA↔ES · CA↔EN · IT→ES/EN/CA · FR→ES/EN/CA

### Video player
- Ratio **9:16**, max-width ~400px centrado
- Click-to-play con audio (no autoplay con sonido)
- Barra de progreso simple o controles nativos
- Mensaje si el video aún no está: “Video en producción — preview del guion abajo”

### Estilo visual
- Fondo `#08090b`, cards `#101216`, borde sutil blanco 8%
- Acento cyan `#38BDF8` (coherente con escena ES del demo HyperFrames)
- Foto con borde circular y sombra suave (como hero del portafolio)
- Máximo **1 viewport** de scroll en móvil; en desktop columna estrecha centrada (~480px)

### SEO / meta
- Title: `Salvador Barba García — Demo localización audiovisual`
- Description: demo multilingüe 40 s para Bonding Communication
- `robots: noindex` (página privada de propuesta, no indexar)

### CTAs
- Primario: WhatsApp con mensaje precargado sobre Bonding / demo
- Secundario: `mailto:salvador@thinkdeepgroup.com`

### No incluir
- Menú del portafolio completo (solo link discreto “Ver portafolio →”)
- Formulario Web3Forms
- Tarifas largas (opcional: una línea “tarifas desde $X/min — consultar”)

### Referencia de contenido extendido
- Guion: `video/bonding-demo/GUION.md`
- Mensaje propuesta: `video/bonding-demo/PROPOSAL-MESSAGE.md`

---

## Variante ultra-corta (si pides solo HTML estático)

Misma estructura en un solo `index.html` en `video/bonding-demo/landing.html`, sin Next.js, enlazando assets con rutas relativas a `assets/salvador-barba.png` y `out/bonding-demo-vertical.mp4`.
