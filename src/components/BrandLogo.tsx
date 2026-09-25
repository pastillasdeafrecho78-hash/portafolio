import Image from "next/image";

type BrandLogoProps = {
  size?: "sm" | "md" | "lg";
  showName?: boolean;
  className?: string;
};

export function BrandLogo({ size = "md", showName = true, className = "" }: BrandLogoProps) {
  const symbolClass = size === "lg" ? "brand-symbol brand-symbol--lg" : "brand-symbol";

  return (
    <span className={`brand-lockup ${className}`}>
      <Image
        src="/brand/symbol.png"
        alt=""
        width={120}
        height={94}
        className={symbolClass}
        priority={size !== "lg"}
        unoptimized
        aria-hidden
      />
      {showName && <span className="brand-wordmark">think deep</span>}
    </span>
  );
}
