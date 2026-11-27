import { GlassSurface } from "@/components/effects/GlassCTA";
import { OnboardingIcon } from "@/components/onboarding/OnboardingIcons";
import styles from "./HeroInquiry.module.css";

export function HeroInquiry() {
  return (
    <GlassSurface as="article" className={styles.panel} aria-labelledby="agencia-inquiry-title">
      <h2 id="agencia-inquiry-title">Así llega una consulta</h2>
      <ol className={styles.route} aria-label="Recorrido de ejemplo">
        <li><OnboardingIcon id="chart" /> Anuncio</li>
        <li><OnboardingIcon id="list" /> Formulario</li>
        <li><OnboardingIcon id="chat" /> WhatsApp</li>
      </ol>
      <blockquote>«Hola, ¿tienen disponibilidad para este sábado?»</blockquote>
      <p>Tu equipo recibe la consulta y ve de qué anuncio llegó.</p>
    </GlassSurface>
  );
}
