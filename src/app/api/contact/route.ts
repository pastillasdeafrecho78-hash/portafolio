import { NextResponse } from "next/server";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Nombre muy corto").max(100),
  email: z.string().trim().email("Email inválido"),
  company: z.string().trim().min(2, "Empresa o proyecto muy corto").max(200),
  message: z.string().trim().min(5, "Escribe al menos 5 caracteres").max(2000),
  website: z
    .string()
    .optional()
    .nullable()
    .transform((value) => value ?? "")
    .pipe(z.string().max(0)),
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

function isConfiguredAccessKey(key: string | undefined): key is string {
  if (!key) return false;
  if (key === "REEMPLAZAR_EN_VERCEL") return false;
  return key.trim().length > 8;
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
    const message = parsed.error.issues[0]?.message ?? "Datos inválidos";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const { website, ...data } = parsed.data;
  if (website) return NextResponse.json({ ok: true });

  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;

  if (!isConfiguredAccessKey(accessKey)) {
    console.info("[contact]", data);
    return NextResponse.json(
      {
        error:
          "El formulario aún no está configurado en producción. Escríbeme por WhatsApp mientras lo activamos.",
      },
      { status: 503 },
    );
  }

  let web3Res: Response;
  try {
    web3Res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: accessKey,
        name: data.name,
        email: data.email,
        company: data.company,
        message: data.message,
        subject: `Cotización — ${data.name} (${data.company})`,
      }),
    });
  } catch {
    return NextResponse.json(
      { error: "No se pudo conectar con el servicio de correo. Intenta por WhatsApp." },
      { status: 502 },
    );
  }

  let result: { success?: boolean; message?: string } = {};
  try {
    const raw = await web3Res.text();
    result = raw ? (JSON.parse(raw) as { success?: boolean; message?: string }) : {};
  } catch {
    return NextResponse.json(
      { error: "El servicio de correo respondió de forma inválida. Intenta por WhatsApp." },
      { status: 502 },
    );
  }

  if (!web3Res.ok || !result.success) {
    return NextResponse.json(
      {
        error:
          result.message ??
          "No se pudo enviar el mensaje. Verifica la API key de Web3Forms en Vercel.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
