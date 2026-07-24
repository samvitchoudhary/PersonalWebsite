import type { ModalTheme } from "@/types";

export function FridgeComingSoon({ theme }: { theme: ModalTheme }) {
  return (
    <p className="text-base leading-relaxed opacity-95" style={{ color: theme.text }}>
      Coming Soon
    </p>
  );
}
