import { NAV_LINKS, SITE, WHATSAPP_URL } from "@/lib/constants";
import { BrandLogo } from "@/components/BrandLogo";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container-page">
        <div className="footer-grid">
          <div className="footer-brand">
            <BrandLogo size="lg" showName />
            <p>
              Desarrollo web, automatización y producto digital por proyecto. Trabajo dirigido por{" "}
              {SITE.director}.
            </p>
          </div>

          <div className="footer-col">
            <h3>Navegación</h3>
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </div>

          <div className="footer-col">
            <h3>Contacto</h3>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              WhatsApp: {SITE.phoneDisplay}
            </a>
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            <a href="#">{SITE.location}</a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} {SITE.name}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
