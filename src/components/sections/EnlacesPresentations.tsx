"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { buildWhatsAppUrl } from "@/lib/constants";

const presentations = [
  {
    title: "Sticker NFC",
    action: "Quiero un sticker",
    message: "Hola, vi lo de Enlaces. Me interesa un sticker NFC para mi negocio.",
    image: "/enlaces/sticker-nfc-la-brasa.png",
    alt: "Sticker NFC de Pizzería La Brasa pegado al costado de un servilletero",
    description: "Pégalo en un servilletero, una mesa o el mostrador. Podemos agregar un QR al diseño para celulares sin NFC.",
  },
  {
    title: "Llavero NFC",
    action: "Quiero un llavero",
    message: "Hola, vi lo de Enlaces. Me interesa un llavero NFC con un diseño para mi negocio.",
    image: "/enlaces/llavero-nfc-la-brasa.png",
    alt: "Llavero NFC de La Brasa con forma de rebanada de pizza, base naranja y relieve dorado",
    description: "Hacemos tu llavero en 3D con base naranja y detalles dorados en relieve. Lo podemos adaptar a la forma o al logo de tu negocio.",
  },
];

export function EnlacesPresentations() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const images = Array.from(gridRef.current?.querySelectorAll<HTMLElement>(".enlaces-presentation__image") ?? []);
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mouse = window.matchMedia("(any-hover: hover) and (any-pointer: fine)");
    let frame = 0;
    let point: { x: number; y: number } | null = null;

    function update() {
      frame = 0;
      for (const image of images) {
        if (!point || motion.matches || !mouse.matches) {
          image.style.removeProperty("--presentation-scale");
          continue;
        }

        const box = image.getBoundingClientRect();
        const dx = Math.max(box.left - point.x, 0, point.x - box.right);
        const dy = Math.max(box.top - point.y, 0, point.y - box.bottom);
        const proximity = Math.max(0, 1 - Math.hypot(dx, dy) / 160);
        image.style.setProperty("--presentation-scale", String(1 + proximity * 0.075));
      }
    }

    function schedule() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    function move(event: PointerEvent) {
      if (event.pointerType === "touch") return;
      point = { x: event.clientX, y: event.clientY };
      schedule();
    }

    function reset() {
      point = null;
      schedule();
    }

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerout", leaveWindow);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("blur", reset);
    motion.addEventListener("change", reset);
    mouse.addEventListener("change", reset);

    function leaveWindow(event: PointerEvent) {
      if (!event.relatedTarget) reset();
    }

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerout", leaveWindow);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("blur", reset);
      motion.removeEventListener("change", reset);
      mouse.removeEventListener("change", reset);
    };
  }, []);

  return (
    <section className="enlaces-service__presentations" aria-labelledby="enlaces-presentations">
      <h2 id="enlaces-presentations">Elige cómo quieres tu NFC</h2>
      <div ref={gridRef} className="enlaces-service__details">
        {presentations.map((presentation) => (
          <article className="enlaces-presentation" key={presentation.title}>
            <div className="enlaces-presentation__image">
              <Image
                src={presentation.image}
                alt={presentation.alt}
                fill
                sizes="(max-width: 620px) 88vw, (max-width: 1050px) 44vw, 470px"
              />
            </div>
            <h3>{presentation.title}</h3>
            <p>{presentation.description}</p>
            <a
              className="enlaces-presentation__action"
              href={buildWhatsAppUrl(presentation.message)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${presentation.action} por WhatsApp`}
            >
              {presentation.action} <span aria-hidden="true">↗</span>
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
