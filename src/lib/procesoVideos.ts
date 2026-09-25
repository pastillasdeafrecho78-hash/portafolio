import type { InterestId } from "@/lib/constants";

/** 9 product leaves + 1 free-text fallback — see docs/GUIONES-PROCESO-REVISION.md */
export const PROCESO_VIDEO_IDS = [
  "sitio",
  "panel",
  "mvp",
  "whatsapp",
  "webchat",
  "inbox",
  "rostro",
  "patron",
  "lista",
  "otro",
] as const;

export type ProcesoVideoId = (typeof PROCESO_VIDEO_IDS)[number];

export const PROCESO_VIDEO_LABELS: Record<ProcesoVideoId, string> = {
  sitio: "Sitio web",
  panel: "Panel o tablero",
  mvp: "MVP / app nueva",
  whatsapp: "WhatsApp",
  webchat: "Chat en tu web",
  inbox: "Correo o inbox",
  rostro: "Reconocimiento facial",
  patron: "Detectar en cámara",
  lista: "Validar contra lista",
  otro: "Lo vemos contigo",
};

const LEAF_TO_VIDEO: Record<string, ProcesoVideoId> = {
  sitio: "sitio",
  panel: "panel",
  mvp: "mvp",
  whatsapp: "whatsapp",
  webchat: "webchat",
  inbox: "inbox",
  rostro: "rostro",
  patron: "patron",
  lista: "lista",
  otro: "otro",
};

/** Map onboarding leaf (or free-text Otro) → proceso video clip. */
export function resolveProcesoVideoId(leafId: string | null | undefined): ProcesoVideoId {
  if (!leafId) return "otro";
  return LEAF_TO_VIDEO[leafId] ?? "otro";
}

/**
 * When leaf was skipped (e.g. only interest+followUp), best-effort from interest.
 * Prefer leafId from the picker whenever available.
 */
export function resolveProcesoVideoIdFromInterest(
  interest: InterestId | null,
  followUp: string | null,
): ProcesoVideoId {
  if (followUp && LEAF_TO_VIDEO[followUp]) return LEAF_TO_VIDEO[followUp];
  if (interest === "landing") return "sitio";
  if (interest === "chats") return "whatsapp";
  if (interest === "panel") return "panel";
  return "otro";
}

export type ProcesoVideoVariant = "mobile" | "desktop";

export function procesoVideoSrc(
  videoId: ProcesoVideoId,
  variant: ProcesoVideoVariant = "mobile",
) {
  const base = `/video/proceso/${videoId}`;
  if (variant === "desktop") {
    return {
      mp4: `${base}-pc.mp4`,
      webm: `${base}-pc.webm`,
      poster: `${base}-pc-poster.webp`,
      fallbackMp4: `${base}.mp4`,
      fallbackPoster: `${base}-poster.webp`,
    };
  }
  return {
    mp4: `${base}.mp4`,
    webm: `${base}.webm`,
    poster: `${base}-poster.webp`,
  };
}
