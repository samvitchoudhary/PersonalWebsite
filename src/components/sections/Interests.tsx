import { interestStations } from "@/data/content";
import type { ModalTheme } from "@/types";

export function Interests({ theme }: { theme: ModalTheme }) {
  return (
    <div className="flex flex-col gap-4">
      {interestStations.map((s) => (
        <div
          key={s.frequency}
          className="rounded-xl p-4"
          style={{ backgroundColor: theme.card }}
        >
          <h3
            className="mb-2 flex flex-wrap items-baseline gap-2 font-serif text-base font-semibold"
            style={{
              color: theme.accent,
              fontFamily: "var(--font-crimson-pro), serif",
            }}
          >
            <span
              className="rounded border px-2 py-0.5 font-mono text-[11px] font-normal tracking-tight"
              style={{
                borderColor: `${theme.accent}55`,
                color: theme.accent,
              }}
            >
              {s.frequency}
            </span>
            <span>— {s.title}</span>
          </h3>
          <p className="text-sm leading-relaxed opacity-90">{s.description}</p>
        </div>
      ))}
    </div>
  );
}
