import type { ModalTheme } from "@/types";

export function FridgeComingSoon({ theme }: { theme: ModalTheme }) {
  return (
    <div
      className="rounded-xl p-5"
      style={{ backgroundColor: theme.card }}
    >
      <p
        className="text-sm leading-relaxed opacity-90"
        style={{ fontFamily: "var(--font-crimson-pro), serif" }}
      >
        This section is being restocked... check back soon!
      </p>
    </div>
  );
}
