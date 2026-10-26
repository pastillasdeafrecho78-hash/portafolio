import Link from "next/link";
import { GlassSurface } from "@/components/effects/GlassCTA";

export function EnlacesPromo() {
  return <section className="section enlaces-promo" aria-labelledby="enlaces-promo-title">
    <div className="container-page">
      <GlassSurface as="article" preset="panel" className="enlaces-promo__card">
        <div className="enlaces-promo__copy">
          <p className="section-label">Nuevo servicio · Think Deep Enlaces</p>
          <h2 id="enlaces-promo-title">Un toque abre tu menú y todos tus enlaces.</h2>
          <p>Crea una página para tu negocio, cambia el menú y los botones cuando quieras y recibe opiniones privadas. El enlace de tu NFC o QR permanece igual.</p>
        </div>
        <div className="enlaces-promo__action"><strong>$50 MXN <span>/ mes</span></strong><Link href="/enlaces">Conocer el servicio <span aria-hidden="true">↗</span></Link></div>
      </GlassSurface>
    </div>
  </section>;
}
