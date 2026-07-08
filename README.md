# SA Portafolio

Landing profesional con video hero HyperFrames, WhatsApp y formulario de contacto.
Incluye la demo aislada **Lúmen Outfit** (tienda agéntica) en `/lumen`.

## Stack

- **Next.js 15** + TypeScript + Tailwind CSS v4
- **HyperFrames** — video hero de ~22s en `video/`
- **Zustand** — estado de la demo Lúmen
- **OpenRouter** + **MCP** (`@modelcontextprotocol/sdk`) — agente de la demo Lúmen

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
2. Añade `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` desde [web3forms.com](https://web3forms.com) (envío desde el navegador; el plan gratis no permite `/api/contact` en servidor)
3. Actualiza en `src/lib/constants.ts`:
   - `WHATSAPP_NUMBER`
   - `SITE.email` / `SITE.phone`
   - `SITE.url`

## Demo Lúmen Outfit (`/lumen`)

Tienda agéntica de demostración, montada como rutas aisladas que no afectan la landing:

- `/lumen` — landing con video introductorio de la demo.
- `/lumen/demo` — tienda + asistente de chat (busca, resalta, navega y agrega al carrito).
- `/api/lumen/agent` — endpoint SSE del agente.

### Variables de entorno (OpenRouter)

- `OPENROUTER_API_KEY` — sin ella, la demo corre en **modo demo** (chat con fallback local, sin costo).
- `OPENROUTER_MODEL` — opcional, default `google/gemini-2.5-flash`.

### Servidor MCP

Expone las mismas herramientas del agente sobre stdio:

```bash
npm run mcp:lumen
```

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

Variables de entorno en Vercel: `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` (Production + Preview).
