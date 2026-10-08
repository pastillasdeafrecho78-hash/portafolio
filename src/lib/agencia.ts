import { SITE, buildWhatsAppUrl, type OnboardingIconKey } from "@/lib/constants";

export const AGENCIA_WHATSAPP_URL = buildWhatsAppUrl(
  "Hola Think Deep — vi la página de agencia y quiero platicar de un proyecto.",
);

export const AGENCIA = {
  meta: {
    title: `${SITE.name} | Agencia — marketing, tecnología e IA`,
    description:
      "Marketing, tecnología con IA e infraestructura. Think Deep — México.",
  },
  hero: {
    title: "Marketing que convierte. Tecnología que automatiza. IA que acelera.",
    copy: "Un equipo para generar oportunidades, construir herramientas y automatizar lo repetible.",
    primaryCta: "Escribir por WhatsApp",
    secondaryCta: "Ofertas de código",
    secondaryHref: "/",
    toasts: [
      { title: "Nuevo prospecto", meta: "Google Ads · Form", icon: "user" satisfies OnboardingIconKey },
      { title: "Campaña en revisión", meta: "Meta Ads", icon: "chart" satisfies OnboardingIconKey },
      { title: "Conversación atendida", meta: "Agente WhatsApp", icon: "messages" satisfies OnboardingIconKey },
      { title: "Reporte actualizado", meta: "Dashboard en vivo", icon: "dashboard" satisfies OnboardingIconKey },
    ],
  },
  system: {
    title: "Un sistema conectado de extremo a extremo",
    copy: "Cada área alimenta a la siguiente.",
    nodes: [
      {
        id: "marketing",
        label: "Marketing",
        delivers: "Genera prospectos y demanda",
        icon: "chart" satisfies OnboardingIconKey,
      },
      {
        id: "tech",
        label: "Tecnología + IA",
        delivers: "Convierte leads en procesos",
        icon: "zap" satisfies OnboardingIconKey,
      },
      {
        id: "infra",
        label: "Infraestructura",
        delivers: "Sostiene sitio, correo y datos",
        icon: "building" satisfies OnboardingIconKey,
      },
    ],
  },
  marketing: {
    title: "Marketing diseñado para generar negocio",
    copy: "Campañas y páginas orientadas a oportunidades reales, no a métricas de vanidad.",
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
    title: "La IA vive dentro de cada solución",
    copy: "No es un producto aparte: optimiza, atiende, reporta y vigila.",
    satellites: [
      { title: "Optimizar", body: "Sugiere; decide el equipo.", icon: "zap" satisfies OnboardingIconKey },
      { title: "Atender", body: "WhatsApp o inbox con pase humano.", icon: "messages" satisfies OnboardingIconKey },
      { title: "Reportar", body: "Resúmenes sin armarlos a mano.", icon: "chart" satisfies OnboardingIconKey },
      { title: "Vigilar", body: "Alertas antes de que duela.", icon: "scan" satisfies OnboardingIconKey },
    ],
  },
  agents: {
    title: "Agentes que trabajan por ti",
    copy: "Capturan, clasifican, responden y reportan.",
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
    title: "No solo páginas. Herramientas digitales.",
    items: [
      { id: "landing", title: "Sitios y landings", mock: "landing" as const },
      { id: "panel", title: "Paneles y MVPs", mock: "panel" as const },
      { id: "integrations", title: "Integraciones", mock: "integrations" as const },
      { id: "chats", title: "Automatización de chats", mock: "chats" as const },
    ],
  },
  flow: {
    title: "Del clic al reporte, sin fricción",
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
      items: ["Leads en hojas", "Respuestas tardías", "Reportes a mano", "Datos dispersos"],
    },
    after: {
      title: "Con Think Deep",
      subtitle: "Automatización con criterio",
      items: ["Leads enrutados", "Respuesta con contexto", "Reportes automáticos", "Todo medible"],
    },
  },
  hosting: {
    title: "La infraestructura también importa",
    copy: "Hosting, correo y seguridad administrados.",
    compare: {
      left: {
        title: "Hosting suelto",
        items: [
          { ok: false, text: "Tú renuevas SSL" },
          { ok: false, text: "Backups a tu cargo" },
          { ok: false, text: "Soporte genérico" },
        ],
      },
      right: {
        title: "Administrado",
        items: [
          { ok: true, text: "SSL y correo listos" },
          { ok: true, text: "Backups y vigilancia" },
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
  method: {
    title: "Cómo trabajamos contigo",
    steps: [
      { title: "Analizamos", body: "Negocio, mercado y objetivos." },
      { title: "Estrategia", body: "Plan con métricas claras." },
      { title: "Implementamos", body: "Campañas y herramientas." },
      { title: "Automatizamos", body: "Flujos y agentes." },
      { title: "Medimos", body: "Tableros de lo que importa." },
      { title: "Optimizamos", body: "Iteración continua." },
    ],
  },
  faq: {
    title: "Preguntas frecuentes",
    items: [
      {
        q: "¿Qué pasa cuando me contacto?",
        a: "Aclaramos alcance y siguiente paso. También puedes arrancar con una oferta de código en la portada.",
      },
      {
        q: "¿Con quién voy a trabajar?",
        a: `Trabajo dirigido por ${SITE.director}. Comunicación directa.`,
      },
      {
        q: "¿Solo publicidad o también sitio y hosting?",
        a: "Marketing, tecnología + IA e infraestructura. Empiezas por uno o combinados.",
      },
      {
        q: "¿La IA mueve sola mis presupuestos?",
        a: "No. Analiza y sugiere; las decisiones las toma el equipo.",
      },
      {
        q: "¿Cómo sé si genera negocio?",
        a: "Prospectos, conversaciones y lo que se puede seguir hasta el negocio.",
      },
      {
        q: "¿Branding, video o foto?",
        a: "Nuestro foco es rendimiento, tecnología e infraestructura.",
      },
    ],
  },
  contact: {
    title: "Cuéntanos tu proyecto",
    copy: "WhatsApp o correo. Siguiente paso claro.",
    cta: "Abrir WhatsApp",
  },
} as const;
