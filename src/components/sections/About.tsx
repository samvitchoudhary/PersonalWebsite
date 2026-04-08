import { aboutFacts } from "@/data/content";
import type { ModalTheme } from "@/types";

export function About({ theme }: { theme: ModalTheme }) {
  return (
    <ul className="flex flex-col gap-3">
      {aboutFacts.map((fact) => (
        <li
          key={fact.text}
          className="flex gap-3 rounded-xl px-4 py-3 text-sm leading-relaxed shadow-sm"
          style={{ backgroundColor: theme.card }}
        >
          <span className="shrink-0 text-xl" aria-hidden>
            {fact.emoji}
          </span>
          <span>{fact.text}</span>
        </li>
      ))}
    </ul>
  );
}
