import { STORAGE_ONBOARDING, type InterestId } from "@/lib/constants";
import {
  resolveProcesoVideoId,
  resolveProcesoVideoIdFromInterest,
  type ProcesoVideoId,
} from "@/lib/procesoVideos";

export const STORAGE_HANDOFF = `${STORAGE_ONBOARDING}-handoff`;

export type HandoffPayload = {
  interest: InterestId | null;
  interestLabel: string;
  followUpLabel: string;
  name: string;
  phone: string;
  countryIso: string;
  waUrl: string;
  leafId: string | null;
  videoId: ProcesoVideoId;
  /** Explicit opt-in for future ManyChat outbound (Fase B). */
  waOptIn: boolean;
  /** Bridge ritual finished (WA opened or user skipped). */
  bridgeDone: boolean;
};

export function saveHandoff(
  payload: Omit<HandoffPayload, "bridgeDone" | "videoId"> & {
    bridgeDone?: boolean;
    videoId?: ProcesoVideoId;
  },
) {
  try {
    const videoId =
      payload.videoId ??
      (payload.leafId
        ? resolveProcesoVideoId(payload.leafId)
        : resolveProcesoVideoIdFromInterest(payload.interest, null));
    const next: HandoffPayload = {
      ...payload,
      phone: payload.phone ?? "",
      countryIso: payload.countryIso ?? "MX",
      leafId: payload.leafId ?? null,
      videoId,
      waOptIn: payload.waOptIn ?? false,
      bridgeDone: payload.bridgeDone ?? false,
    };
    sessionStorage.setItem(STORAGE_HANDOFF, JSON.stringify(next));
  } catch {
    /* ignore */
  }
}

export function readHandoff(): HandoffPayload | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_HANDOFF);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<HandoffPayload>;
    if (!parsed || typeof parsed.waUrl !== "string") return null;
    const leafId = parsed.leafId ?? null;
    const interest = (parsed.interest as InterestId | null) ?? null;
    const videoId =
      parsed.videoId ??
      (leafId
        ? resolveProcesoVideoId(leafId)
        : resolveProcesoVideoIdFromInterest(interest, null));
    return {
      interest,
      interestLabel: parsed.interestLabel ?? "",
      followUpLabel: parsed.followUpLabel ?? "",
      name: parsed.name ?? "",
      phone: parsed.phone ?? "",
      countryIso: parsed.countryIso ?? "MX",
      waUrl: parsed.waUrl,
      leafId,
      videoId,
      waOptIn: Boolean(parsed.waOptIn),
      bridgeDone: Boolean(parsed.bridgeDone),
    };
  } catch {
    return null;
  }
}

export function markHandoffBridgeDone() {
  const current = readHandoff();
  if (!current) return;
  saveHandoff({ ...current, bridgeDone: true });
}
