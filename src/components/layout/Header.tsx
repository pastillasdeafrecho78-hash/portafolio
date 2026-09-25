"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { NAV_LINKS, WHATSAPP_URL } from "@/lib/constants";
import { BrandLogo } from "@/components/BrandLogo";
import { useAppleGlass } from "@/hooks/useAppleGlass";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const barRef = useAppleGlass<HTMLDivElement>({ preset: "header", shape: "pill" });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="container-page">
        <div ref={barRef} className="header-glass">
          <Link href="/" aria-label="Ir al inicio" className="header-brand">
            <BrandLogo size="md" showName />
          </Link>

          <nav className="nav-links" aria-label="Principal">
            {NAV_LINKS.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>

          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="header-cta"
          >
            Iniciar
          </a>
        </div>
      </div>
    </header>
  );
}
