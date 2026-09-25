export const SITE = {
  name: "Think Deep",
  shortName: "TD",
  role: "Estudio digital",
  director: "Salvador Barba",
  title: "Think Deep | Sitios, chats y paneles",
  description:
    "Sitio, automatización de chats o panel/MVP con precio cerrado. Think Deep — México. WhatsApp.",
  url: "https://www.thinkdeepgroup.com",
  email: "salvador@thinkdeepgroup.com",
  location: "Dolores Hidalgo — México",
  phoneDisplay: "418 177 4543",
};

export const WHATSAPP_NUMBER = "524181774543";
export const WHATSAPP_MESSAGE =
  "Hola Think Deep — vi el sitio y quiero platicar de un proyecto.";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

export function buildWhatsAppUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** Activar cuando Web3Forms esté configurado en Vercel. */
export const CONTACT_FORM_ENABLED = false;

export const NAV_LINKS = [
  { href: "/", label: "Ofertas" },
  { href: "/proceso", label: "Proceso" },
] as const;

/** Ofertas de programación (sin video como oferta primaria). */
export const OFFERS = [
  {
    id: "landing",
    title: "Sitio web",
    price: "USD 160",
    deposit: "USD 80 de anticipo",
    turnaround: "48 h",
    description:
      "Hasta cinco secciones, WhatsApp, formulario y publicación. Una revisión.",
  },
  {
    id: "chats",
    title: "Automatización de chats",
    price: "USD 200",
    deposit: "USD 100 de anticipo",
    turnaround: "3 a 5 días",
    description:
      "WhatsApp o inbox → respuesta o registro. Un flujo.",
  },
  {
    id: "panel",
    title: "Panel o MVP",
    price: "USD 280",
    deposit: "USD 140 de anticipo",
    turnaround: "5 a 7 días",
    description:
      "Una pantalla con auth para pedidos, usuarios o reportes.",
  },
] as const;

export type InterestId = "landing" | "chats" | "panel" | "other";

export type OnboardingIconKey =
  | "monitor"
  | "messages"
  | "camera"
  | "globe"
  | "dashboard"
  | "rocket"
  | "chat"
  | "mail"
  | "face"
  | "scan"
  | "list"
  | "building"
  | "user"
  | "package"
  | "cart"
  | "users"
  | "chart"
  | "zap"
  | "pen";

/** Paso 01: tres familias visibles; al expandir, tres opciones concretas en los mismos huecos. */
export type OnboardingLeaf = {
  id: string;
  interest: InterestId;
  label: string;
  icon: OnboardingIconKey;
  hint?: string;
  /** Si viene definido, se salta el detalle del paso 02. */
  followUp?: string;
};

export type OnboardingFamily = {
  id: string;
  label: string;
  icon: OnboardingIconKey;
  children: readonly OnboardingLeaf[];
};

export const ONBOARDING_FAMILIES: readonly OnboardingFamily[] = [
  {
    id: "presencia",
    label: "Web, panel o producto",
    icon: "monitor",
    children: [
      {
        id: "sitio",
        interest: "landing",
        label: "Sitio web",
        icon: "globe",
        hint: "Tu negocio en internet",
      },
      {
        id: "panel",
        interest: "panel",
        label: "Panel o tablero",
        icon: "dashboard",
        hint: "Ver pedidos, clientes o reportes",
      },
      {
        id: "mvp",
        interest: "panel",
        followUp: "mvp",
        label: "MVP / app nueva",
        icon: "rocket",
        hint: "Producto desde cero, versión inicial",
      },
    ],
  },
  {
    id: "automatizar",
    label: "Automatizar chats o procesos",
    icon: "messages",
    children: [
      {
        id: "whatsapp",
        interest: "chats",
        followUp: "whatsapp",
        label: "WhatsApp",
        icon: "chat",
        hint: "Respuestas o registros automáticos",
      },
      {
        id: "webchat",
        interest: "chats",
        followUp: "web",
        label: "Chat en tu web",
        icon: "messages",
        hint: "Atiende visitas en tu página",
      },
      {
        id: "inbox",
        interest: "chats",
        followUp: "inbox",
        label: "Correo o inbox",
        icon: "mail",
        hint: "Mensajes que llegan por correo",
      },
    ],
  },
  {
    id: "camara",
    label: "Cámara: caras, objetos o listas",
    icon: "camera",
    children: [
      {
        id: "rostro",
        interest: "other",
        followUp: "rostro",
        label: "Reconocimiento facial",
        icon: "face",
        hint: "Check-in o acceso con cámara",
      },
      {
        id: "patron",
        interest: "other",
        followUp: "patron",
        label: "Detectar en cámara",
        icon: "scan",
        hint: "Movimiento, objetos o conteo",
      },
      {
        id: "lista",
        interest: "other",
        followUp: "lista",
        label: "Validar contra lista",
        icon: "list",
        hint: "Huéspedes, socios o empleados",
      },
    ],
  },
] as const;

export const ONBOARDING_EXTRA_FOLLOWUP_LABELS: Record<string, string> = {
  mvp: "MVP / producto desde cero",
  rostro: "Reconocimiento facial",
  patron: "Detección con cámara",
  lista: "Validación contra lista",
};

