"use client";

import { GlassSurface } from "@/components/effects/GlassCTA";
import { OFFERS } from "@/lib/constants";

export function Services() {
  return (
    <section id="servicios" className="section section-rule">
      <div className="container-page">
        <div className="section-heading">
          <p className="section-label">Ofertas</p>
          <h2 className="section-title">Tres trabajos de código. Precio fijo.</h2>
          <p className="section-copy">
            Sitio, chats o panel. Eliges uno, pagas el anticipo y arrancamos.
          </p>
        </div>

        <div id="ofertas" className="hero-offers scroll-mt-28" aria-label="Ofertas">
          {OFFERS.map((offer) => (
            <GlassSurface key={offer.id} as="article" preset="panel" className="hero-offer">
              <h3>{offer.title}</h3>
              <p className="hero-offer-price">{offer.price}</p>
              <p>{offer.description}</p>
              <p className="hero-offer-meta">
                {offer.turnaround} · {offer.deposit}
              </p>
            </GlassSurface>
          ))}
        </div>
      </div>
    </section>
  );
}
