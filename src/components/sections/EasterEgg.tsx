import { easterFacts } from "@/data/content";
import type { ModalTheme } from "@/types";

export function EasterEgg({ theme }: { theme: ModalTheme }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm leading-relaxed opacity-90">
        You found the kitchen timer! Here are some fun facts:
      </p>
      <ol className="flex list-none flex-col gap-3 p-0">
        {easterFacts.map((fact, i) => (
          <li key={i} className="flex gap-3 text-sm leading-relaxed">
            <span
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
              style={{
                backgroundColor: `${theme.accent}33`,
                color: theme.accent,
              }}
            >
              {i + 1}
            </span>
            <span
              className="flex-1 rounded-lg px-3 py-2"
              style={{ backgroundColor: theme.card }}
            >
              {fact}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
