import type { SVGProps } from "react";

export function SaleSyncIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Sale icon"
      {...props}
    >
      {/* Tag */}
      <path
        d="M10 18 L36 18 L52 32 L36 46 L10 46 Z"
        fill="#f6c453"
        stroke="#183a1d"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Tag hole */}
      <circle cx="16" cy="32" r="3" fill="#183a1d" />

      {/* Percent sign */}
      <circle cx="26" cy="27" r="3" fill="#183a1d" />
      <circle cx="34" cy="37" r="3" fill="#183a1d" />
      <line
        x1="24"
        y1="40"
        x2="36"
        y2="24"
        stroke="#183a1d"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
