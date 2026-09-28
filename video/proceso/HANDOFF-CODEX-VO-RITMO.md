# Handoff Codex — VO ritmo + guiones nosotros/tú + sync /proceso

**Para:** Codex\
**Proyecto:** `/home/SalvadorTD/Desktop/portafolio`\
**Estado:** EJECUTAR\
**Alcance:** 9 clips de `/proceso` (NO tocar `sitio` VO ni su timing). Móvil + PC = 18 MP4.

---

## Prompt listo para pegar en Codex

```
Trabajas en /home/SalvadorTD/Desktop/portafolio.

Objetivo: reescribir guiones VO de los 9 clips /proceso (panel, mvp, whatsapp, webchat, inbox, rostro, patron, lista, otro), regenerar narración ElevenLabs con Richard, sincronizar escenas HyperFrames a la nueva VO, renderizar 18 MP4 (móvil+PC), posters, commit y push a main.

NO tocar: video/proceso/sitio/** audio ni timing de sitio (VO ya validada).

### Tono (obligatorio)
- Think Deep habla en plural: nosotros / vamos / armamos / dejamos / sumamos.
- Al cliente de tú.
- Mismo contenido semántico que hoy; cambia la boca: frases completas, no checklist telegráfico.
- Prohibido el estribillo robot: "Te voy a llevar por cómo lo armamos."
- Abrir con reconocimiento ("Pediste…") y pasar a "Vamos a armarlo/la contigo."
- Cerrar con "Think Deep."
- Guiones literales aprobados: sección 3 de video/proceso/HANDOFF-CODEX-VO-RITMO.md — cópialos a video/proceso/scripts/vo-scripts.json sin reescribir creativamente.

### ElevenLabs
- Fuente env: source ~/.config/servimos/elevenlabs.env
- Voice ID: Cpm6N9BNC1M75bYS7kO1 (Richard - Social Media)
- model: eleven_multilingual_v2
- voice_settings: stability 0.46, similarity_boost 0.78, style 0.36, use_speaker_boost true
- speed: 0.85 (más claro que 1.0; el pacing fino va en post)
- Guardar: video/proceso/{id}/audio/{id}-vo.mp3
- Actualizar video/proceso/scripts/vo-scripts.json (scripts + settings.speed=0.85)
- Actualizar video/proceso/VOZ.md: speed 0.85; quitar la regla "no speed < 1"

### Pausas en edición (post), no en regeneraciones infinitas
1. Genera el take a speed 0.85.
2. Si aún corre sin respirar entre oraciones, inserta silencios cortos (≈120–220 ms) después de puntos (y opcionalmente comas fuertes) con ffmpeg (adelay / asplit+anullsrc+concat, o sox). No distorsiones; no atempo < 0.9 salvo que un clip concreto siga inentendible.
3. Medir duración final con ffprobe → esa es la verdad.

### Sync de paneles / escenas
Fuente: video/proceso/scripts/build-clips.py (VO_LENGTH, DURATION, SCENE_STARTS, END_START).

Para cada id (excepto sitio):
1. VO_LENGTH[id] = duración ffprobe del mp3 final.
2. DURATION[id] = VO_LENGTH + ~0.9 s (hold logo; mismo criterio actual).
3. END_START[id] ≈ momento en que empieza a decirse "Think Deep" (aprox VO_LENGTH - 1.2 s; afinar si transcribes).
4. SCENE_STARTS: 4 tiempos absolutos alineados a los bloques del guion (hook → 4 escenas de contenido). Preferible: hiperframes/whisper transcribe --language es y anclar el inicio de cada bloque semántico; si no, repartir por peso de caracteres de los 4 bloques + hook, escalando a VO_LENGTH, y ajustar a oído en preview.
5. python video/proceso/scripts/build-clips.py {ids}  (regenera móvil+PC HTML y copia audio a *-pc).
6. hyperframes check en cada composición tocada.

Reajustar detalles de paneles = retiming de cortes de escena + que los reveals GSAP caigan cuando la VO cambia de idea. No rediseñar mockups salvo que un panel quede vacío/cortado por duración.

### Render + publicar
Para cada id in panel mvp whatsapp webchat inbox rostro patron lista otro:
  hyperframes render -f 30 -q looks -o public/video/proceso/{id}.mp4 video/proceso/{id}
  hyperframes render -f 30 -q looks -o public/video/proceso/{id}-pc.mp4 video/proceso/{id}-pc
python video/proceso/scripts/make-posters.py
npm run build (sanity Next)

### Git
Commit + push a main con mensaje tipo:
"Slow proceso narration and rewrite VO as Think Deep speaking to you."

Incluir: scripts VO, build-clips timings, audio mp3, public mp4/webp posters, VOZ.md.
No incluir secretos ni .env.

### Checklist
- [ ] 9 guiones en vo-scripts.json = sección 3 del handoff
- [ ] 9 mp3 nuevos; sitio-vo.mp3 intacto
- [ ] VO_LENGTH/DURATION/SCENE_STARTS/END_START actualizados
- [ ] 18 mp4 en public/video/proceso/
- [ ] posters regenerados
- [ ] push a origin/main
```

