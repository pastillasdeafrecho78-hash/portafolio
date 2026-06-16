import type { Metadata } from "next";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { BondingVideoPlayer } from "@/components/bonding/BondingVideoPlayer";

export const metadata: Metadata = {
  title: "Salvador Barba García — Demo localización audiovisual",
  description: "Demo multilingüe de localización audiovisual asistida por IA.",
  robots: { index: false, follow: false },
};

export default function BondingPage() {
  return (
    <div className="bonding-screen">
      <header className="bonding-screen-header">
        <Link href="/" className="bonding-screen-logo" aria-label="Volver al portafolio">
          <BrandLogo size="md" showName />
        </Link>
      </header>
      <main id="main" className="bonding-screen-main">
        <BondingVideoPlayer />
      </main>
    </div>
  );
}
