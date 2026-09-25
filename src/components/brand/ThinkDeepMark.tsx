"use client";

import { forwardRef, useId } from "react";
import {
  SYMBOL_HEIGHT,
  SYMBOL_PATH_D,
  SYMBOL_STROKE_WIDTH,
  SYMBOL_VIEWBOX,
  SYMBOL_WIDTH,
} from "@/lib/symbolPath";

type Props = {
  className?: string;
};

/**
 * Brand mark = real symbol.png, revealed by DrawSVG on a mask path.
 * The visible pixels are always the brand file — never a redrawn stroke.
 */
export const ThinkDeepMark = forwardRef<SVGPathElement, Props>(
  function ThinkDeepMark({ className = "" }, ref) {
    const uid = useId().replace(/:/g, "");
    const maskId = `td-mark-mask-${uid}`;

    return (
      <svg
        className={`think-deep-mark ${className}`.trim()}
        viewBox={SYMBOL_VIEWBOX}
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <mask
            id={maskId}
            maskUnits="userSpaceOnUse"
            x={0}
            y={0}
            width={SYMBOL_WIDTH}
            height={SYMBOL_HEIGHT}
          >
            <rect width={SYMBOL_WIDTH} height={SYMBOL_HEIGHT} fill="black" />
            <path
              ref={ref}
              className="think-deep-mark__stroke"
              d={SYMBOL_PATH_D}
              stroke="white"
              strokeWidth={SYMBOL_STROKE_WIDTH}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </mask>
        </defs>

        <image
          href="/brand/symbol.png"
          width={SYMBOL_WIDTH}
          height={SYMBOL_HEIGHT}
          mask={`url(#${maskId})`}
          preserveAspectRatio="xMidYMid meet"
        />
      </svg>
    );
  },
);