---

## 1. Contexto (por qué)

La VO actual (speed 1.0 + guiones en primera persona / checklist) se oye a balbuceo robótico. Salvador pidió:

1. Hablar como equipo Think Deep (**nosotros**).
2. Dirigirse al cliente de **tú**.
3. Mantener el mensaje; cambiar la manera.
4. Pausas finas en **edición posterior**; reajustar timing de paneles/escenas.
5. Este handoff para Codex (no Cursor en este turno).

Referencia de tono bueno (parcial): cierre de `sitio` — «Tú decides el ritmo; nosotros lo aterrizamos.»

---

## 2. Archivos clave

| Rol | Path |
|-----|------|
| Guiones + knobs | `video/proceso/scripts/vo-scripts.json` |
| Timings + HTML | `video/proceso/scripts/build-clips.py` |
| Docs voz | `video/proceso/VOZ.md` |
| Audio por clip | `video/proceso/{id}/audio/{id}-vo.mp3` |
| Comps | `video/proceso/{id}/`, `video/proceso/{id}-pc/` |
| Público | `public/video/proceso/{id}.mp4`, `{id}-pc.mp4`, posters |
| Posters | `video/proceso/scripts/make-posters.py` |
| API key | `~/.config/servimos/elevenlabs.env` → `ELEVENLABS_API_KEY` |

IDs a tocar: `panel` `mvp` `whatsapp` `webchat` `inbox` `rostro` `patron` `lista` `otro`\
**Excluir:** `sitio`

---

## 3. Guiones literales (copiar tal cual)

### panel

Pediste un panel. Vamos a armarlo contigo. Primero vemos qué necesitas tener a la vista para decidir o trabajar. Si hoy anda en hojas, chats y reportes, juntamos esos datos en una sola pantalla: pedidos, clientes o el avance de la operación. Después dejamos listas las acciones del día a día: filtrar, actualizar o abrir el detalle. Si lo usa más de una persona, cada quien ve lo suyo. Y si hay que sacar la información, va con exportación. La primera versión cubre el trabajo de todos los días; lo demás lo sumamos cuando ya lo estén usando. Think Deep.

### mvp

Pediste una app nueva. Vamos a armarla contigo. Antes de llenarla de pantallas, encontramos juntos la tarea que tiene que resolverse primero: quién entra, qué hace y qué recibe al terminar. Con eso armamos un recorrido corto: acceso, una pantalla principal y una acción completa. Crear, registrar o consultar. Una persona real lo usa y vemos dónde se atora. Después ajustamos y decidimos la siguiente pieza. La primera versión es chica, pero ya sirve. Think Deep.

### whatsapp

Pediste ordenar WhatsApp. Vamos a armarlo contigo. Primero vemos qué preguntan una y otra vez, y cuándo tienes que entrar tú. Armamos un flujo que recibe, responde lo útil y guarda lo necesario: opciones, horarios o el dato mínimo antes de pasarlo a una persona. Si se sale del camino, tu equipo lo toma. Queda claro qué respondió el flujo y qué sigue. Empezamos con un caso concreto; luego lo ampliamos si el volumen lo pide. Think Deep.

### webchat

Pediste un chat en tu sitio. Vamos a armarlo contigo. Alguien pregunta mientras mira tus servicios; el chat es el lugar para hacerlo. Definimos juntos qué se resuelve al momento y qué llega a tu equipo. Puede explicar lo básico, pedir contacto o el dato que falta para cotizar o agendar. Si no hay respuesta segura, no inventa: deja la conversación lista para una persona. Y cuidamos que no tape la página en el celular. Primero una conversación bien resuelta; luego sumamos más casos si hacen falta. Think Deep.

### inbox

Pediste poner orden en el inbox. Vamos a armarlo contigo. Cuando todo cae en la misma bandeja, lo importante se entierra. Primero separamos lo que sí es trabajo: consultas, soporte, facturas o pendientes. Después dejamos una regla por tipo: etiquetar, dejarlo listo o avisarle a alguien. Si hace falta criterio, lo toma tu equipo. Al final ves qué llegó, qué se atendió y qué sigue. Empezamos con una entrada y pocas reglas. Think Deep.

### rostro

Pediste reconocimiento facial. Vamos a armarlo contigo. Primero acordamos para qué: una entrada, un registro de llegada o una verificación. La cámara toma el intento y lo compara con los registros que ustedes autorizaron. Si coincide, deja pasar y queda el evento. Si no, alguien lo revisa. También dejamos claro quién administra la lista y qué alternativa hay si no se usa la cara. Empezamos con un acceso y lo probamos en el lugar. Think Deep.

### patron

Pediste detectar con cámara. Vamos a armarlo contigo. Primero elegimos el evento que sí importa: un objeto en una zona, movimiento fuera de horario o un conteo. La cámara observa y el sistema marca cuando se cumple la regla. Cada aviso trae dónde, cuándo y qué se vio. Probamos luz y falsos avisos en el lugar. Empezamos con una cámara o una zona. Si funciona, lo ampliamos. Think Deep.

### lista

