import { NextResponse, type NextRequest } from "next/server";
import type { ManyChatLead } from "@/lib/manychat";
import { sendManyChatWelcome } from "@/lib/manychat-server";

export const runtime = "nodejs";

function isLead(value: unknown): value is ManyChatLead {
  if (!value || typeof value !== "object") return false;
  const lead = value as Partial<ManyChatLead>;

  return (
    typeof lead.name === "string" &&
    lead.name.trim().length >= 2 &&
    lead.name.length <= 120 &&
    typeof lead.whatsappE164 === "string" &&
    /^\d{8,15}$/.test(lead.whatsappE164) &&
    typeof lead.productLabel === "string" &&
    lead.productLabel.trim().length > 0 &&
    lead.productLabel.length <= 160 &&
    typeof lead.videoId === "string" &&
    lead.videoId.length <= 100 &&
    lead.waOptIn === true
  );
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== request.nextUrl.host) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  if (!isLead(body)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  try {
    const result = await sendManyChatWelcome({
      ...body,
      name: body.name.trim(),
      productLabel: body.productLabel.trim(),
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error(
      "No se pudo enviar el seguimiento de ManyChat:",
      error instanceof Error ? error.message : "error desconocido",
    );
    return NextResponse.json({ ok: false }, { status: 502 });
  }
}
