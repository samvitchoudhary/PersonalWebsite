import type { ModalTheme } from "@/types";

export function FridgeComingSoon({ theme }: { theme: ModalTheme }) {
  return (
    <p className="text-sm leading-relaxed opacity-95" style={{ color: theme.text }}>
      This section is being restocked... check back soon!
    </p>
  );
}
