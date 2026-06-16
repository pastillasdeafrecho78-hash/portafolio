import { NAV_LINKS, SITE, WHATSAPP_URL } from "@/lib/constants";
import { BrandLogo } from "@/components/BrandLogo";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#08090b] py-10 text-sm text-slate-400">
      <div className="container-page">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <BrandLogo size="lg" showName className="mb-4" />
            <p className="max-w-md leading-6">
              Desarrollador web freelance para páginas corporativas, formularios, integraciones con
              WhatsApp y aplicaciones web para negocios.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="font-medium text-white">Navegación</p>
              <div className="mt-3 flex flex-col gap-2">
                {NAV_LINKS.map((link) => (
                  <a key={link.href} href={link.href} className="footer-link">
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <p className="font-medium text-white">Contacto</p>
              <div className="mt-3 flex flex-col gap-2">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  WhatsApp: {SITE.phoneDisplay}
                </a>
                <a href={`mailto:${SITE.email}`} className="footer-link">
                  {SITE.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} {SITE.name}. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
