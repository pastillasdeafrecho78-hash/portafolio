"use client";

import Link from "next/link";
import { StorePanel } from "@/components/lumen/store/StorePanel";
import { CartDrawer } from "@/components/lumen/store/CartDrawer";
import { FloatingAgentBubble } from "@/components/lumen/agent/FloatingAgentBubble";

export default function LumenDemoPage() {
  return (
    <div className="lumen-scope">
      <header className="lumen-topbar">
        <div className="container-page flex items-center justify-between py-4">
          <Link href="/lumen" className="text-sm text-slate-400 hover:text-white">
            ← Volver
          </Link>
          <span className="text-sm font-bold text-white">Lúmen Outfit · Demo</span>
        </div>
      </header>

      <main id="main" className="demo-layout demo-layout--store">
        <StorePanel />
      </main>
      <CartDrawer />
      <FloatingAgentBubble />
    </div>
  );
}
