import Image from "next/image";
import { HERO_PROOFS, SITE, WHATSAPP_URL } from "@/lib/constants";
import { VideoHero } from "@/components/VideoHero";

export function Hero() {
  return (
    <header className="hero-section">
      <div className="container-page relative">
        <div className="grid min-h-screen gap-12 pt-32 pb-20 md:pt-40 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div>
            <p className="eyebrow mb-6">
              {SITE.name} · {SITE.role}
            </p>
            <h1 className="max-w-5xl text-4xl font-semibold leading-[1.06] tracking-normal text-white md:text-6xl lg:text-7xl">
              Desarrollo sitios web y sistemas digitales para negocios que necesitan verse
              profesionales y operar mejor.
            </h1>
            <p className="mt-8 max-w-3xl text-lg leading-8 text-slate-300 md:text-xl">
              Páginas corporativas, formularios de contacto, integraciones con WhatsApp y
              aplicaciones web diseñadas para convertir visitas en prospectos reales.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="button button-primary"
              >
                Solicitar cotización por WhatsApp
              </a>
              <a href="#proyectos" className="button button-secondary">
                Ver proyectos
              </a>
            </div>

            <div className="mt-16 grid gap-4 border-t border-white/10 pt-8 text-sm text-slate-400 md:grid-cols-3">
              {HERO_PROOFS.map((proof) => (
                <p key={proof}>{proof}</p>
              ))}
            </div>
          </div>

          <div className="hero-portrait-wrap">
            <div className="portrait-card">
              <Image
                src="/salvador-barba.png"
                alt={SITE.name}
                fill
                sizes="(min-width: 1024px) 460px, 92vw"
                className="portrait-image"
                priority
              />
              <div className="portrait-shade" />
            </div>

            <div className="portrait-caption">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Enfoque</p>
                <p className="mt-1 font-semibold text-white">
                  Sitios corporativos, formularios y sistemas web para negocios.
                </p>
              </div>
              <div className="caption-stack">
                <span>React</span>
                <span>Next.js</span>
                <span>Vercel</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pb-20">
          <p className="eyebrow mb-4">Demo en video</p>
          <VideoHero />
        </div>
      </div>
    </header>
  );
}
