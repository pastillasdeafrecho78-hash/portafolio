# Think Deep · portafolio

Sitio personal de Think Deep. La página principal presenta el estudio y guía al visitante por un cuestionario; al terminar prepara un mensaje de WhatsApp y muestra `/proceso`. Incluye una página de demostración en `/bonding`.

## Desarrollo

```bash
npm install
npm run dev
```

## Comprobación antes de publicar

```bash
npm run lint
npx tsc --noEmit
npm run build
```

Las rutas `/`, `/proceso` y `/bonding` deben abrir sin error. Comprueba el recorrido del cuestionario en móvil y escritorio, y que el botón final abra el número de `src/lib/constants.ts` con el mensaje elegido.

## Configuración

- `src/lib/constants.ts`: nombre, dominio, correo y número de WhatsApp. El contacto principal funciona mediante WhatsApp y correo sin variables de entorno.
- `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY`: opcional. El formulario de `src/components/sections/Contact.tsx` solo aparece si `CONTACT_FORM_ENABLED` está activado en `src/lib/constants.ts`.
- ManyChat está desactivado. Para configurarlo después, consulta `docs/MANYCHAT-FASE-B.md`. Los tokens deben ir en variables del servidor, nunca en Git.

## Videos de `/proceso`

Los diez clips tienen versiones móvil (1080 × 1920) y escritorio (1920 × 1080) en `public/video/proceso/`, con su poster correspondiente. El material fuente y las instrucciones para regenerarlos están en [`video/proceso/README.md`](video/proceso/README.md). «Sitio web» conserva su narración; los otros nueve se entienden sin audio.

El despliegue conectado a `main` se actualiza con un push al repositorio remoto. Este repositorio no necesita guardar `.env.local` ni archivos temporales de diseño.