export const ONBOARDING_INTERESTS = [
  {
    id: "landing" as const,
    label: "Sitio web",
    hint: "",
  },
  {
    id: "chats" as const,
    label: "Automatización de chats",
    hint: "",
  },
  {
    id: "panel" as const,
    label: "Panel o MVP",
    hint: "",
  },
  {
    id: "other" as const,
    label: "Otro",
    hint: "",
  },
] as const;

export const ONBOARDING_FOLLOWUPS: Record<
  InterestId,
  {
    question: string;
    options: readonly { id: string; label: string; icon: OnboardingIconKey }[];
  }
> = {
  landing: {
    question: "¿Para qué es el sitio?",
    options: [
      { id: "negocio", label: "Negocio", icon: "building" },
      { id: "personal", label: "Personal", icon: "user" },
      { id: "producto", label: "Producto", icon: "package" },
      { id: "otro", label: "Otro", icon: "pen" },
    ],
  },
  chats: {
    question: "¿Dónde llegan los mensajes?",
    options: [
      { id: "whatsapp", label: "WhatsApp", icon: "chat" },
      { id: "web", label: "Chat en la web", icon: "messages" },
      { id: "inbox", label: "Inbox / correo", icon: "mail" },
      { id: "otro", label: "Otro", icon: "pen" },
    ],
  },
  panel: {
    question: "¿Qué quieres mover?",
    options: [
      { id: "pedidos", label: "Pedidos", icon: "cart" },
      { id: "usuarios", label: "Usuarios", icon: "users" },
      { id: "reportes", label: "Reportes", icon: "chart" },
      { id: "mvp", label: "MVP / app nueva", icon: "rocket" },
      { id: "otro", label: "Otro", icon: "pen" },
    ],
  },
  other: {
    question: "¿Qué necesitas?",
    options: [
      { id: "rostro", label: "Reconocimiento facial", icon: "face" },
      { id: "patron", label: "Detección con cámara", icon: "scan" },
      { id: "lista", label: "Validar contra lista", icon: "list" },
      { id: "ya", label: "Lo antes posible", icon: "zap" },
      { id: "otro", label: "Otro", icon: "pen" },
    ],
  },
};

export const STORAGE_ONBOARDING = "td-onboarding-v2";

export type ProjectLink = { label: string; href: string };

export type Project = {
  name: string;
  description: string;
  role: string;
  capabilities: readonly string[];
  links?: readonly ProjectLink[];
  preview?: string;
  previewFit?: "cover" | "contain";
  featured?: boolean;
};

export const PROJECTS: readonly Project[] = [
  {
    name: "ServimOS",
    description:
      "Plataforma en producción para restaurantes: pedidos digitales, cocina, menús y paneles de operación diaria.",
    role: "Frontend, arquitectura de interfaces, paneles administrativos y experiencia móvil del cliente.",
    capabilities: [
      "Dashboard operativo",
      "Menús digitales",
      "Flujo de pedidos",
      "Producto en vivo",
    ],
    preview: "/servimos-reportes.png",
    previewFit: "cover",
    featured: true,
    links: [
      { label: "Ver producto", href: "https://servimos.online/" },
      { label: "Entrar", href: "https://servimos.online/login" },
    ],
  },
  {
    name: "Torre Creativa",
    description:
      "Sitio inmobiliario para presentar desarrollos, tipologías y contacto comercial con una narrativa clara.",
    role: "Estructura web, presentación de inventario y flujo hacia contacto.",
    capabilities: ["Inmobiliaria", "Landing", "Responsive"],
    links: [
      {
        label: "Ver repositorio",
        href: "https://github.com/pastillasdeafrecho78-hash/TorreCreativa",
      },
    ],
  },
  {
    name: "ENERSCI",
    description:
      "Presencia digital orientada al sector energético: propuesta de valor, servicios y punto de contacto.",
    role: "Sitio de marca y estructura de contenido para una vertical técnica.",
    capabilities: ["Energía", "Marca", "Web"],
    links: [
      {
        label: "Ver repositorio",
        href: "https://github.com/pastillasdeafrecho78-hash/enersci",
      },
    ],
  },
  {
    name: "Solar Security Automation",
    description:
      "Automatización orientada a monitoreo y respuesta en contextos de seguridad solar / operación remota.",
    role: "Lógica de automatización, flujos y superficie de control.",
    capabilities: ["Automatización", "Seguridad", "Operación"],
    links: [
      {
        label: "Ver repositorio",
        href: "https://github.com/pastillasdeafrecho78-hash/solar-security-automation",
      },
    ],
  },
  {
    name: "Lúmen Outfit / Bonding",
    description:
      "Demo agéntica y pieza audiovisual: narrativa de marca con flujo interactivo y salida en video.",
    role: "Prototipo de experiencia, dirección visual y ensamble demo.",
    capabilities: ["Demo agéntica", "Video", "Experiencia"],
    links: [{ label: "Ver demo", href: "/bonding" }],
  },
];

export const PROCESS_STEPS = [
  {
    title: "Mensaje",
    description:
      "Nos escribes qué necesitas. Te decimos cuál de las tres ofertas encaja y qué pedimos.",
  },
  {
    title: "Anticipo",
    description:
      "Confirmas precio y plazo. Con el anticipo arrancamos.",
  },
  {
    title: "Entrega",
    description:
      "Te mandamos la primera versión en el plazo de la oferta, con una ronda de cambios.",
  },
  {
    title: "Cierre",
    description:
      "Ajustamos lo acordado, entregamos el archivo o el sitio, y cobramos el saldo.",
  },
] as const;
