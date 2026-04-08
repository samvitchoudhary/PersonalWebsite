"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects } from "@/data/content";
import type { ModalTheme } from "@/types";

export function Projects({ theme }: { theme: ModalTheme }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-3">
      {projects.map((p) => {
        const id = p.name;
        const isOpen = openId === id;
        return (
          <div
            key={id}
            className="overflow-hidden rounded-xl"
            style={{ backgroundColor: theme.card }}
          >
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : id)}
              className="flex w-full cursor-pointer items-center justify-between gap-2 px-4 py-3 text-left"
              aria-expanded={isOpen}
            >
              <span
                className="font-serif text-lg font-medium"
                style={{
                  color: theme.accent,
                  fontFamily: "var(--font-crimson-pro), serif",
                }}
              >
                {p.name}
              </span>
              <span className="text-xs opacity-60" aria-hidden>
                {isOpen ? "−" : "+"}
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    duration: 0.35,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                  className="overflow-hidden"
                >
                  <div className="space-y-3 border-t border-white/10 px-4 pb-4 pt-3">
                    <div className="flex flex-wrap gap-2">
                      <span
                        className="rounded-full px-2 py-0.5 text-xs"
                        style={{
                          backgroundColor: `${theme.accent}33`,
                          color: theme.accent,
                        }}
                      >
                        Prep: {p.prep}
                      </span>
                      <span
                        className="rounded-full px-2 py-0.5 text-xs"
                        style={{
                          backgroundColor: `${theme.accent}33`,
                          color: theme.accent,
                        }}
                      >
                        Difficulty: {p.difficulty}
                      </span>
                    </div>
                    <div>
                      <p
                        className="mb-2 text-xs font-semibold uppercase tracking-wider opacity-70"
                        style={{ color: theme.accent }}
                      >
                        Ingredients
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {p.ingredients.map((ing) => (
                          <span
                            key={ing}
                            className="rounded-md px-2 py-0.5 text-xs"
                            style={{
                              backgroundColor: `${theme.accent}33`,
                              color: theme.accent,
                            }}
                          >
                            {ing}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed opacity-95">
                      {p.description}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
