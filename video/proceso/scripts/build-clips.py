#!/usr/bin/env python3
"""Build the Think Deep process films from one narrative model, in both aspect ratios."""
from __future__ import annotations

import argparse
import html
import json
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "sitio"
SYMBOL = (SOURCE / "assets" / "symbol.svg").read_text(encoding="utf-8").split("?>", 1)[-1].replace('id="think-deep-symbol"', "")
DURATION = {"sitio": 52.94}
IDS = ("sitio", "panel", "mvp", "whatsapp", "webchat", "inbox", "rostro", "patron", "lista", "otro")


def e(value: str) -> str:
    return html.escape(str(value), quote=True)


def window(title: str, body: str, label: str = "VISTA / DEMO") -> str:
    return f'''<div class="app-window reveal"><div class="app-top"><div class="app-dots"><i></i><i></i><i></i></div><span>{e(title)}</span><small>{e(label)}</small></div><div class="app-body">{body}</div></div>'''


def stat(label: str, value: str, trend: str = "") -> str:
    return f'<div class="stat reveal"><span>{e(label)}</span><strong>{e(value)}</strong><em>{e(trend)}</em></div>'


def row(left: str, middle: str, right: str, active: bool = False) -> str:
    return f'<div class="data-row reveal {"active" if active else ""}"><strong>{e(left)}</strong><span>{e(middle)}</span><b>{e(right)}</b></div>'


def flow(*steps: tuple[str, str]) -> str:
    items = []
    for i, (title, detail) in enumerate(steps, 1):
        items.append(f'<div class="flow-node reveal"><span class="node-index">{i:02}</span><div><strong>{e(title)}</strong><small>{e(detail)}</small></div><span class="node-light"></span></div>')
        if i < len(steps):
            items.append('<div class="flow-link reveal"><span></span></div>')
    return '<div class="flow-map">' + ''.join(items) + '</div>'


def thread(*messages: tuple[str, str]) -> str:
    bubbles = ''.join(f'<div class="message reveal {"reply" if who == "td" else "visitor"}"><span>{"THINK DEEP" if who == "td" else "VISITA"}</span><strong>{e(body)}</strong></div>' for who, body in messages)
    return '<div class="chat-layout"><div class="chat-phone reveal"><div class="phone-top"><span class="avatar-dot"></span><strong>Conversación</strong><em>● EN LÍNEA</em></div><div class="chat-body">' + bubbles + '</div><div class="chat-input"><span>Escribe un mensaje…</span><b>➤</b></div></div><div class="chat-side reveal"><span>RECORRIDO</span><strong>Pregunta → respuesta → siguiente paso</strong><div class="mini-progress"><i></i><i></i><i></i></div></div></div>'


def web(hero: str, sections: tuple[str, ...], cta: str) -> str:
    blocks = ''.join(f'<div class="web-section reveal"><span>0{i}</span><strong>{e(s)}</strong><b>↗</b></div>' for i, s in enumerate(sections, 1))
    return window("estudio.mx", f'<div class="web-hero reveal"><small>SITIO PUBLICADO</small><strong>{e(hero)}</strong><span>Una idea clara desde la primera pantalla.</span><b>{e(cta)} →</b></div><div class="web-list">{blocks}</div>', "PÁGINA")


def dashboard() -> str:
    return window("Operación de hoy", '<div class="stats">' + stat("PEDIDOS", "24", "+4 HOY") + stat("PENDIENTES", "06", "POR REVISAR") + '</div><div class="chart reveal"><span>ACTIVIDAD / SEMANA</span><div class="bars"><i style="--h:35%"></i><i style="--h:54%"></i><i style="--h:43%"></i><i style="--h:72%"></i><i style="--h:58%"></i><i style="--h:88%"></i><i style="--h:69%"></i></div></div><div class="rows">' + row("#128", "Nuevo pedido", "Pendiente", True) + row("#127", "Confirmado", "Listo") + '</div>')


def table(title: str, rows: tuple[tuple[str, str, str], ...]) -> str:
    lines = ''.join(row(*r, active=i == 0) for i, r in enumerate(rows))
    return window(title, f'<div class="table-head reveal"><span>REGISTRO</span><span>DETALLE</span><span>ESTADO</span></div><div class="rows">{lines}</div><div class="table-foot reveal"><span>FUENTE VERIFICADA</span><b>● ACTUALIZADO</b></div>')


def sheet(title: str, fields: tuple[tuple[str, str], ...], stamp: str) -> str:
    lines = ''.join(f'<div class="sheet-line reveal"><span>{e(a)}</span><strong>{e(b)}</strong></div>' for a, b in fields)
    return f'<div class="document reveal"><div class="document-meta">THINK DEEP / {e(stamp)}</div><h3>{e(title)}</h3><div class="document-rule"></div><div class="sheet-lines">{lines}</div><div class="document-seal reveal">{e(stamp)} <b>✓</b></div></div>'


def camera(title: str, status: str, face: bool = False) -> str:
    subject = '<div class="face-shape"><span></span><i></i></div>' if face else '<div class="object-shape"><i></i><span></span></div>'
    return f'<div class="camera reveal"><div class="camera-meta"><span>● LIVE / DEMO</span><strong>{e(title)}</strong><span>CAM 01</span></div><div class="camera-field"><div class="camera-grid"></div><div class="camera-zone">{subject}<span class="target-label">ZONA ACTIVA</span></div><div class="sweep"></div></div><div class="camera-status reveal"><span>EVENTO</span><strong>{e(status)}</strong><b>↗</b></div></div>'


def phone_journey() -> str:
    screens = (("01", "Entrar", "Acceso claro"), ("02", "Hacer", "Una tarea"), ("03", "Listo", "Resultado visible"))
    return '<div class="journey">' + ''.join(f'<div class="journey-screen reveal"><span>{n}</span><div class="screen-symbol">{n}</div><strong>{a}</strong><small>{b}</small></div>' for n, a, b in screens) + '</div>'


