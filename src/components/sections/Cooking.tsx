import { cookingItems } from "@/data/content";
import type { ModalTheme } from "@/types";

export function Cooking({ theme }: { theme: ModalTheme }) {
  return (
    <div className="flex flex-col gap-4">
      {cookingItems.map((item) => (
        <div
          key={item.title}
          className="rounded-xl p-4"
          style={{ backgroundColor: theme.card }}
        >
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <h3
              className="font-serif text-lg font-medium"
              style={{
                color: theme.accent,
                fontFamily: "var(--font-crimson-pro), serif",
              }}
            >
              {item.title}
            </h3>
            <span
              className="rounded-full px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide"
              style={{
                backgroundColor:
                  item.status === "Active"
                    ? `${theme.accent}40`
                    : "rgba(255,255,255,0.12)",
                color: theme.text,
              }}
            >
              {item.status}
            </span>
          </div>
          <p className="text-sm leading-relaxed opacity-90">
            {item.description}
          </p>
        </div>
      ))}
    </div>
  );
}
