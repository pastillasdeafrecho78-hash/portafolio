export type ManyChatLead = {
  name: string;
  /** E.164 without +, e.g. 524181774543 */
  whatsappE164: string;
  productLabel: string;
  videoId: string;
  /** Kept for API shape; submitting a phone is treated as consent to message. */
  waOptIn?: boolean;
};

export const MANYCHAT_ENABLED =
  process.env.NEXT_PUBLIC_MANYCHAT_ENABLED === "true";

export async function enqueueManyChatWelcome(
  lead: ManyChatLead,
): Promise<{ ok: boolean; skipped?: string }> {
  if (!MANYCHAT_ENABLED) {
    return { ok: false, skipped: "manychat_disabled" };
  }

  try {
    const response = await fetch("/api/manychat/welcome", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...lead, waOptIn: true }),
      keepalive: true,
    });

    if (!response.ok) return { ok: false, skipped: "manychat_request_failed" };
    return (await response.json()) as { ok: boolean; skipped?: string };
  } catch {
    // El seguimiento nunca debe bloquear la navegación a /proceso.
    return { ok: false, skipped: "manychat_request_failed" };
  }
}
