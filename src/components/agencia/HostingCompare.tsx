"use client";

import { GlassSurface } from "@/components/effects/GlassCTA";

type Col = {
  title: string;
  items: readonly { ok: boolean; text: string }[];
};

export function HostingCompare({
  left,
  right,
}: {
  left: Col;
  right: Col;
}) {
  return (
    <div className="host-compare">
      <GlassSurface as="article" preset="panel" className="host-compare__col">
        <h3>{left.title}</h3>
        <ul>
          {left.items.map((item) => (
            <li key={item.text}>
              <span className="host-compare__x" aria-hidden>
                ×
              </span>
              {item.text}
            </li>
          ))}
        </ul>
      </GlassSurface>
      <GlassSurface as="article" preset="panel" className="host-compare__col is-good">
        <h3>{right.title}</h3>
        <ul>
          {right.items.map((item) => (
            <li key={item.text}>
              <span className="host-compare__check" aria-hidden>
                ✓
              </span>
              {item.text}
            </li>
          ))}
        </ul>
      </GlassSurface>
    </div>
  );
}
