"use client";

import {
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ModalTheme } from "@/types";

const openTransition = {
  duration: 0.5,
  ease: [0.16, 1, 0.3, 1] as const,
};

const closeTransition = {
  duration: 0.3,
  ease: [0.16, 1, 0.3, 1] as const,
};

interface ModalProps {
  open: boolean;
  onClose: () => void;
  onExitComplete?: () => void;
  subtitle: string;
  title: string;
  theme: ModalTheme;
  children: ReactNode;
}

export function Modal({
  open,
  onClose,
  onExitComplete,
  subtitle,
  title,
  theme,
  children,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
      );
      const list = Array.from(focusable).filter(
        (el) => el.offsetParent !== null || el === closeBtnRef.current,
      );
      if (list.length === 0) return;

      const first = list[0];
      const last = list[list.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (e.shiftKey) {
        if (active === first || !panelRef.current.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else if (active === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    const t = window.setTimeout(() => closeBtnRef.current?.focus(), 50);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
      window.clearTimeout(t);
    };
  }, [open, handleKeyDown]);

  return (
    <AnimatePresence onExitComplete={onExitComplete}>
      {open && (
        <>
          <motion.button
            key="modal-backdrop"
            type="button"
            aria-label="Close dialog"
            className="fixed inset-0 z-[100] cursor-default border-0 bg-[rgba(10,8,5,0.8)] p-0 backdrop-blur-[12px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />
          <div
            className="pointer-events-none fixed inset-0 z-[101] flex items-center justify-center p-[4vw]"
            role="presentation"
          >
            <motion.div
              key="modal-panel"
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
              aria-describedby="modal-subtitle"
              className="pointer-events-auto relative flex max-h-[85vh] w-[92vw] max-w-[520px] flex-col overflow-hidden rounded-[20px] shadow-[0_24px_80px_rgba(0,0,0,0.5)]"
              style={{
                backgroundColor: theme.bg,
                color: theme.text,
              }}
              variants={{
                hidden: {
                  opacity: 0,
                  scale: 0.9,
                  y: 20,
                  transition: closeTransition,
                },
                visible: {
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  transition: openTransition,
                },
              }}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                ref={closeBtnRef}
                type="button"
                onClick={onClose}
                className="absolute right-3 top-3 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/10 text-lg leading-none text-white/90 transition-colors hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(212,160,60,0.7)]"
                aria-label="Close"
              >
                ×
              </button>
              <div className="shrink-0 px-6 pb-3 pt-10">
                <p
                  id="modal-subtitle"
                  className="mb-1 text-[11px] font-medium uppercase tracking-[0.2em] opacity-80"
                  style={{ color: theme.accent }}
                >
                  {subtitle}
                </p>
                <h2
                  id="modal-title"
                  className="font-serif text-2xl font-semibold tracking-tight sm:text-[1.75rem]"
                  style={{ fontFamily: "var(--font-crimson-pro), serif" }}
                >
                  {title}
                </h2>
              </div>
              <div
                className="min-h-0 flex-1 overflow-y-auto px-6 pb-8 pt-1"
                style={{ scrollbarColor: `${theme.accent}33 transparent` }}
              >
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
