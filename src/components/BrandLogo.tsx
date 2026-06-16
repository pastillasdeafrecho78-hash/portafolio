import Image from "next/image";
import { SITE } from "@/lib/constants";

type BrandLogoProps = {
  size?: "sm" | "md" | "lg";
  showName?: boolean;
  className?: string;
};

const sizes = {
  sm: { box: "h-10 w-10", image: 40, radius: "rounded-xl" },
  md: { box: "h-12 w-12", image: 48, radius: "rounded-2xl" },
  lg: { box: "h-16 w-16", image: 64, radius: "rounded-2xl" },
} as const;

export function BrandLogo({ size = "md", showName = false, className = "" }: BrandLogoProps) {
  const s = sizes[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className={`relative shrink-0 overflow-hidden border border-white/12 bg-[#0a0a0a] shadow-[0_8px_32px_rgba(0,0,0,0.4)] ${s.box} ${s.radius}`}
      >
        <Image
          src="/logo-salvador-barba.png"
          alt={`Logo ${SITE.name}`}
          width={s.image}
          height={s.image}
          className="h-full w-full object-cover"
          priority={size !== "lg"}
        />
      </div>
      {showName && (
        <div className="leading-none">
          <p className="text-sm font-semibold text-white">{SITE.name}</p>
          <p className="mt-1 hidden text-xs text-slate-400 sm:block">{SITE.role}</p>
        </div>
      )}
    </div>
  );
}