def responsive_chat() -> str:
    return '''<div class="responsive-demo"><div class="responsive-phone reveal"><div class="responsive-top"><span>estudio.mx</span><b>☰</b></div><div class="responsive-content"><small>SERVICIOS</small><strong>Encuentra tu siguiente paso.</strong><div class="responsive-service">Qué hacemos <b>↗</b></div><div class="responsive-service">Cómo trabajamos <b>↗</b></div></div><div class="responsive-widget reveal"><span>THINK DEEP / CHAT</span><strong>¿En qué te ayudamos?</strong><div class="responsive-answer">Quiero agendar una cita.</div><small>Escribe aquí… <b>➤</b></small></div></div><div class="responsive-side reveal"><span>PÁGINA + CONVERSACIÓN</span><strong>El contenido sigue a la vista.</strong><div><b>✓</b> La pregunta tiene lugar</div><div><b>✓</b> El contacto queda claro</div></div></div>'''


def lanes(*items: tuple[str, str]) -> str:
    return '<div class="lanes">' + ''.join(f'<div class="lane reveal"><span>{e(a)}</span><strong>{e(b)}</strong><div class="lane-line"></div></div>' for a, b in items) + '</div>'


# Each scene is (headline, explanation, outcome, visual HTML).
STORIES: dict[str, tuple[str, list[tuple[str, str, str, str]]]] = {
    "sitio": ("Sitio web", [
        ("Primero, la base", "Qué ofreces, a quién y qué debe quedar claro.", "Una portada que tiene una función", flow(("Oferta", "Qué haces"), ("Persona", "A quién ayudas"), ("Portada", "Idea principal"))),
        ("Una ruta para quien llega", "La visita entiende el negocio antes de decidir.", "Llega → entiende → contacta", web("Tu negocio, sin rodeos", ("Servicios", "Quiénes somos", "Contacto"), "Contactar")),
        ("Sale al mundo", "Una presencia usable, lista para compartir.", "Del borrador a una página publicada", window("Publicación", '<div class="publish-scene"><div class="publish-before reveal"><span>BORRADOR</span><strong>Vista privada</strong></div><div class="publish-arrow reveal">→</div><div class="publish-after reveal"><span>PUBLICADO</span><strong>tusitio.mx</strong><small>● Disponible</small></div></div><div class="publish-footer reveal">Compartir · Encontrar · Contactar</div>')),
        ("Se suma lo que ayude", "Formulario, ubicación o catálogo según el giro.", "Cada módulo responde a una necesidad", lanes(("01 / FORMULARIO", "Recibe una consulta"), ("02 / MAPA", "Ayuda a llegar"), ("03 / CATÁLOGO", "Muestra la oferta"))),
        ("Alcance claro", "La web resuelve presencia. Otras funciones se planean aparte.", "Una primera entrega entendible", sheet("Tu sitio", (("Incluye", "Portada + secciones"), ("Contacto", "Camino visible"), ("Opcional", "Módulos útiles")), "ALCANCE")),
    ]),
    "panel": ("Panel o tablero", [
        ("Todo a la vista", "Pedidos, clientes y pendientes en una sola pantalla.", "Menos búsqueda, más contexto", dashboard()),
        ("Del dato a la acción", "Filtra una fila, abre el detalle y cambia su estado.", "La información sirve para actuar", table("Pedidos / filtro activo", (("#128", "Nuevo pedido", "Por revisar"), ("#127", "Cliente confirmado", "Listo"), ("#126", "Pago registrado", "En curso")))),
        ("Cada quien ve lo suyo", "Los roles muestran lo necesario para cada tarea.", "Acceso claro para el equipo", flow(("Operación", "Actualiza pedidos"), ("Ventas", "Consulta clientes"), ("Dirección", "Ve el resumen"))),
        ("Listo para compartir", "El reporte sale cuando se necesita.", "Datos disponibles fuera del panel", sheet("Reporte de operación", (("Período", "Esta semana"), ("Pedidos", "24 registrados"), ("Formato", "Archivo exportable")), "REPORTE")),
    ]),
    "mvp": ("MVP o app nueva", [
        ("Una tarea primero", "Definimos a la persona, su acción y el resultado.", "El producto empieza con una utilidad", flow(("Usuario", "Quién entra"), ("Tarea", "Qué necesita hacer"), ("Resultado", "Qué debe recibir"))),
        ("Tres pasos usables", "Acceso, pantalla principal y una acción completa.", "Ya se puede probar el recorrido", phone_journey()),
        ("Se prueba con personas", "Una observación concreta muestra qué ajustar.", "Aprender antes de sumar funciones", window("Prueba de uso", '<div class="test-task reveal"><span>TAREA / 01</span><strong>Crear solicitud</strong><div class="test-progress"><i></i><i></i><i></i></div></div><div class="test-note reveal"><span>OBSERVACIÓN</span><strong>El siguiente paso no era claro.</strong><b>→ Ajustar etiqueta y orden.</b></div>')),
        ("Una versión con rumbo", "Priorizamos lo siguiente según el uso real.", "Pequeña, completa y mejorable", flow(("Construir", "Flujo esencial"), ("Probar", "Uso real"), ("Mejorar", "Siguiente decisión"))),
    ]),
    "whatsapp": ("Automatización de WhatsApp", [
        ("Preguntas que se repiten", "Detectamos lo que entra todos los días.", "La conversación empieza ordenada", thread(("visita", "¿Tienen horario?"), ("visita", "¿Hay disponibilidad?"), ("td", "Te ayudo con esas opciones."))),
        ("Un flujo útil", "Recibe, responde y registra lo necesario.", "Cada mensaje tiene un camino", flow(("Recibir", "Consulta entrante"), ("Orientar", "Opción o respuesta"), ("Registrar", "Dato para continuar"))),
        ("Cuando hace falta criterio", "El caso llega a una persona con contexto.", "El equipo conserva el control", sheet("Caso para el equipo", (("Consulta", "Disponibilidad"), ("Dato recibido", "Fecha solicitada"), ("Siguiente paso", "Responder personalmente")), "HANDOFF")),
        ("Un caso completo", "La persona recibe atención y el equipo ve lo pendiente.", "Sin dejar la charla perdida", lanes(("01 / ENTRA", "Pregunta nueva"), ("02 / FLUJO", "Dato reunido"), ("03 / EQUIPO", "Toma la conversación"))),
    ]),
    "webchat": ("Chat en tu web", [
        ("Dentro de la página", "La pregunta aparece justo donde surge.", "El sitio también puede escuchar", web("Encuentra lo que buscas", ("Servicios", "Preguntas frecuentes"), "Abrir chat")),
        ("Una respuesta útil", "El flujo responde lo conocido y pide el dato que falta.", "La visita puede seguir", thread(("visita", "¿Trabajan los sábados?"), ("td", "Sí, con cita previa."), ("visita", "Quiero agendar."))),
        ("El equipo recibe contexto", "La consulta y el contacto llegan resumidos.", "Sin empezar de cero", sheet("Nueva consulta web", (("Tema", "Agendar una cita"), ("Canal", "Chat del sitio"), ("Estado", "Requiere respuesta")), "LEAD")),
        ("Cómodo en el celular", "El chat acompaña sin tapar el contenido.", "La página sigue siendo usable", responsive_chat()),
    ]),
    "inbox": ("Correo o inbox", [
        ("Todo llega aquí", "Consultas, soporte y facturas comparten bandeja.", "Primero identificamos lo importante", table("Bandeja de entrada", (("Nuevo", "Consulta de servicio", "Sin asignar"), ("Soporte", "Duda de pedido", "Revisar"), ("Factura", "Comprobante", "Archivo")))),
        ("Reglas simples", "Un criterio visible decide etiqueta y responsable.", "Menos clasificación a mano", flow(("Entra correo", "Mensaje nuevo"), ("Se clasifica", "Consulta / soporte"), ("Se asigna", "Persona indicada"))),
        ("Pendientes visibles", "Cada caso muestra estado y siguiente responsable.", "Sabes qué falta atender", lanes(("POR REVISAR", "Consulta nueva"), ("EN CURSO", "Soporte asignado"), ("RESUELTO", "Respuesta enviada"))),
        ("Empieza pequeño", "Una entrada y pocas reglas fáciles de medir.", "Un inbox sostenible", sheet("Regla inicial", (("Si contiene", "Solicitud nueva"), ("Entonces", "Etiqueta + aviso"), ("Revisión", "Equipo responsable")), "AUTOMATIZACIÓN")),
    ]),
    "rostro": ("Reconocimiento facial", [
        ("Un acceso definido", "La cámara verifica en un punto concreto.", "Primero se acuerda dónde usarlo", camera("Acceso principal", "Captura iniciada", True)),
        ("Comparar con permiso", "Solo se consulta el registro autorizado.", "Resultado claro para supervisión", window("Verificación", '<div class="match-layout"><div class="match-face reveal"><span>CAPTURA</span><div class="match-outline"><i></i></div></div><div class="match-arrow reveal">↔</div><div class="match-record reveal"><span>REGISTRO AUTORIZADO</span><strong>Coincidencia</strong><b>✓ Verificado</b></div></div>')),
        ("Si hay duda, se revisa", "Una persona conserva la decisión en casos no claros.", "La excepción tiene camino", flow(("Sin coincidencia", "Resultado dudoso"), ("Revisión", "Responsable humano"), ("Registro", "Decisión trazable"))),
        ("Se prueba en el lugar", "Luz, distancia y alternativa de acceso importan.", "El flujo se valida en condiciones reales", sheet("Prueba de acceso", (("Ambiente", "Luz real"), ("Supervisión", "Persona responsable"), ("Alternativa", "Acceso manual")), "PILOTO")),
    ]),
    "patron": ("Detección con cámara", [
        ("Elegimos la zona", "Se define exactamente qué debe observarse.", "Una cámara, un evento útil", camera("Zona de carga", "Zona delimitada")),
        ("Se detecta el evento", "Movimiento u objeto dentro de la regla acordada.", "La señal tiene contexto", camera("Zona de carga", "Objeto en zona activa")),
        ("Llega un aviso verificable", "Hora, lugar e imagen ayudan a revisar.", "Menos alertas sin explicación", sheet("Evento detectado", (("Hora", "14:20"), ("Lugar", "Zona de carga"), ("Acción", "Revisar clip")), "ALERTA")),
        ("Primero se calibra", "Probamos falsos avisos y cambios de luz.", "La cobertura crece si funciona", flow(("Una cámara", "Caso concreto"), ("Ajustar", "Reducir falsos avisos"), ("Ampliar", "Más zonas si conviene"))),
    ]),
    "lista": ("Validación contra lista", [
        ("Una fuente confiable", "Definimos quién mantiene la lista autorizada.", "La respuesta parte de un registro claro", table("Lista autorizada", (("ID 102", "Acceso vigente", "Activo"), ("ID 103", "Revisión manual", "Pendiente"), ("ID 104", "Pase temporal", "Activo")))),
        ("Se consulta un dato", "La búsqueda muestra de dónde viene el resultado.", "Sin adivinar coincidencias", window("Consulta de registro", '<div class="search-bar reveal"><span>⌕</span><strong>ID 102</strong><b>BUSCAR</b></div><div class="search-result reveal"><span>COINCIDENCIA EN FUENTE</span><strong>Registro encontrado</strong><small>Acceso vigente · ID 102</small></div>')),
        ("Tres resultados claros", "Encontrado, no encontrado o a revisión.", "La excepción no se fuerza", flow(("Encontrado", "Dato coincide"), ("No encontrado", "Sin registro"), ("Revisión", "Dato incompleto"))),
        ("Cambios controlados", "Altas, bajas y consultas quedan trazables.", "La lista sigue siendo la referencia", sheet("Historial de lista", (("Fuente", "Registro vigente"), ("Cambio", "Alta / baja"), ("Consulta", "Con fecha y origen")), "TRAZABILIDAD")),
    ]),
    "otro": ("Proyecto a medida", [
        ("Primero el problema", "Aterrizamos qué cuesta tiempo o claridad.", "La solución empieza por entender", lanes(("HOY", "Proceso manual"), ("FRICCIÓN", "Paso que se repite"), ("META", "Resultado deseado"))),
        ("Ubicamos el momento", "Qué entra, qué se decide y qué debe salir.", "Un flujo que se puede explicar", flow(("Entrada", "Dato o solicitud"), ("Decisión", "Regla o persona"), ("Resultado", "Acción visible"))),
        ("Acotamos la primera pieza", "Dejamos fuera lo que todavía no hace falta.", "Un alcance que sí se puede probar", sheet("Primera entrega", (("Incluye", "Un flujo completo"), ("Prueba", "Caso real"), ("Después", "Siguiente mejora")), "ALCANCE")),
        ("Una propuesta concreta", "Qué se construye y cómo sabremos que funciona.", "Claridad antes de escribir código", sheet("Propuesta de trabajo", (("Objetivo", "Problema definido"), ("Entrega", "Resultado verificable"), ("Inicio", "Material necesario")), "PROPUESTA")),
    ]),
}

