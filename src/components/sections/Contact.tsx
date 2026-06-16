"use client";

import { useState } from "react";
import { SITE, WHATSAPP_URL } from "@/lib/constants";

type FormStatus = "idle" | "loading" | "success" | "error";

export function Contact() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          company: data.get("company"),
          message: data.get("message"),
          website: data.get("website"),
        }),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? "No se pudo enviar el mensaje");
      }

      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "No se pudo enviar el formulario. También puedes escribirme directo por WhatsApp.",
      );
    }
  }

  return (
    <section id="contacto" className="section section-muted">
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="eyebrow">Contacto</p>
            <h2 className="section-title">¿Necesitas una página profesional para tu negocio?</h2>
            <p className="section-copy mt-6">
              Puedo ayudarte a convertir tu servicio, empresa o idea en una presencia digital clara,
              funcional y lista para recibir prospectos.
            </p>
            <div className="mt-8 space-y-4 text-sm text-slate-300">
              <p>
                <span className="text-slate-500">WhatsApp</span>
                <br />
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-link"
                >
                  {SITE.phoneDisplay}
                </a>
              </p>
              <p>
                <span className="text-slate-500">Correo</span>
                <br />
                <a href={`mailto:${SITE.email}`} className="contact-link">
                  {SITE.email}
                </a>
              </p>
            </div>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="button button-primary mt-10 inline-flex"
            >
              Escribirme por WhatsApp
            </a>
          </div>

          {status === "success" ? (
            <div className="contact-card flex min-h-[320px] flex-col items-center justify-center text-center">
              <p className="text-xl font-semibold text-white">Mensaje enviado.</p>
              <p className="mt-2 text-slate-400">Te respondo lo antes posible.</p>
              <button
                type="button"
                className="button button-secondary mt-6"
                onClick={() => setStatus("idle")}
              >
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <form className="contact-card" onSubmit={handleSubmit}>
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
                  ¿Qué necesitas desarrollar?
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  className="form-field resize-none"
                  placeholder="Cuéntalo en pocas líneas: página corporativa, landing, formulario, dashboard, integración con WhatsApp..."
                  required
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
                <p className="mt-5 rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {errorMsg}
                </p>
              )}
              <button
                type="submit"
                className="button button-primary mt-6 w-full justify-center"
                disabled={status === "loading"}
              >
                {status === "loading" ? "Enviando..." : "Solicitar cotización"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
