"use client";

import { useState } from "react";
import { CONTACT_FORM_ENABLED, SITE, WHATSAPP_URL } from "@/lib/constants";
import { GlassButton, GlassCTA, GlassSurface } from "@/components/effects/GlassCTA";

type FormStatus = "idle" | "loading" | "success" | "error";

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

function getAccessKey() {
  return process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY?.trim() ?? "";
}

export function Contact() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = new FormData(form);

    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const company = String(data.get("company") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const website = String(data.get("website") ?? "").trim();

    if (website) {
      setStatus("success");
      form.reset();
      return;
    }

    if (name.length < 2 || email.length < 5 || company.length < 2 || message.length < 5) {
      setStatus("error");
      setErrorMsg("Revisa los campos: nombre, email, empresa y mensaje (mínimo 5 caracteres).");
      return;
    }

    const accessKey = getAccessKey();
    if (!accessKey || accessKey === "REEMPLAZAR_EN_VERCEL") {
      setStatus("error");
      setErrorMsg(
        "Falta la API key de Web3Forms. Mientras tanto, escríbenos por WhatsApp o correo.",
      );
      return;
    }

    try {
      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: accessKey,
          name,
          email,
          subject: `Proyecto — ${name} (${company})`,
          message: `Empresa o proyecto: ${company}\n\n${message}`,
        }),
      });

      const raw = await res.text();
      let body: { success?: boolean; message?: string } = {};
      if (raw) {
        try {
          body = JSON.parse(raw) as { success?: boolean; message?: string };
        } catch {
          throw new Error("Respuesta inválida del servicio de correo.");
        }
      }

      if (!res.ok || !body.success) {
        throw new Error(
          body.message ?? "No se pudo enviar. Si persiste, escríbenos por WhatsApp.",
        );
      }

      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "No se pudo enviar el formulario. También puedes escribir por WhatsApp.",
      );
    }
  }

  return (
    <section id="contacto" className="section section-rule">
      <div className="container-page">
        <div className={CONTACT_FORM_ENABLED ? "contact-grid" : "max-w-2xl"}>
          <div>
            <p className="section-label">Contacto</p>
            <h2 className="section-title">Escríbenos</h2>
            <p className="section-copy">
              Cuéntanos qué necesitas. Te respondemos con el siguiente paso.
            </p>

            <div className="contact-channels">
              <GlassSurface preset="panel" className="contact-channel">
                <span>WhatsApp</span>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                  {SITE.phoneDisplay}
                </a>
              </GlassSurface>
              <GlassSurface preset="panel" className="contact-channel">
                <span>Correo</span>
                <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
              </GlassSurface>
            </div>

            <div className="mt-10">
              <GlassCTA href={WHATSAPP_URL} external>
                WhatsApp
              </GlassCTA>
            </div>
          </div>

          {CONTACT_FORM_ENABLED &&
            (status === "success" ? (
              <div className="contact-panel flex min-h-[280px] flex-col items-center justify-center text-center">
                <p className="text-xl font-semibold text-[var(--color-text)]">Mensaje enviado.</p>
                <p className="mt-2 text-[var(--color-muted)]">Te respondemos lo antes posible.</p>
                <GlassButton className="mt-6" onClick={() => setStatus("idle")}>
                  Enviar otro mensaje
                </GlassButton>
              </div>
            ) : (
              <form className="contact-panel" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="form-label">
                      Nombre
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="form-field"
                      placeholder="Tu nombre"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="form-field"
                      placeholder="tu@email.com"
                      required
                    />
                  </div>
                </div>
                <div className="mt-5">
                  <label htmlFor="company" className="form-label">
                    Empresa o proyecto
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    className="form-field"
                    placeholder="Nombre de tu negocio"
                    required
                  />
                </div>
                <div className="mt-5">
                  <label htmlFor="message" className="form-label">
                    ¿Qué necesitas resolver?
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    className="form-field resize-none"
                    placeholder="Cuéntalo en pocas líneas: resultado esperado, problema actual, plazo o enlace relevante..."
                    required
                    minLength={5}
                  />
                </div>
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  className="absolute -left-[9999px]"
                  aria-hidden="true"
                />
                {status === "error" && (
                  <p className="mt-5 border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {errorMsg}
                  </p>
                )}
                <GlassButton
                  type="submit"
                  className="mt-6 w-full justify-center"
                  disabled={status === "loading"}
                >
                  {status === "loading" ? "Enviando..." : "Enviar contexto"}
                </GlassButton>
              </form>
            ))}
        </div>
      </div>
    </section>
  );
}
