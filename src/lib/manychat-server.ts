import "server-only";

import type { ManyChatLead } from "@/lib/manychat";

const MANYCHAT_API_URL = "https://api.manychat.com";

type ManyChatSubscriber = {
  id: string | number;
};

type ManyChatResponse<T> = {
  status: "success" | "error";
  data?: T;
  message?: string;
};

export type ManyChatWelcomeResult = {
  ok: boolean;
  skipped?: string;
};

async function manyChatRequest<T>(
  path: string,
  token: string,
  init?: RequestInit,
): Promise<ManyChatResponse<T>> {
  const response = await fetch(`${MANYCHAT_API_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
    cache: "no-store",
  });
  const payload = (await response.json().catch(() => null)) as ManyChatResponse<T> | null;

  if (!response.ok || !payload || payload.status !== "success") {
    throw new Error(payload?.message || `ManyChat respondió HTTP ${response.status}`);
  }
  return payload;
}

async function findSubscriber(
  whatsappE164: string,
  token: string,
): Promise<ManyChatSubscriber | null> {
  const phone = `+${whatsappE164}`;
  const response = await fetch(
    `${MANYCHAT_API_URL}/fb/subscriber/findBySystemField?phone=${encodeURIComponent(phone)}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    },
  );

  if (response.status === 404) return null;

  const payload = (await response.json().catch(() => null)) as
    | ManyChatResponse<ManyChatSubscriber>
    | null;
  if (!response.ok) {
    // ManyChat también puede expresar "no encontrado" como respuesta 400.
    const notFound = payload?.message?.toLowerCase().includes("not found");
    if (notFound) return null;
    throw new Error(payload?.message || `ManyChat respondió HTTP ${response.status}`);
  }

  return payload?.data?.id ? payload.data : null;
}

async function createSubscriber(
  lead: ManyChatLead,
  token: string,
): Promise<ManyChatSubscriber> {
  const [firstName, ...lastNameParts] = lead.name.trim().split(/\s+/);
  const response = await manyChatRequest<ManyChatSubscriber>(
    "/fb/subscriber/createSubscriber",
    token,
    {
      method: "POST",
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastNameParts.join(" "),
        whatsapp_phone: `+${lead.whatsappE164}`,
      }),
    },
  );

  if (!response.data?.id) throw new Error("ManyChat no devolvió subscriber_id");
  return response.data;
}

export async function sendManyChatWelcome(
  lead: ManyChatLead,
): Promise<ManyChatWelcomeResult> {
  if (process.env.NEXT_PUBLIC_MANYCHAT_ENABLED !== "true") {
    return { ok: false, skipped: "manychat_disabled" };
  }

  const token = process.env.MANYCHAT_API_TOKEN?.trim();
  const flowNs = process.env.MANYCHAT_WELCOME_FLOW_NS?.trim();
  if (!token || !flowNs) throw new Error("Configuración ManyChat incompleta");

  const subscriber =
    (await findSubscriber(lead.whatsappE164, token)) ??
    (await createSubscriber(lead, token));

  await manyChatRequest("/fb/subscriber/setCustomFields", token, {
    method: "POST",
    body: JSON.stringify({
      subscriber_id: subscriber.id,
      fields: [
        { field_name: "name", field_value: lead.name },
        { field_name: "product", field_value: lead.productLabel },
        { field_name: "video_id", field_value: lead.videoId },
      ],
    }),
  });

  await manyChatRequest("/fb/sending/sendFlow", token, {
    method: "POST",
    body: JSON.stringify({
      subscriber_id: subscriber.id,
      flow_ns: flowNs,
    }),
  });

  return { ok: true };
}
