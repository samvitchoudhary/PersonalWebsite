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
