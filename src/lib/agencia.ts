import { SITE, buildWhatsAppUrl, type OnboardingIconKey } from "@/lib/constants";

export const AGENCIA_WHATSAPP_URL = buildWhatsAppUrl(
  "Hola, vi la página de Think Deep y quiero platicarles de mi proyecto.",
);

export const AGENCIA = {
  meta: {
    title: `${SITE.name} | Agencia — marketing, tecnología e IA`,
    description:
      "En Think Deep hacemos campañas, sitios web y sistemas para dar seguimiento a clientes. Estamos en Dolores Hidalgo, Guanajuato.",
  },
  hero: {
    title: ["Te ayudamos a conseguir clientes", "y darles seguimiento."],
    copy: "Armamos tus campañas, hacemos la página a la que llegan tus clientes y conectamos el formulario o WhatsApp con tu equipo.",
    primaryCta: "Escribir por WhatsApp",
    secondaryCta: "Ver servicios de desarrollo",
    secondaryHref: "/",
  },
  marketing: {
    title: "Qué pasa después de publicar un anuncio",
    copy: "Revisamos cuántas personas te escriben y cuánto cuesta cada solicitud para ajustar las campañas.",
    kpis: [
      { label: "Prospectos", value: "1,284", delta: "+24%", points: [42, 48, 45, 62, 58, 70, 78, 74, 88, 92] },
      { label: "Costo", value: "$48", delta: "−18%", points: [80, 72, 68, 65, 58, 55, 52, 50, 48, 46] },
      { label: "Conversiones", value: "4.2x", delta: "+0.6", points: [30, 34, 32, 40, 44, 48, 52, 55, 60, 64] },
    ],
    channels: [
      { label: "Google Ads · Búsqueda", pct: 68 },
      { label: "Meta Ads · Conversiones", pct: 52 },
    ],
  },
  ia: {
    title: "En qué te puede ayudar la IA",
    copy: "Puede responder preguntas frecuentes, resumir reportes y avisarte si algo requiere atención.",
    satellites: [
      { title: "Optimizar", body: "Sugiere ajustes para que tu equipo los revise.", icon: "zap" satisfies OnboardingIconKey },
      { title: "Atender", body: "Responde dudas y pasa la conversación a tu equipo cuando hace falta.", icon: "messages" satisfies OnboardingIconKey },
      { title: "Reportar", body: "Resume los datos de tus campañas.", icon: "chart" satisfies OnboardingIconKey },
      { title: "Vigilar", body: "Avisa si detecta algo fuera de lo habitual.", icon: "scan" satisfies OnboardingIconKey },
    ],
  },
  agents: {
    title: "Qué pasa cuando alguien llena un formulario",
    copy: "Guardamos la solicitud, la asignamos y podemos enviar una primera respuesta por WhatsApp.",
    stages: [
      { id: "capturar", label: "Capturar", icon: "user" satisfies OnboardingIconKey },
      { id: "clasificar", label: "Clasificar", icon: "scan" satisfies OnboardingIconKey },
      { id: "crm", label: "CRM", icon: "list" satisfies OnboardingIconKey },
      { id: "whatsapp", label: "WhatsApp", icon: "chat" satisfies OnboardingIconKey },
      { id: "reporte", label: "Reporte", icon: "dashboard" satisfies OnboardingIconKey },
    ],
    code: [
      { n: 1, code: "const flujo = async () => {" },
      { n: 2, code: "  const lead = await capturar(formulario)" },
      { n: 3, code: "  const score = await agenteIA.clasificar(lead)" },
      { n: 4, code: "  await crm.crear(lead)" },
      { n: 5, code: "  await whatsapp.responder(lead)" },
      { n: 6, code: "  return reporte.generar()" },
      { n: 7, code: "}" },
    ],
  },
  tools: {
    title: "Qué podemos construir para tu negocio",
    items: [
      { id: "landing", title: "Sitios para campañas", mock: "landing" as const },
      { id: "panel", title: "Paneles y apps", mock: "panel" as const },
      { id: "integrations", title: "Integraciones", mock: "integrations" as const },
      { id: "chats", title: "Chats automáticos", mock: "chats" as const },
    ],
  },
  flow: {
    title: "Del anuncio al seguimiento",
    ribbon: [
      { id: "ad", label: "Anuncio" },
      { id: "landing", label: "Landing" },
      { id: "agent", label: "Agente" },
      { id: "crm", label: "CRM" },
      { id: "report", label: "Reporte" },
    ],
    before: {
      title: "Antes",
      subtitle: "Proceso manual",
      items: ["Solicitudes en hojas de cálculo", "Respuestas tardías", "Reportes a mano", "Datos dispersos"],
    },
    after: {
      title: "Con Think Deep",
      subtitle: "Seguimiento en un solo lugar",
      items: ["Cada solicitud tiene un responsable", "Tu equipo ve de dónde llegó cada cliente", "Reportes automáticos", "Solicitudes y respuestas en el mismo panel"],
    },
  },
  hosting: {
    title: "Hosting y correo para tu negocio",
    copy: "Nos encargamos del alojamiento de tu sitio, los respaldos y el correo.",
    compare: {
      left: {
        title: "Hosting suelto",
        items: [
          { ok: false, text: "Tú renuevas el certificado del sitio" },
          { ok: false, text: "Tú haces los respaldos" },
          { ok: false, text: "Soporte genérico" },
        ],
      },
      right: {
        title: "Administrado",
        items: [
          { ok: true, text: "Certificado y correo configurados" },
          { ok: true, text: "Respaldos y monitoreo" },
          { ok: true, text: "Asistencia directa" },
        ],
      },
    },
    gauges: [
      { label: "CPU", pct: 34 },
      { label: "RAM", pct: 58 },
      { label: "Disco", pct: 41 },
    ],
    events: [
      "Backup nocturno completado",
      "SSL renovado",
      "Correo sincronizado",
    ],
  },
  faq: {
    title: "Preguntas frecuentes",
    items: [
      {
        q: "¿Qué pasa cuando les escribo?",
        a: "Te preguntamos qué necesitas y qué tienes montado. Con eso te decimos por dónde podemos empezar.",
      },
      {
        q: "¿Con quién voy a trabajar?",
        a: `Hablas directamente con ${SITE.director}, quien dirige el proyecto.`,
      },
      {
        q: "¿Solo publicidad o también sitio y hosting?",
        a: "Podemos ayudarte con una campaña, con el sitio o con el hosting y el correo. Depende de lo que ya tengas.",
      },
      {
        q: "¿La IA mueve sola mis presupuestos?",
        a: "No. Puede sugerir cambios. Tu equipo decide si aplica alguno.",
      },
      {
        q: "¿Cómo veo qué resultados dio la campaña?",
        a: "Puedes ver cuántas solicitudes llegaron, cuántas se atendieron y cuáles avanzaron a una venta cuando contamos con ese dato.",
      },
      {
        q: "¿Branding, video o foto?",
        a: "Nos especializamos en campañas, desarrollo web y automatización.",
      },
    ],
  },
  contact: {
    title: "Cuéntanos tu proyecto",
    copy: "Dinos qué necesitas y qué tienes montado. Te respondemos por WhatsApp o correo.",
    cta: "Abrir WhatsApp",
  },
} as const;
