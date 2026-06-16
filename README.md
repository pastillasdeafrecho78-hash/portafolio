# SA Portafolio

Landing profesional con video hero HyperFrames, WhatsApp y formulario de contacto.

## Stack

- **Next.js 15** + TypeScript + Tailwind CSS v4
- **HyperFrames** — video hero de ~22s en `video/`

## Desarrollo

```bash
# Landing
npm install
npm run dev

# Video (opcional, re-render)
cd video && npm run render
cp video/out/hero-demo.mp4 public/video/
```

Abre [http://localhost:3000](http://localhost:3000).

## Configuración

1. Copia `.env.example` a `.env.local`
2. Añade `WEB3FORMS_ACCESS_KEY` desde [web3forms.com](https://web3forms.com) para el formulario
3. Actualiza en `src/lib/constants.ts`:
   - `WHATSAPP_NUMBER`
   - `SITE.email` / `SITE.phone`
   - `SITE.url`

## Estructura

```
design.md          # Design system compartido
video/             # Proyecto HyperFrames
src/app/           # Next.js App Router
src/components/    # UI y secciones
public/video/      # Video renderizado para el hero
```

## Deploy (Vercel)

```bash
npx vercel
```

Variables de entorno en Vercel: `WEB3FORMS_ACCESS_KEY`.