Pediste validar contra una lista. Vamos a armarlo contigo. Primero definimos cuál lista manda y quién la actualiza: huéspedes, socios, empleados o pases temporales. Llega la consulta, busca el dato y responde: está, no está o hay que revisar. Queda cuándo se consultó. Si el nombre no cuadra, no forzamos el match. Después podemos sumar altas, bajas y la fuente que ya usas. Think Deep.

### otro

Trajiste algo que no cabe en una casilla, y está bien. Vamos a verlo contigo. Primero aterrizamos lo que hoy te cuesta tiempo, dinero o claridad. Luego el momento exacto en el que una herramienta ayuda: qué entra, qué se decide y qué resultado quieres ver. Con eso dibujamos un alcance chico que se pueda probar. Puede ser una página, una conexión o una función. También dejamos fuera lo que no hace falta para la primera entrega. El siguiente paso es una propuesta: qué construimos, qué necesitamos de ti y cómo sabremos que sirve. Think Deep.

---

## 4. Mapa guion → escenas (para SCENE_STARTS)

Cada clip: **hook** (título + primera frase) → **4 escenas** de contenido en `STORIES` de `build-clips.py` → **end** («Think Deep»).

| Clip | Bloque escena 1 (tras hook) | Escena 2 | Escena 3 | Escena 4 |
|------|-----------------------------|----------|----------|----------|
| panel | vista / datos juntos | acciones filtrar-actualizar | roles / cada quien | exportación + 1ª versión |
| mvp | tarea primero | recorrido corto | prueba persona real | siguiente pieza |
| whatsapp | preguntas repetidas | flujo recibe-responde | handoff equipo | caso concreto |
| webchat | pregunta en la página | qué resuelve al momento | no inventa / handoff | móvil sin tapar |
| inbox | se entierra lo importante | separar + reglas | criterios equipo | entrada pequeña |
| rostro | para qué el acceso | comparar registros | duda → revisión | prueba en lugar |
| patron | evento que importa | marca la regla | aviso con contexto | calibrar / ampliar |
| lista | qué lista manda | consulta → respuesta | no forzar match | altas/bajas |
| otro | qué cuesta hoy | momento de la herramienta | alcance chico | propuesta |

Anclar `SCENE_STARTS[i]` al **inicio hablado** de cada bloque, no a mitad de frase.

---

## 5. Ejemplo API ElevenLabs (Python)

```python
import json, os, urllib.request
from pathlib import Path

ROOT = Path("/home/SalvadorTD/Desktop/portafolio/video/proceso")
VOICE = "Cpm6N9BNC1M75bYS7kO1"
# scripts = dict id -> text from section 3 / vo-scripts.json

def gen(clip_id: str, text: str) -> None:
    out = ROOT / clip_id / "audio" / f"{clip_id}-vo.mp3"
    out.parent.mkdir(parents=True, exist_ok=True)
    body = json.dumps({
        "text": text,
        "model_id": "eleven_multilingual_v2",
        "voice_settings": {
            "stability": 0.46,
            "similarity_boost": 0.78,
            "style": 0.36,
            "use_speaker_boost": True,
            "speed": 0.85,
        },
    }).encode()
    req = urllib.request.Request(
        f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE}",
        data=body,
        headers={
            "xi-api-key": os.environ["ELEVENLABS_API_KEY"],
            "Content-Type": "application/json",
            "Accept": "audio/mpeg",
        },
        method="POST",
    )
    with urllib.request.urlopen(req) as res, open(out, "wb") as f:
        f.write(res.read())
```

Pausa post (idea): detectar fines de oración con `silencedetect` o insertar `anullsrc` de 0.15–0.2 s entre segmentos partido por `. `.

---

## 6. Comandos render

```bash
cd /home/SalvadorTD/Desktop/portafolio
source ~/.config/servimos/elevenlabs.env

# tras generar mp3 + actualizar build-clips.py:
python video/proceso/scripts/build-clips.py panel mvp whatsapp webchat inbox rostro patron lista otro

for id in panel mvp whatsapp webchat inbox rostro patron lista otro; do
  hyperframes check "video/proceso/$id"
  hyperframes check "video/proceso/$id-pc"
  hyperframes render -f 30 -q looks -o "public/video/proceso/$id.mp4" "video/proceso/$id"
  hyperframes render -f 30 -q looks -o "public/video/proceso/$id-pc.mp4" "video/proceso/$id-pc"
done

python video/proceso/scripts/make-posters.py
npm run build
git add -A video/proceso public/video/proceso
# commit + push (mensaje arriba)
```

---

## 7. Criterio de calidad (escucha)

- Se entiende sin subir volumen mental: hay aire entre ideas.
- Suena a equipo hablando al cliente, no a manual leído.
- Al cambiar de escena visual, la VO ya entró en esa idea (±0.3 s).
- `sitio` sigue igual en duración y archivo.
- Landing `/proceso` reproduce los mp4 nuevos (hard refresh).

---

## 8. Fuera de alcance

- Imágenes / stills (otro handoff).
- Cambiar copy on-screen de los mockups (salvo retiming).
- Regenerar `sitio-vo.mp3`.
- Rediseñar UI de Next (player, cue amarillo, etc.).
