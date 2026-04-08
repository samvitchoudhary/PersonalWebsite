import { skillCategories } from "@/data/content";
import type { ModalTheme } from "@/types";

export function Skills({ theme }: { theme: ModalTheme }) {
  return (
    <div className="flex flex-col gap-6">
      {skillCategories.map((cat) => (
        <div key={cat.name}>
          <h3
            className="mb-2 font-serif text-sm font-semibold uppercase tracking-[0.15em]"
            style={{
              color: theme.accent,
              fontFamily: "var(--font-crimson-pro), serif",
            }}
          >
            {cat.name}
          </h3>
          <div className="flex flex-wrap gap-2">
            {cat.items.map((item) => (
              <span
                key={item}
                className="rounded-lg px-3 py-1.5 text-sm"
                style={{
                  backgroundColor: theme.card,
                  color: theme.text,
                  border: `1px solid ${theme.accent}40`,
                }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
