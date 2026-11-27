import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { EnlacesPresentations } from "@/components/sections/EnlacesPresentations";
import { OnboardingIcon } from "@/components/onboarding/OnboardingIcons";
import { buildWhatsAppUrl } from "@/lib/constants";
import styles from "./EnlacesUpdates.module.css";

const ENLACES_WHATSAPP = buildWhatsAppUrl("Hola, vi lo de Enlaces. ¿Cómo le hago para tener uno para mi negocio?");

export const metadata: Metadata = {
  title: "Enlaces NFC y menús | Think Deep",
  description: "Una página de enlaces para tu negocio. Comparte tu menú, reservas, ubicación y WhatsApp con un sticker o llavero NFC.",
};

export default function EnlacesPage() {
  return <><Header /><main id="main" className="enlaces-service">
    <div className="container-page">
      <section className="enlaces-service__hero">
        <p className="section-label">Think Deep Enlaces</p>
        <h1>Todos los enlaces de tu negocio, con solo acercar el celular.</h1>
        <p className="enlaces-service__intro">
          Tu menú, tus reservas y tu WhatsApp en una sola página. Tus clientes la abren con un sticker o un llavero NFC.
        </p>
        <div className="enlaces-service__actions">
          <a href={ENLACES_WHATSAPP} className="button button-primary" target="_blank" rel="noopener noreferrer">
            Escríbenos por WhatsApp <span aria-hidden="true">↗</span>
          </a>
          <a href="https://thinkdeep-enlaces.vercel.app" className="enlaces-service__secondary">
            Ver el portal
          </a>
        </div>
      </section>
      <EnlacesPresentations />
      <section className={styles.updates} aria-labelledby="enlaces-updates">
        <div>
          <h2 id="enlaces-updates">Una página con tus botones</h2>
          <p>Al acercar el celular, tus clientes ven tu logo y los botones que tú elijas. Tú puedes agregar, quitar o reordenar enlaces desde el portal. El mismo sticker o llavero sigue abriendo tu página.</p>
        </div>
        <figure className={styles.example}>
          <div className={styles.phone}>
            <div className={styles.logo} aria-hidden="true">LB</div>
            <h3>Pizzería La Brasa</h3>
            <ul>
              <li><OnboardingIcon id="list" /> Ver menú</li>
              <li><OnboardingIcon id="users" /> Reservar mesa</li>
              <li><OnboardingIcon id="chat" /> Escribir por WhatsApp</li>
              <li><OnboardingIcon id="globe" /> Cómo llegar</li>
            </ul>
          </div>
          <figcaption>Ejemplo de lo que ve tu cliente</figcaption>
        </figure>
      </section>
      <section className="enlaces-service__closing"><div><p className="section-label">Plan mensual</p><h2>$50 MXN <span>/ mes</span></h2><p>El plan mensual cubre la página, el portal para editarla y la bandeja de opiniones. Pregúntanos por el sticker, el llavero o un soporte impreso para el mostrador.</p></div><a href={ENLACES_WHATSAPP} className="button button-primary" target="_blank" rel="noopener noreferrer">Escríbenos por WhatsApp <span aria-hidden="true">↗</span></a></section>
      <p className="enlaces-service__footnote">¿Ya tienes tu portal? <a href="https://thinkdeep-enlaces.vercel.app/entrar">Entra aquí</a>. <Link href="/">Volver a Think Deep</Link>.</p>
    </div>
  </main><Footer /></>;
}
