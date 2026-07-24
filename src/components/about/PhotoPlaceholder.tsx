import type { ReactNode } from "react";

/**
 * Warm-toned placeholder for /public/about/ photos.
 * Replace the outer div with <Image src="/about/your.jpg" ... /> when ready.
 */
export function PhotoPlaceholder({
  tone,
  className = "",
  children,
  noRound = false,
}: {
  tone: string;
  className?: string;
  children?: ReactNode;
  /** Full-bleed blocks (e.g. parallax) without rounded corners */
  noRound?: boolean;
}) {
  return (
    <div
      className={`flex min-h-[120px] items-center justify-center overflow-hidden ${noRound ? "rounded-none" : "rounded-2xl"} ${className}`}
      style={{ backgroundColor: tone }}
    >
      {children ?? (
        <span
          className="px-4 text-center text-sm italic"
          style={{ color: "#B8A888" }}
        >
          photo coming soon
        </span>
      )}
    </div>
  );
}

/** Real photo with the same layout shell as PhotoPlaceholder */
export function AboutPhoto({
  src,
  alt,
  className = "",
  noRound = false,
}: {
  src: string;
  alt: string;
  className?: string;
  noRound?: boolean;
}) {
  return (
    <div
      className={`min-h-[120px] overflow-hidden ${noRound ? "rounded-none" : "rounded-2xl"} ${className}`}
    >
      <img src={src} alt={alt} className="h-full w-full object-cover" />
    </div>
  );
}
