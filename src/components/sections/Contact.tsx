import { contactLinks } from "@/data/content";
import type { ModalTheme } from "@/types";

export function Contact({ theme }: { theme: ModalTheme }) {
  return (
    <div className="flex flex-col items-center gap-6">
      <p className="max-w-sm text-center text-sm leading-relaxed opacity-90">
        Want to chat, collaborate, or just say hello? Reach out through any of
        the channels below.
      </p>
      <ul className="flex w-full max-w-[280px] flex-col gap-3">
        {contactLinks.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={
                link.href.startsWith("http")
                  ? "noopener noreferrer"
                  : undefined
              }
              className="flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm transition-opacity hover:opacity-95"
              style={{ backgroundColor: theme.card, color: theme.text }}
            >
              <span className="text-xl" aria-hidden>
                {link.emoji}
              </span>
              <span className="min-w-0 flex-1">
                <span
                  className="block text-xs font-medium uppercase tracking-wider opacity-70"
                  style={{ color: theme.accent }}
                >
                  {link.label}
                </span>
                <span className="block truncate">{link.value}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