CSS = r'''
@font-face{font-family:Syne;src:url(fonts/syne-latin-700-normal.woff2) format("woff2");font-weight:700;font-display:block}
@font-face{font-family:Syne;src:url(fonts/syne-latin-800-normal.woff2) format("woff2");font-weight:800;font-display:block}
@font-face{font-family:DM;src:url(fonts/dm-sans-latin-400-normal.woff2) format("woff2");font-weight:400;font-display:block}
@font-face{font-family:DM;src:url(fonts/dm-sans-latin-700-normal.woff2) format("woff2");font-weight:700;font-display:block}
*{box-sizing:border-box}html,body{margin:0;background:#0a0a0b;color:#f4f2ec;font-family:DM,sans-serif;overflow:hidden}
#root{position:relative;overflow:hidden;background:#0a0a0b;width:var(--w);height:var(--h)}
.ambient{position:absolute;inset:0;pointer-events:none;overflow:hidden}.ambient-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(212,180,74,.075) 2px,transparent 2px),linear-gradient(90deg,rgba(212,180,74,.075) 2px,transparent 2px);background-size:110px 110px;mask-image:linear-gradient(to bottom,transparent 5%,#000 45%,#000 88%,transparent)}
.ambient-halo{position:absolute;width:900px;height:900px;right:-250px;bottom:-220px;border-radius:50%;background:radial-gradient(circle,rgba(212,180,74,.25),transparent 68%)}
.ambient-ring{position:absolute;width:730px;height:730px;border:2px solid rgba(212,180,74,.14);border-radius:50%;right:-210px;bottom:-210px}.ambient-rule{position:absolute;left:55px;bottom:56px;width:calc(100% - 110px);height:2px;background:linear-gradient(90deg,#d4b44a,rgba(212,180,74,.12))}
.scene{position:absolute;inset:0;opacity:0;pointer-events:none}.stage{height:100%;display:flex;flex-direction:column;gap:30px;padding:130px 62px 84px}.left{display:contents}.copy{flex:0 0 auto}.eyebrow{display:flex;align-items:center;gap:20px;color:#d4b44a;font:700 27px Syne;letter-spacing:.08em;text-transform:uppercase}.eyebrow i{display:inline-grid;place-items:center;width:58px;height:58px;border:2px solid #d4b44a;border-radius:50%;font-style:normal;background:rgba(212,180,74,.14)}h2{font:800 76px/1.02 Syne;margin:25px 0 22px;letter-spacing:-.04em;max-width:940px}.lede{font:400 35px/1.35 DM;margin:0;color:#f4f2ec;max-width:890px}.scene-art{order:2;flex:1;min-height:0;display:flex;align-items:stretch;justify-content:center}.scene-art>*{width:100%;height:100%}.takeaway{order:3;flex:0 0 auto;display:flex;flex-direction:column;gap:10px;padding:22px 28px;border-left:6px solid #d4b44a;background:rgba(212,180,74,.11);border-radius:0 20px 20px 0}.takeaway span{font:700 23px Syne;color:#d4b44a;letter-spacing:.1em}.takeaway strong{font:700 34px/1.16 Syne}
.hook-stage,.end-stage{height:100%;display:flex;flex-direction:column;justify-content:space-between;padding:130px 70px 130px}.hook-kicker{font:700 30px Syne;color:#d4b44a;letter-spacing:.14em}.hook-title{font:800 128px/.95 Syne;letter-spacing:-.06em;max-width:940px;margin:30px 0}.hook-summary{font:400 40px DM;max-width:850px}.hook-mark{align-self:center;width:650px;height:520px;filter:drop-shadow(0 0 55px rgba(212,180,74,.3))}.hook-mark svg,.end-mark svg{width:100%;height:100%;object-fit:contain}.hook-bottom{display:flex;justify-content:space-between;color:#d4b44a;font:700 28px Syne;letter-spacing:.08em}.end-stage{align-items:center;justify-content:center;gap:65px;text-align:center}.end-mark{width:560px;height:440px}.end-word{font:800 120px Syne;letter-spacing:-.06em}.end-line{font:400 31px DM;color:#f4f2ec}
.app-window,.document,.camera,.chat-phone{background:#151517;border:3px solid rgba(212,180,74,.52);box-shadow:0 34px 90px rgba(0,0,0,.35),inset 0 0 85px rgba(212,180,74,.055);border-radius:34px;overflow:hidden}.app-window{display:flex;flex-direction:column}.app-top{display:flex;align-items:center;gap:25px;min-height:86px;padding:20px 26px;background:#1c1c1f;border-bottom:2px solid rgba(244,242,236,.14);font:700 28px Syne}.app-top small{margin-left:auto;color:#d4b44a;font:700 20px Syne}.app-dots{display:flex;gap:9px}.app-dots i{width:16px;height:16px;background:#d4b44a;border-radius:50%}.app-body{padding:32px;display:flex;flex-direction:column;gap:22px;flex:1;min-height:0}.stats{display:grid;grid-template-columns:1fr 1fr;gap:22px}.stat{min-height:190px;padding:22px;border:2px solid rgba(212,180,74,.46);border-radius:24px;background:rgba(212,180,74,.12);display:flex;flex-direction:column;justify-content:space-between}.stat span,.stat em{font:700 22px Syne;color:#d4b44a;letter-spacing:.05em;font-style:normal}.stat strong{font:800 84px Syne}.chart{flex:1;min-height:260px;padding:22px;border:2px solid rgba(244,242,236,.17);border-radius:24px;display:flex;flex-direction:column}.chart>span{font:700 23px Syne;color:#d4b44a}.bars{flex:1;display:flex;align-items:flex-end;gap:16px;padding:28px 15px 0}.bars i{flex:1;height:var(--h);max-height:100%;background:linear-gradient(#f0c94a,#7d6424);border-radius:13px 13px 0 0}.rows{display:flex;flex-direction:column;gap:12px;flex:1}.data-row{display:grid;grid-template-columns:1fr 1.45fr 1.2fr;align-items:center;gap:14px;min-height:87px;padding:15px 18px;background:#1c1c1f;border:2px solid rgba(244,242,236,.16);border-radius:16px;font:400 24px DM}.data-row strong,.data-row b{font-weight:700}.data-row b{text-align:right;color:#d4b44a}.data-row.active{background:rgba(212,180,74,.13);border-color:#d4b44a}.table-head+.rows{justify-content:space-evenly}.table-head+.rows .data-row{min-height:135px}.table-head{display:grid;grid-template-columns:1fr 1.45fr 1.2fr;gap:14px;padding:18px;font:700 20px Syne;color:#d4b44a}.table-foot{margin-top:auto;display:flex;justify-content:space-between;font:700 22px Syne;color:#d4b44a}
.flow-map{height:100%;display:flex;flex-direction:column;justify-content:space-around;gap:8px}.flow-node{display:flex;align-items:center;gap:25px;min-height:235px;padding:30px 36px;background:#151517;border:3px solid rgba(244,242,236,.22);border-radius:30px;box-shadow:inset 0 0 60px rgba(212,180,74,.08)}.flow-node:nth-child(4n+1){border-color:#d4b44a;background:rgba(212,180,74,.13)}.node-index{font:800 76px Syne;color:#d4b44a}.flow-node>div{display:flex;flex-direction:column;gap:14px}.flow-node strong{font:700 45px Syne}.flow-node small{font:400 28px DM;color:#f4f2ec}.node-light{margin-left:auto;width:25px;height:25px;border-radius:50%;background:#d4b44a;box-shadow:0 0 35px #d4b44a}.flow-link{flex:1;min-height:40px;margin-left:80px}.flow-link span{display:block;height:100%;width:3px;background:#d4b44a;position:relative}.flow-link span:after{content:'⌄';position:absolute;bottom:-24px;left:-11px;color:#d4b44a;font:700 35px Syne}
.chat-layout{display:flex;flex-direction:column;gap:22px}.chat-phone{height:78%;display:flex;flex-direction:column}.phone-top{display:flex;align-items:center;gap:18px;min-height:100px;padding:24px;background:#1c1c1f}.phone-top strong{font:700 31px Syne}.phone-top em{margin-left:auto;color:#d4b44a;font:700 18px Syne}.avatar-dot{width:52px;height:52px;border-radius:50%;background:#d4b44a}.chat-body{flex:1;padding:30px;display:flex;flex-direction:column;justify-content:space-evenly;gap:20px}.message{padding:24px 28px;max-width:88%;display:flex;flex-direction:column;gap:10px;border-radius:24px;background:#1c1c1f;border:2px solid rgba(244,242,236,.22)}.message.reply{align-self:flex-end;background:rgba(212,180,74,.18);border-color:#d4b44a}.message span{font:700 19px Syne;color:#d4b44a}.message strong{font:700 33px/1.15 Syne}.chat-input{height:85px;background:#1c1c1f;display:flex;justify-content:space-between;align-items:center;padding:20px 35px;font:400 24px DM}.chat-input b{color:#d4b44a}.chat-side{flex:1;display:flex;align-items:center;justify-content:space-between;gap:20px;padding:22px 30px;background:rgba(212,180,74,.1);border:2px solid rgba(212,180,74,.45);border-radius:22px}.chat-side span{font:700 19px Syne;color:#d4b44a}.chat-side strong{font:700 29px Syne}.mini-progress{display:flex;gap:7px}.mini-progress i{width:20px;height:20px;border-radius:50%;background:#d4b44a}
.web-hero{min-height:45%;padding:38px;border-radius:22px;background:radial-gradient(circle at 80% 30%,rgba(212,180,74,.25),transparent 47%),#24221d;display:flex;flex-direction:column;justify-content:space-between;gap:18px}.web-hero small{font:700 22px Syne;color:#d4b44a}.web-hero strong{font:800 56px/1.05 Syne;max-width:760px}.web-hero span{font:400 28px DM}.web-hero b{display:inline-flex;align-self:flex-start;padding:20px 30px;background:#d4b44a;color:#0a0a0b;border-radius:999px;font:700 25px Syne}.web-list{flex:1;display:flex;flex-direction:column;gap:13px}.web-section{flex:1;display:flex;align-items:center;gap:20px;padding:14px 25px;border:2px solid rgba(244,242,236,.18);border-radius:18px}.web-section span{color:#d4b44a;font:800 28px Syne}.web-section strong{font:700 35px Syne}.web-section b{margin-left:auto;color:#d4b44a;font:700 32px Syne}
.document{padding:55px;display:flex;flex-direction:column}.document-meta{font:700 22px Syne;letter-spacing:.1em;color:#d4b44a}.document h3{font:800 68px/1.05 Syne;margin:55px 0 28px}.document-rule{height:5px;background:#d4b44a;width:100%}.sheet-lines{flex:1;display:flex;flex-direction:column;justify-content:space-around}.sheet-line{display:flex;flex-direction:column;gap:12px;padding:24px 0;border-bottom:2px solid rgba(244,242,236,.18)}.sheet-line span{font:700 22px Syne;color:#d4b44a}.sheet-line strong{font:700 40px Syne}.document-seal{align-self:flex-end;display:flex;align-items:center;gap:22px;font:700 24px Syne;color:#d4b44a}.document-seal b{display:grid;place-items:center;width:65px;height:65px;border:3px solid #d4b44a;border-radius:50%}
.camera{display:flex;flex-direction:column}.camera-meta{min-height:90px;display:flex;align-items:center;justify-content:space-between;gap:20px;padding:25px 30px;font:700 23px Syne;color:#d4b44a}.camera-meta strong{font-size:28px;color:#f4f2ec}.camera-field{flex:1;position:relative;min-height:0;overflow:hidden;background:radial-gradient(circle at 55% 70%,rgba(212,180,74,.21),transparent 45%),linear-gradient(145deg,#1c1c1f,#101112)}.camera-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(244,242,236,.09) 2px,transparent 2px),linear-gradient(90deg,rgba(244,242,236,.09) 2px,transparent 2px);background-size:75px 75px}.camera-zone{position:absolute;inset:14% 14%;border:4px solid #d4b44a;border-radius:25px;display:grid;place-items:center}.camera-zone:before,.camera-zone:after{content:'';position:absolute;width:130px;height:25px;border-top:6px solid #d4b44a;top:-7px}.camera-zone:before{left:-7px}.camera-zone:after{right:-7px}.face-shape{width:310px;height:410px;border:5px solid rgba(244,242,236,.68);border-radius:45% 45% 38% 38%;position:relative}.face-shape span{position:absolute;left:19%;right:19%;top:48%;border-top:4px solid rgba(244,242,236,.7)}.face-shape i{position:absolute;bottom:-20px;left:-45px;width:400px;height:140px;border:4px solid rgba(244,242,236,.65);border-radius:50%}.object-shape{width:400px;height:330px;border:5px solid rgba(244,242,236,.7);border-radius:30px;position:relative;transform:rotate(-8deg)}.object-shape i{position:absolute;top:20%;left:20%;width:55%;height:55%;border:4px solid #d4b44a;border-radius:16px}.target-label{position:absolute;bottom:15px;left:20px;font:700 21px Syne;color:#d4b44a}.sweep{position:absolute;top:32%;left:7%;width:86%;height:5px;background:#d4b44a;box-shadow:0 0 28px #d4b44a}.camera-status{display:flex;align-items:center;gap:22px;min-height:110px;padding:25px 30px;background:rgba(212,180,74,.15)}.camera-status span{font:700 21px Syne;color:#d4b44a}.camera-status strong{font:700 34px Syne}.camera-status b{margin-left:auto;font:700 40px Syne;color:#d4b44a}
.journey{display:flex;flex-direction:column;gap:18px;justify-content:space-evenly}.journey-screen{display:flex;align-items:center;gap:25px;flex:1;max-height:350px;padding:28px;border:3px solid rgba(212,180,74,.55);border-radius:36px;background:#151517}.journey-screen>span{font:800 50px Syne;color:#d4b44a}.screen-symbol{width:110px;height:110px;border:3px solid #d4b44a;border-radius:25px;display:grid;place-items:center;font:800 46px Syne;color:#d4b44a;background:rgba(212,180,74,.12)}.journey-screen strong{font:800 44px Syne}.journey-screen small{margin-left:auto;font:400 26px DM}.lanes{display:flex;flex-direction:column;gap:18px;justify-content:space-evenly}.lane{flex:1;max-height:360px;padding:30px 38px;border:3px solid rgba(212,180,74,.5);border-radius:30px;background:#151517;display:flex;flex-direction:column;justify-content:space-between}.lane span{font:700 24px Syne;color:#d4b44a}.lane strong{font:800 44px Syne}.lane-line{height:5px;background:#d4b44a;width:65%}
.publish-scene{flex:1;display:flex;flex-direction:column;justify-content:space-evenly;gap:20px}.publish-before,.publish-after{min-height:260px;padding:35px;border:3px solid rgba(244,242,236,.35);border-radius:25px;display:flex;flex-direction:column;justify-content:space-around}.publish-after{border-color:#d4b44a;background:rgba(212,180,74,.13)}.publish-before span,.publish-after span{font:700 23px Syne;color:#d4b44a}.publish-before strong,.publish-after strong{font:800 44px Syne}.publish-after small{font:700 24px Syne;color:#d4b44a}.publish-arrow{text-align:center;font:800 90px Syne;color:#d4b44a;transform:rotate(90deg)}.publish-footer{padding:22px;text-align:center;font:700 29px Syne;color:#d4b44a}
.test-task,.test-note{padding:40px;border:2px solid #d4b44a;border-radius:25px;display:flex;flex-direction:column;justify-content:space-around;gap:25px;background:rgba(212,180,74,.12);flex:1}.test-task span,.test-note span{color:#d4b44a;font:700 22px Syne}.test-task strong,.test-note strong{font:700 43px Syne}.test-note b{font:700 27px Syne}.test-progress{display:flex;gap:20px}.test-progress i{height:10px;flex:1;background:#d4b44a;border-radius:10px}.test-progress i:last-child{opacity:.4}
.match-layout{height:100%;display:flex;flex-direction:column;justify-content:space-evenly;gap:20px}.match-face,.match-record{flex:1;padding:35px;border:3px solid #d4b44a;border-radius:25px;display:flex;flex-direction:column;justify-content:space-around;background:rgba(212,180,74,.1)}.match-face span,.match-record span{font:700 21px Syne;color:#d4b44a}.match-outline{text-align:center;font:800 160px Syne;color:#d4b44a}.match-arrow{text-align:center;font:800 80px Syne;color:#d4b44a}.match-record strong{font:800 47px Syne}.match-record b{font:700 27px Syne;color:#d4b44a}.search-bar{display:flex;align-items:center;gap:20px;padding:30px;border:3px solid #d4b44a;border-radius:28px}.search-bar span{font:800 60px Syne;color:#d4b44a}.search-bar strong{font:700 42px Syne}.search-bar b{margin-left:auto;font:700 25px Syne;color:#d4b44a}.search-result{flex:1;padding:40px;border:3px solid rgba(212,180,74,.45);border-radius:28px;background:rgba(212,180,74,.13);display:flex;flex-direction:column;justify-content:space-evenly}.search-result span{font:700 22px Syne;color:#d4b44a}.search-result strong{font:800 58px Syne}.search-result small{font:400 31px DM}
.match-outline{position:relative;width:180px;height:220px;margin:auto;border:5px solid #d4b44a;border-radius:48% 48% 38% 38%;font-size:0}.match-outline:after{content:'';position:absolute;width:260px;height:80px;border:5px solid #d4b44a;border-radius:50%;left:-45px;bottom:-30px}.match-outline i{position:absolute;left:25%;right:25%;top:48%;border-top:4px solid #d4b44a}
.responsive-demo{display:flex;flex-direction:column;gap:22px;align-items:stretch;justify-content:center}.responsive-phone{position:relative;flex:1;min-height:0;display:flex;flex-direction:column;border:6px solid #d4b44a;border-radius:44px;background:#171719;overflow:hidden;box-shadow:0 30px 90px rgba(0,0,0,.4)}.responsive-top{display:flex;justify-content:space-between;align-items:center;padding:24px 34px;border-bottom:2px solid rgba(212,180,74,.35);font:700 25px Syne}.responsive-top b{color:#d4b44a}.responsive-content{display:flex;flex-direction:column;gap:30px;padding:38px 36px}.responsive-content small{font:700 23px Syne;color:#d4b44a}.responsive-content strong{font:800 48px/1.08 Syne}.responsive-service{display:flex;justify-content:space-between;border-bottom:2px solid rgba(212,180,74,.4);padding:14px 0;font:700 27px Syne}.responsive-service b{color:#d4b44a}.responsive-widget{margin:auto 25px 28px;padding:28px;border:3px solid #d4b44a;border-radius:28px;background:#242115;box-shadow:0 15px 40px rgba(0,0,0,.35)}.responsive-widget>span,.responsive-side>span{font:700 21px Syne;color:#d4b44a}.responsive-widget>strong{display:block;margin:15px 0;font:800 35px Syne}.responsive-answer{padding:16px;border-radius:15px;background:#111112;font:400 24px DM}.responsive-widget>small{display:flex;justify-content:space-between;margin-top:20px;color:#aaa;font:400 21px DM}.responsive-widget b,.responsive-side b{color:#d4b44a}.responsive-side{min-height:190px;padding:26px 30px;border:3px solid rgba(212,180,74,.45);border-radius:28px;background:#151517;display:flex;flex-direction:column;justify-content:space-around;gap:9px}.responsive-side strong{font:800 33px Syne}.responsive-side div{font:400 24px DM}
'''

