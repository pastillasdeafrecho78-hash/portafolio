export const SITE = {
  name: "Salvador Barba",
  shortName: "SB",
  role: "Desarrollador web freelance",
  title: "Salvador Barba | Desarrollador Web Freelance",
  description:
    "Desarrollo de páginas corporativas, landing pages, formularios de contacto, integración con WhatsApp y aplicaciones web para negocios.",
  url: "https://salvador.dev",
  email: "salvador@thinkdeepgroup.com",
  phone: "+524881774543",
  phoneDisplay: "488 177 4543",
};

export const WHATSAPP_NUMBER = "524881774543";
export const WHATSAPP_MESSAGE =
  "Hola Salvador, vi tu portafolio y me gustaría solicitar una cotización.";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

export const NAV_LINKS = [
  { href: "#servicios", label: "Servicios" },
  { href: "#proyectos", label: "Proyectos" },
  { href: "#proceso", label: "Proceso" },
  { href: "#contacto", label: "Contacto" },
] as const;

export const HERO_PROOFS = [
  "Web developer enfocado en sitios corporativos, landing pages y aplicaciones web para negocios.",
  "Interfaces claras, responsive y pensadas para generar contacto real desde celular y escritorio.",
  "Integraciones prácticas con WhatsApp, correo, formularios y flujos internos de operación.",
] as const;

export const SERVICES = [
  {
    title: "Páginas corporativas",
    description:
      "Sitios profesionales para presentar tu empresa, servicios y propuesta de valor de forma clara.",
  },
  {
    title: "Landing pages de conversión",
    description:
      "Páginas enfocadas en captar prospectos, agendar llamadas o recibir solicitudes de cotización.",
  },
  {
    title: "Formularios de contacto",
    description:
      "Formularios conectados a correo electrónico para recibir datos de clientes potenciales.",
  },
  {
    title: "Integración con WhatsApp",
    description:
      "Botones, flujos y llamadas a la acción conectadas directamente con WhatsApp.",
  },
  {
    title: "Optimización móvil",
    description:
      "Diseños responsivos para que la página funcione correctamente en celular, tablet y escritorio.",
  },
  {
    title: "Aplicaciones web / dashboards",
    description:
      "Interfaces internas para operación, administración de pedidos, seguimiento o gestión de procesos.",
  },
] as const;

export const CAPABILITIES = [
  "Páginas corporativas",
  "Formularios de contacto",
  "WhatsApp y correo",
  "Responsive mobile-first",
  "Paneles administrativos",
  "Dashboards y reportes",
] as const;

export const STACK_ITEMS = [
  {
    title: "React / Next.js",
    description:
      "Ideal cuando el sitio necesita crecer hacia formularios avanzados, dashboards, pedidos o integraciones reales.",
  },
  {
    title: "WordPress / Elementor",
    description:
      "Lo puedo tomar como referencia de estructura visual, pero prefiero React cuando el proyecto exige control, rendimiento y escalabilidad.",
  },
  {
    title: "Vercel / formularios / WhatsApp",
    description:
      "Deploy moderno, llamadas a la acción claras y canales de contacto conectados para recibir prospectos.",
  },
] as const;

export type ProjectLink = { label: string; href: string };

export type Project = {
  name: string;
  description: string;
  role: string;
  capabilities: readonly string[];
  links?: readonly ProjectLink[];
  logo?: string;
  logoWidth?: number;
  logoHeight?: number;
  preview?: string;
  featured?: boolean;
};

export const PROJECTS: readonly Project[] = [
  {
    name: "Landing de conversión",
    description:
      "Landing pages y sitios corporativos pensados para presentar servicios, generar confianza y convertir visitas en contacto real.",
    role: "Estructura visual, copy de conversión, responsive, formularios y llamadas a la acción conectadas a WhatsApp o correo.",
    capabilities: ["Landing page", "Formulario", "WhatsApp", "Mobile-first", "SEO básico"],
    preview: "/images/project-agency.svg",
  },
  {
    name: "ServimOS",
    description:
      "Plataforma completa para restaurantes en producción: landing pública, acceso operativo, pedidos digitales, cocina, menús y flujos internos de atención.",
    role: "Frontend, arquitectura de interfaces, paneles administrativos, experiencia móvil para cliente y operación diaria del negocio.",
    capabilities: [
      "Plataforma en producción",
      "Dashboard operativo",
      "Menús digitales",
      "Flujo de pedidos",
      "Experiencia cliente",
    ],
    logo: "/servimos-logo.png",
    logoWidth: 190,
    logoHeight: 52,
    preview: "/servimos-reportes.png",
    featured: true,
    links: [
      { label: "Ver landing", href: "https://servimos.online/" },
      { label: "Plataforma completa", href: "https://servimos.online/login" },
    ],
  },
];

export const PLATFORMS_INSIGHTS = {
  eyebrow: "Plataformas e insights",
  title: "También construimos herramientas internas para operar y entender el negocio.",
  description:
    "Más allá de la landing, diseño y desarrollo interfaces para equipos que necesitan ordenar operación, administrar información y tomar decisiones con datos claros.",
  points: [
    {
      title: "Paneles administrativos",
      description: "Vistas para gestionar pedidos, usuarios, estados y procesos internos con interfaces claras.",
    },
    {
      title: "Reportes y métricas",
      description: "Dashboards para visualizar rendimiento, tendencias y señales útiles del negocio.",
    },
    {
      title: "Tablas, filtros y flujos",
      description: "Componentes reutilizables para consultar, filtrar y actuar sobre información operativa.",
    },
    {
      title: "Escalabilidad con React",
      description: "Bases sólidas para crecer de una página simple a una plataforma web completa.",
    },
  ],
  tags: [
    "Paneles admin",
    "BI operativo",
    "Tablas y filtros",
    "React / Next.js",
    "Operación interna",
  ],
} as const;

export const PROCESS_STEPS = [
  {
    title: "Diagnóstico rápido",
    description:
      "Entiendo qué necesita comunicar tu negocio y qué acción quieres que tome el visitante.",
  },
  {
    title: "Estructura y propuesta visual",
    description: "Defino la arquitectura de la página, secciones principales y dirección visual.",
  },
  {
    title: "Desarrollo responsive",
    description:
      "Construyo la página cuidando rendimiento, claridad y adaptación a dispositivos móviles.",
  },
  {
    title: "Integraciones",
    description:
      "Conecto formularios, correo electrónico, WhatsApp o herramientas necesarias para recibir prospectos.",
  },
  {
    title: "Revisión y entrega",
    description:
      "Ajustamos detalles finales y dejo el sitio listo para publicarse o conectarse a dominio.",
  },
] as const;
