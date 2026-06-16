import { NextResponse } from "next/server";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  company: z.string().min(2).max(200),
  message: z.string().min(10).max(2000),
  website: z.string().max(0).optional().nullable(),
});

const rateLimit = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (rateLimit.get(ip) ?? []).filter((t) => now - t < 60_000);
  if (timestamps.length >= 5) return true;
  timestamps.push(now);
  rateLimit.set(ip, timestamps);
  return false;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Demasiados intentos. Espera un momento." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const { website, ...data } = parsed.data;
  if (website) return NextResponse.json({ ok: true });

  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;

  if (accessKey) {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_key: accessKey,
        name: data.name,
        email: data.email,
        company: data.company,
        message: data.message,
        subject: `Cotización — ${data.name} (${data.company})`,
      }),
    });
    const result = await res.json();
    if (!result.success) {
      return NextResponse.json({ error: "No se pudo enviar el mensaje" }, { status: 502 });
    }
  } else {
    console.info("[contact]", data);
  }

  return NextResponse.json({ ok: true });
}