DESKTOP_CSS = r'''
.stage{display:grid;grid-template-columns:minmax(0,.39fr) minmax(0,.61fr);gap:60px;padding:120px 80px 76px}.left{display:flex;flex-direction:column;justify-content:space-between;min-width:0}.takeaway,.scene-art{order:initial}.copy{flex:initial}.eyebrow{font-size:24px}h2{font-size:83px;margin:52px 0 35px;max-width:670px}.lede{font-size:35px;max-width:620px}.takeaway{padding:26px}.takeaway strong{font-size:34px}.scene-art{min-height:0}.flow-map{flex-direction:row;align-items:center;gap:8px}.flow-node{min-height:0;height:78%;flex:1;flex-direction:column;align-items:flex-start;justify-content:center;gap:28px;padding:24px}.flow-node strong{font-size:31px}.flow-node small{font-size:23px}.node-index{font-size:64px}.node-light{display:none}.flow-link{min-height:0;margin:0;flex:0 0 35px}.flow-link span{height:3px;width:35px}.flow-link span:after{content:'›';top:-26px;bottom:auto;left:20px;font-size:40px}.chat-layout{flex-direction:row}.chat-phone{height:100%;width:67%}.chat-side{height:100%;flex-direction:column;justify-content:center;align-items:flex-start}.message strong{font-size:29px}.document h3{font-size:57px;margin:25px 0}.sheet-line{flex-direction:row;align-items:center;justify-content:space-between}.sheet-line strong{font-size:34px}.camera-zone{inset:11% 18%}.journey{flex-direction:row}.journey-screen{max-height:none;flex-direction:column;align-items:flex-start;justify-content:center}.journey-screen small{margin:0}.lanes{flex-direction:row}.lane{max-height:none}.publish-scene{flex-direction:row;align-items:center}.publish-before,.publish-after{flex:1;min-height:390px}.publish-arrow{transform:none}.match-layout{flex-direction:row;align-items:center}.match-face,.match-record{height:80%}.match-arrow{font-size:70px}.hook-stage{display:grid;grid-template-columns:1fr 1fr;align-items:center;padding:110px 85px}.hook-copy{grid-column:1}.hook-title{font-size:130px;max-width:900px}.hook-mark{grid-column:2;grid-row:1 / span 2;width:660px;height:540px}.hook-bottom{grid-column:1 / -1;align-self:end}.end-stage{flex-direction:row}.end-mark{width:600px;height:480px}.end-word{font-size:135px}.app-body{gap:17px}.stats{gap:16px}.stat{min-height:130px}.stat strong{font-size:65px}.chart{min-height:150px}.bars{padding-top:10px}.data-row{min-height:65px}.web-hero{min-height:38%;padding:25px}.web-hero strong{font-size:45px}.web-list{flex-direction:row}.web-section{flex:1;align-items:flex-start;flex-direction:column;justify-content:center}.web-section strong{font-size:27px}.web-section b{margin:0}.ambient-rule{left:80px;bottom:43px;width:calc(100% - 160px)}
.lane,.journey-screen{min-width:0;padding:25px}.lane strong,.journey-screen strong{font-size:34px;line-height:1.06;overflow-wrap:anywhere}.lane span{font-size:20px}.journey-screen small{font-size:22px}.responsive-demo{flex-direction:row;align-items:stretch;gap:30px}.responsive-phone{flex:0 0 52%}.responsive-side{flex:1;min-width:0;justify-content:center;gap:32px;padding:35px}.responsive-side strong{font-size:42px}.responsive-side div{font-size:27px}.responsive-content{gap:22px;padding:28px}.responsive-content strong{font-size:36px}.responsive-service{font-size:21px}.responsive-widget{padding:20px}.responsive-widget>strong{font-size:28px}.match-outline{width:130px;height:170px}.match-outline:after{width:200px;left:-40px;height:60px}
'''


