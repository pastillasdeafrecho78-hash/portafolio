"use client";

import { useEffect, useState } from "react";
import { NAV_LINKS, SITE, WHATSAPP_URL } from "@/lib/constants";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/10 bg-[#08090b]/90 py-3 backdrop-blur-xl"
          : "py-5"
      }`}
    >
      <div className="container-page flex items-center justify-between">
        <a href="#" className="group" aria-label="Ir al inicio">
          <div className="leading-none">
            <p className="text-sm font-semibold tracking-[0.28em] text-white">{SITE.shortName}</p>
            <p className="mt-1 hidden text-xs text-slate-400 sm:block">Web developer</p>
          </div>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </div>

        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="button button-small button-primary"
        >
          Solicitar cotización
        </a>
      </div>
    </nav>
  );
}
