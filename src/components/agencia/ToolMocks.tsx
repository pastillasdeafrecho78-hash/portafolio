"use client";

import type { ReactNode } from "react";
import { GlassSurface } from "@/components/effects/GlassCTA";

type MockKind = "landing" | "panel" | "integrations" | "chats";

type Item = {
  id: string;
  title: string;
  mock: MockKind;
};

function MockChrome({ children }: { children: ReactNode }) {
  return (
    <div className="tool-mock__chrome" aria-hidden>
      <div className="tool-mock__dots">
        <span />
        <span />
        <span />
      </div>
      <div className="tool-mock__screen">{children}</div>
    </div>
  );
}

function MockBody({ kind }: { kind: MockKind }) {
  if (kind === "landing") {
    return (
      <div className="tool-mock__landing">
        <div className="tool-mock__hero-bar" />
        <div className="tool-mock__hero-block" />
        <div className="tool-mock__cta" />
      </div>
    );
  }
  if (kind === "panel") {
    return (
      <div className="tool-mock__panel">
        <div className="tool-mock__side" />
        <div className="tool-mock__table">
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>
    );
  }
  if (kind === "integrations") {
    return (
      <div className="tool-mock__integrations">
        <i />
        <em />
        <i />
        <em />
        <i />
      </div>
    );
  }
  return (
    <div className="tool-mock__chats">
      <b />
      <b className="is-me" />
      <b />
    </div>
  );
}

export function ToolMocks({ items }: { items: readonly Item[] }) {
  return (
    <div className="tool-mocks">
      {items.map((item) => (
        <GlassSurface key={item.id} as="article" preset="panel" className="tool-mock">
          <MockChrome>
            <MockBody kind={item.mock} />
          </MockChrome>
          <h3>{item.title}</h3>
        </GlassSurface>
      ))}
    </div>
  );
}
