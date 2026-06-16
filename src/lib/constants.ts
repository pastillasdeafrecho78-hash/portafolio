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

export const PROJECTS = [
  {
    name: "Sitio corporativo para agencia",
    description:
      "Diseño y desarrollo de un sitio corporativo para presentar servicios, generar confianza y recibir solicitudes de contacto.",
    role: "Estructura de landing, jerarquía visual, responsive, formulario de contacto e integración con canales de atención.",
    capabilities: ["Página corporativa", "Formulario", "WhatsApp", "Mobile-first"],
  },
  {
    name: "ServimOS / Pedimos",
    description:
      "Participación en el desarrollo de una plataforma web para restaurantes, orientada a pedidos digitales, panel operativo, menús, experiencia de cliente y flujos internos de atención.",
    role: "Frontend, arquitectura de interfaces, flujos operativos, experiencia de usuario, paneles administrativos, comandas, KDS y experiencia móvil para cliente.",
    capabilities: [
      "Dashboard operativo",
      "Menús digitales",
      "Flujo de pedidos",
      "KDS / cocina",
      "Experiencia cliente",
    ],
  },
  {
    name: "Panel de usuarios y BI",
    description:
      "Trabajo en interfaces internas para administrar usuarios, consultar información operativa y visualizar reportes útiles para toma de decisiones.",
    role: "React, estructura de paneles, tablas, estados, filtros, vistas de datos y componentes para entornos administrativos.",
    capabilities: ["Panel de usuarios", "Reportes BI", "Tablas y filtros", "React", "Operación interna"],
  },
] as const;

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

export const TRUST_POINTS = [
  "Sitios optimizados para celular",
  "Contacto directo por WhatsApp",
  "Formularios funcionales",
  "Diseño claro y profesional",
  "Estructura pensada para conversión",
  "Código ordenado y escalable",
  "Despliegue en Vercel o plataforma equivalente",
] as const;
