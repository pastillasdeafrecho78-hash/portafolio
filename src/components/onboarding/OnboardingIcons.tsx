"use client";

import type { ReactNode } from "react";
import type { OnboardingIconKey } from "@/lib/constants";

export type OnboardingIconId = OnboardingIconKey;

type IconProps = { className?: string };

function I({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

function IconMonitor({ className }: IconProps) {
  return (
    <I className={className}>
      <rect x="3" y="4" width="18" height="13" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </I>
  );
}

function IconMessages({ className }: IconProps) {
  return (
    <I className={className}>
      <path d="M7.5 16.5 4 20V7.5A2.5 2.5 0 0 1 6.5 5h7A2.5 2.5 0 0 1 16 7.5v5a2.5 2.5 0 0 1-2.5 2.5H7.5Z" />
      <path d="M16 8.5h1.5A2.5 2.5 0 0 1 20 11v8.5L17 16.5h-3.5" />
    </I>
  );
}

function IconCamera({ className }: IconProps) {
  return (
    <I className={className}>
      <path d="M4 8.5h2.2l1.4-2h5.8l1.4 2H20a1.5 1.5 0 0 1 1.5 1.5v8A1.5 1.5 0 0 1 20 19.5H4A1.5 1.5 0 0 1 2.5 18v-8A1.5 1.5 0 0 1 4 8.5Z" />
      <circle cx="12" cy="13.5" r="3.25" />
    </I>
  );
}

function IconGlobe({ className }: IconProps) {
  return (
    <I className={className}>
      <circle cx="12" cy="12" r="8.25" />
      <path d="M3.75 12h16.5M12 3.75c2.4 2.6 3.6 5.5 3.6 8.25S14.4 17.65 12 20.25M12 3.75C9.6 6.35 8.4 9.25 8.4 12s1.2 5.9 3.6 8.25" />
    </I>
  );
}

function IconDashboard({ className }: IconProps) {
  return (
    <I className={className}>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.25" />
      <rect x="13.5" y="3.5" width="7" height="4.5" rx="1.25" />
      <rect x="13.5" y="10.5" width="7" height="10" rx="1.25" />
      <rect x="3.5" y="13" width="7" height="7.5" rx="1.25" />
    </I>
  );
}

function IconRocket({ className }: IconProps) {
  return (
    <I className={className}>
      <path d="M12 3.5c2.8 1.2 5.2 3.8 6 7.2-1.2 2.4-3.2 4.2-5.2 5.5l-2.3-.8-.8-2.3C11 10.1 12 6.8 12 3.5Z" />
      <path d="m9.7 14.6-2.8 2.8M14.6 9.7l2.8-2.8" />
      <path d="M8.2 15.8c-1.4.2-2.8 1-3.7 2.5 1.5-.9 2.3-2.3 2.5-3.7Z" />
      <circle cx="14.2" cy="9.8" r="1.1" />
    </I>
  );
}

function IconChat({ className }: IconProps) {
  return (
    <I className={className}>
      <path d="M5 18.5 3.5 21V7.5A3 3 0 0 1 6.5 4.5h11A3 3 0 0 1 20.5 7.5v7a3 3 0 0 1-3 3H5Z" />
      <path d="M8 9.5h8M8 13h5" />
    </I>
  );
}

function IconMail({ className }: IconProps) {
  return (
    <I className={className}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="m4.5 7.5 7.5 5.5 7.5-5.5" />
    </I>
  );
}

function IconFace({ className }: IconProps) {
  return (
    <I className={className}>
      <circle cx="12" cy="12" r="8.25" />
      <circle cx="9" cy="10.5" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="15" cy="10.5" r="0.9" fill="currentColor" stroke="none" />
      <path d="M9 14.5c.8 1.2 2 1.9 3 1.9s2.2-.7 3-1.9" />
    </I>
  );
}

function IconScan({ className }: IconProps) {
  return (
    <I className={className}>
      <path d="M4.5 8V5.5H8M16 5.5h3.5V8M19.5 16v3.5H16M8 19.5H4.5V16" />
      <circle cx="12" cy="12" r="3.25" />
    </I>
  );
}

function IconList({ className }: IconProps) {
  return (
    <I className={className}>
      <path d="M9.5 7h10M9.5 12h10M9.5 17h10" />
      <path d="m4.5 7 1.2 1.2L7.5 6.4M4.5 12l1.2 1.2L7.5 11.4M4.5 17l1.2 1.2L7.5 16.4" />
    </I>
  );
}

function IconBuilding({ className }: IconProps) {
  return (
    <I className={className}>
      <path d="M4.5 20.5h15" />
      <path d="M6.5 20.5V6.5l5-2.5 5 2.5v14" />
      <path d="M10 9h1M13 9h1M10 12.5h1M13 12.5h1M10 16h1M13 16h1" />
    </I>
  );
}

function IconUser({ className }: IconProps) {
  return (
    <I className={className}>
      <circle cx="12" cy="8" r="3.25" />
      <path d="M5.5 19.5c1.4-3 3.6-4.5 6.5-4.5s5.1 1.5 6.5 4.5" />
    </I>
  );
}

function IconPackage({ className }: IconProps) {
  return (
    <I className={className}>
      <path d="m4.5 8 7.5-3.5L19.5 8l-7.5 3.5L4.5 8Z" />
      <path d="M4.5 8v8.5L12 20l7.5-3.5V8" />
      <path d="M12 11.5V20" />
    </I>
  );
}

function IconCart({ className }: IconProps) {
  return (
    <I className={className}>
      <path d="M3.5 5h2l1.6 9.2a1.5 1.5 0 0 0 1.5 1.3h8.3a1.5 1.5 0 0 0 1.5-1.2L19.5 8H7" />
      <circle cx="9.5" cy="19" r="1.15" />
      <circle cx="16.5" cy="19" r="1.15" />
    </I>
  );
}

function IconUsers({ className }: IconProps) {
  return (
    <I className={className}>
      <circle cx="9" cy="8.5" r="2.75" />
      <path d="M3.5 19c.9-2.6 2.7-4 5.5-4s4.6 1.4 5.5 4" />
      <circle cx="16.5" cy="9" r="2.25" />
      <path d="M15 15c1.9.2 3.4 1.2 4.5 3.5" />
    </I>
  );
}

function IconChart({ className }: IconProps) {
  return (
    <I className={className}>
      <path d="M4.5 19.5h15" />
      <path d="M7 19.5V11M12 19.5V6.5M17 19.5v-5" />
    </I>
  );
}

function IconZap({ className }: IconProps) {
  return (
    <I className={className}>
      <path d="M13 3.5 6.5 13h5l-1 7.5L17.5 11h-5l.5-7.5Z" />
    </I>
  );
}

function IconPen({ className }: IconProps) {
  return (
    <I className={className}>
      <path d="m14.2 5.3 4.5 4.5M5 16.2 15.8 5.4a1.7 1.7 0 0 1 2.4 0l.4.4a1.7 1.7 0 0 1 0 2.4L7.8 19H5v-2.8Z" />
    </I>
  );
}

const ICONS: Record<OnboardingIconId, (props: IconProps) => ReactNode> = {
  monitor: IconMonitor,
  messages: IconMessages,
  camera: IconCamera,
  globe: IconGlobe,
  dashboard: IconDashboard,
  rocket: IconRocket,
  chat: IconChat,
  mail: IconMail,
  face: IconFace,
  scan: IconScan,
  list: IconList,
  building: IconBuilding,
  user: IconUser,
  package: IconPackage,
  cart: IconCart,
  users: IconUsers,
  chart: IconChart,
  zap: IconZap,
  pen: IconPen,
};

export function OnboardingIcon({
  id,
  className = "glass-option__icon-svg",
}: {
  id: OnboardingIconId;
  className?: string;
}) {
  const Comp = ICONS[id] ?? IconPen;
  return <>{Comp({ className })}</>;
}
