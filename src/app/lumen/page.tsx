import type { Metadata } from "next";
import Link from "next/link";
import { LumenIntroVideo, CapabilitiesStrip, LandingCta } from "@/components/lumen/LumenIntroVideo";

export const metadata: Metadata = {
  title: "Lúmen Outfit — Tienda agéntica (demo)",
  description:
    "Demo de tienda en línea con un asistente que navega, recomienda y agrega al carrito en tiempo real.",
};

export default function LumenLandingPage() {
  return (
    <div className="lumen-scope">
      <header className="lumen-topbar">
        <div className="container-page flex items-center justify-between py-4">
          <span className="text-sm font-bold text-white">Lúmen Outfit</span>
          <Link href="/" className="text-sm text-slate-400 hover:text-white">
            ← Volver al portafolio
          </Link>
        </div>
      </header>

      <main id="main">
        <section className="landing-hero">
          <div className="container-page">
            <p className="eyebrow mb-4">Demo · Tienda agéntica</p>
            <h1 className="section-title max-w-4xl">
              ¿Y si tu tienda entendiera lo que quieres y navegara por ti?
            </h1>
            <p className="section-copy mt-6">
              Lúmen Outfit es una demo de compra asistida: un asistente que conoce el catálogo,
              resalta productos, te lleva a donde necesitas y mete cosas al carrito mientras
              conversa contigo.
            </p>
            <LandingCta />
            <LumenIntroVideo />
            <CapabilitiesStrip />
          </div>
        </section>
      </main>
    </div>
  );
}