def render_scene(idx: int, item: tuple[str, str, str, str]) -> str:
    title, text, result, art = item
    return f'''<section class="scene scene-{idx}" aria-label="{e(title)}"><div class="stage"><div class="left"><div class="copy"><div class="eyebrow reveal"><i>{idx:02}</i><span>THINK DEEP / PROCESO</span></div><h2 class="reveal">{e(title)}</h2><p class="lede reveal">{e(text)}</p></div><div class="takeaway reveal"><span>LO QUE QUEDA CLARO</span><strong>{e(result)}</strong></div></div><div class="scene-art">{art}</div></div></section>'''


def build_html(clip_id: str, desktop: bool) -> str:
    name, scenes = STORIES[clip_id]
    duration = DURATION.get(clip_id, 44.0)
    width, height = ((1920, 1080) if desktop else (1080, 1920))
    interval = 9.0 if clip_id == "sitio" else 9.0
    end_start = 48.0 if clip_id == "sitio" else 39.0
    starts = [3.0 + interval * i for i in range(len(scenes))]
    scenes_html = ''.join(render_scene(i + 1, s) for i, s in enumerate(scenes))
    audio = f'<audio id="site-voice" data-start="0" data-duration="{duration}" data-track-index="3" data-volume="1" src="audio/sitio-vo.mp3" preload="auto"></audio>' if clip_id == "sitio" else ''
    timeline = ['const tl = gsap.timeline({paused:true});', 'const scenes = [...document.querySelectorAll(".scene")];', 'tl.fromTo(scenes[0],{opacity:0},{opacity:1,duration:.5,ease:"power2.out"},0);']
    all_starts = [0.0, *starts, end_start]
    for n, start in enumerate(all_starts):
        selector = '.scene-hook' if n == 0 else (f'.scene-{n}' if n <= len(scenes) else '.scene-end')
        timeline.append(f'tl.fromTo("{selector} .reveal",{{opacity:0,y:35,scale:.97}},{{opacity:1,y:0,scale:1,duration:.7,stagger:.16,ease:"power3.out"}}, {start + .35:.2f});')
        if n > 0:
            prev = '.scene-hook' if n == 1 else f'.scene-{n-1}'
            timeline.append(f'tl.to("{prev}",{{opacity:0,duration:.55,ease:"power2.inOut"}}, {start:.2f});')
            timeline.append(f'tl.fromTo("{selector}",{{opacity:0}},{{opacity:1,duration:.55,ease:"power2.inOut"}}, {start:.2f});')
    timeline.append('tl.fromTo(".ambient-halo",{scale:.82,opacity:.55},{scale:1.08,opacity:.95,duration:9,ease:"sine.inOut",yoyo:true,repeat:4},0);')
    timeline.append('tl.fromTo(".ambient-ring",{scale:.85,opacity:.25},{scale:1.1,opacity:.7,duration:7,ease:"sine.inOut",yoyo:true,repeat:5},0);')
    if clip_id in ("rostro", "patron"):
        timeline.append('tl.fromTo(".sweep",{y:-100,opacity:.2},{y:240,opacity:.9,duration:3,ease:"sine.inOut",yoyo:true,repeat:1},7);')
    timeline.append('window.__timelines = window.__timelines || {}; window.__timelines.main = tl;')
    js = '\n'.join(timeline)
    css = CSS + (DESKTOP_CSS if desktop else '')
    return f'''<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width={width},height={height}"><title>Think Deep — {e(name)}</title><script src="vendor/gsap.min.js"></script><style>html,body{{width:{width}px;height:{height}px}}:root{{--w:{width}px;--h:{height}px}}{css}</style></head><body><div id="root" data-composition-id="main" data-start="0" data-duration="{duration}" data-width="{width}" data-height="{height}" data-fps="30"><div class="ambient" data-layout-ignore><div class="ambient-grid"></div><div class="ambient-halo"></div><div class="ambient-ring"></div><div class="ambient-rule"></div></div><section class="scene scene-hook"><div class="hook-stage"><div class="hook-copy"><p class="hook-kicker reveal">THINK DEEP / EN BREVE</p><h1 class="hook-title reveal">{e(name)}</h1><p class="hook-summary reveal">Así se ve el trabajo, paso a paso.</p></div><div class="hook-mark reveal">{SYMBOL}</div><div class="hook-bottom reveal"><span>ESTUDIO DIGITAL</span><span>0{len(scenes)} IDEAS → UN RESULTADO</span></div></div></section>{scenes_html}<section class="scene scene-end"><div class="end-stage"><div class="end-mark reveal">{SYMBOL}</div><div><p class="end-word reveal">think deep</p><p class="end-line reveal">Claridad antes de construir.</p></div></div></section>{audio}</div><script>{js}</script></body></html>'''


