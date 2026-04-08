import { experiences } from "@/data/content";
import type { ModalTheme } from "@/types";

export function Resume({ theme }: { theme: ModalTheme }) {
  return (
    <div className="flex flex-col gap-5">
      {experiences.map((exp) => (
        <article
          key={`${exp.org}-${exp.period}`}
          className="rounded-r-xl border-l-[3px] py-1 pl-4 pr-2"
          style={{
            borderLeftColor: theme.accent,
            backgroundColor: theme.card,
          }}
        >
          <h3 className="font-serif text-base font-semibold">
            {exp.role}
            <span className="font-normal opacity-80"> at {exp.org}</span>
          </h3>
          <p
            className="mb-2 text-xs uppercase tracking-wider opacity-70"
            style={{ color: theme.accent }}
          >
            {exp.period}
          </p>
          <p className="text-sm leading-relaxed opacity-90">
            {exp.description}
          </p>
        </article>
      ))}
      <a
        href="/resume.pdf"
        download
        className="mx-auto mt-2 inline-flex cursor-pointer items-center justify-center rounded-full border-2 px-6 py-2.5 text-sm font-medium transition-opacity hover:opacity-90"
        style={{
          borderColor: theme.accent,
          color: theme.accent,
        }}
      >
        Download full resume ↓
      </a>
    </div>
  );
}