def write_comp(clip_id: str, desktop: bool) -> Path:
    name = clip_id + ("-pc" if desktop else "")
    dest = ROOT / name
    dest.mkdir(exist_ok=True)
    for folder in ("fonts", "vendor"):
        target = dest / folder
        if not target.exists():
            shutil.copytree(SOURCE / folder, target)
    assets = dest / "assets"
    assets.mkdir(exist_ok=True)
    if not (assets / "symbol.svg").exists():
        shutil.copy2(SOURCE / "assets" / "symbol.svg", assets / "symbol.svg")
    if clip_id == "sitio" and desktop:
        audio = dest / "audio"
        audio.mkdir(exist_ok=True)
        if not (audio / "sitio-vo.mp3").exists():
            shutil.copy2(SOURCE / "audio" / "sitio-vo.mp3", audio / "sitio-vo.mp3")
    duration = DURATION.get(clip_id, 44.0)
    width, height = ((1920, 1080) if desktop else (1080, 1920))
    (dest / "index.html").write_text(build_html(clip_id, desktop), encoding="utf-8")
    (dest / "meta.json").write_text(json.dumps({"id": name, "name": f"Think Deep — {clip_id} ({'PC' if desktop else 'móvil'})", "width": width, "height": height, "fps": 30, "duration": duration}, indent=2, ensure_ascii=False) + "\n")
    if not (dest / "hyperframes.json").exists():
        shutil.copy2(SOURCE / "hyperframes.json", dest / "hyperframes.json")
    if not (dest / "package.json").exists():
        (dest / "package.json").write_text(json.dumps({"name": name, "private": True, "type": "module"}, indent=2) + "\n")
    (dest / "design.md").write_text(
        f"# Think Deep — {clip_id} ({'escritorio' if desktop else 'móvil'})\n\n"
        f"- Lienzo: {width} × {height} a 30 fps; duración: {duration:g} s.\n"
        "- Lenguaje: fondo #0a0a0b, acento #d4b44a, Syne para titulares y DM Sans para texto.\n"
        "- Estructura: apertura, cuatro escenas de proceso (cinco en sitio), cierre de marca.\n"
        "- Cada escena ocupa el lienzo con un diagrama, una interfaz ficticia o un documento. "
        "El resultado se puede entender sin escuchar el audio.\n"
        f"- Audio: {'narración original de sitio' if clip_id == 'sitio' else 'sin audio'}.\n"
        "- Fuente única de este HTML: `../scripts/build-clips.py`.\n",
        encoding="utf-8",
    )
    return dest


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("ids", nargs="*", choices=IDS)
    parser.add_argument("--desktop", action="store_true")
    parser.add_argument("--mobile", action="store_true")
    args = parser.parse_args()
    ids = args.ids or IDS
    variants = ([False] if args.mobile else [True] if args.desktop else [False, True])
    for clip_id in ids:
        for desktop in variants:
            print(write_comp(clip_id, desktop))


if __name__ == "__main__":
    main()
