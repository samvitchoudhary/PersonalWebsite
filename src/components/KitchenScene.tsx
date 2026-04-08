"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { hotspots } from "@/data/hotspots";
import type { HotspotId, ModalTheme } from "@/types";
import { KitchenHotspotOverlay } from "./KitchenHotspotOverlay";
import { Modal } from "./Modal";
import { Projects } from "./sections/Projects";
import { Skills } from "./sections/Skills";
import { About } from "./sections/About";
import { Cooking } from "./sections/Cooking";
import { Resume } from "./sections/Resume";
import { Interests } from "./sections/Interests";
import { Contact } from "./sections/Contact";
import { EasterEgg } from "./sections/EasterEgg";
import { FridgeComingSoon } from "./sections/FridgeComingSoon";
import type { ComponentType } from "react";

type SectionComponent = ComponentType<{ theme: ModalTheme }>;

const modalRegistry: Record<
  HotspotId,
  {
    subtitle: string;
    title: string;
    theme: ModalTheme;
    Section: SectionComponent;
  }
> = {
  projects: {
    subtitle: "Recipe Book",
    title: "Projects",
    theme: {
      bg: "#2C1810",
      accent: "#D4A03C",
      text: "#F5E6C8",
      card: "#3D261A",
    },
    Section: Projects,
  },
  skills: {
    subtitle: "Spice Rack",
    title: "Skills",
    theme: {
      bg: "#1A2A1A",
      accent: "#7CB87A",
      text: "#E8F0E4",
      card: "#243424",
    },
    Section: Skills,
  },
  fridge: {
    subtitle: "Coming Soon",
    title: "The Fridge",
    theme: {
      bg: "#1A2030",
      accent: "#5B8CB8",
      text: "#D4E8F0",
      card: "#243040",
    },
    Section: FridgeComingSoon,
  },
  about: {
    subtitle: "About Me",
    title: "Samvit",
    theme: {
      bg: "#1A2030",
      accent: "#5B8CB8",
      text: "#D4E8F0",
      card: "#243040",
    },
    Section: About,
  },
  cooking: {
    subtitle: "Stove & Pot",
    title: "What's Cooking",
    theme: {
      bg: "#2A1A10",
      accent: "#E07B5B",
      text: "#F5E0D0",
      card: "#3D2818",
    },
    Section: Cooking,
  },
  resume: {
    subtitle: "Chalkboard",
    title: "Resume",
    theme: {
      bg: "#1A2420",
      accent: "#D4CEBC",
      text: "#E8E4D8",
      card: "#2D4A3E",
    },
    Section: Resume,
  },
  interests: {
    subtitle: "Radio",
    title: "Interests",
    theme: {
      bg: "#2A2018",
      accent: "#D4A03C",
      text: "#F0E8D8",
      card: "#3D3020",
    },
    Section: Interests,
  },
  contact: {
    subtitle: "Window",
    title: "Contact",
    theme: {
      bg: "#1A2A3A",
      accent: "#8BBAD4",
      text: "#D4E8F0",
      card: "#243444",
    },
    Section: Contact,
  },
  easter: {
    subtitle: "Kitchen Timer",
    title: "???",
    theme: {
      bg: "#2A2420",
      accent: "#D4C19A",
      text: "#F0E8D8",
      card: "#3D3428",
    },
    Section: EasterEgg,
  },
};

export function KitchenScene() {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeId, setActiveId] = useState<HotspotId | null>(null);
  const [showHint, setShowHint] = useState(true);
  const [hotspotDebug, setHotspotDebug] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target;
      if (
        t instanceof HTMLInputElement ||
        t instanceof HTMLTextAreaElement ||
        (t instanceof HTMLElement && t.isContentEditable)
      ) {
        return;
      }
      if (e.key === "d" || e.key === "D") {
        setHotspotDebug((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const openHotspot = useCallback((id: HotspotId) => {
    setActiveId(id);
    setModalOpen(true);
    setShowHint(false);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  const handleExitComplete = useCallback(() => {
    setActiveId(null);
  }, []);

  const cfg = activeId ? modalRegistry[activeId] : null;
  const Section = cfg?.Section;

  return (
    <div
      className="relative overflow-hidden"
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        margin: 0,
        padding: 0,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/PersonalWebsite.png"
        alt=""
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          zIndex: 0,
        }}
      />
      <KitchenHotspotOverlay
        hotspots={hotspots}
        debug={hotspotDebug}
        onOpen={openHotspot}
      />

      {hotspotDebug && (
        <div className="pointer-events-none fixed left-3 top-3 z-[70] rounded-md border border-red-500/60 bg-black/70 px-2 py-1 font-mono text-[11px] text-red-300">
          Hotspot debug — press D to hide · click polygons logs coords
        </div>
      )}

      <AnimatePresence>
        {showHint && (
          <motion.div
            key="kitchen-hint"
            className="pointer-events-none absolute bottom-6 left-1/2 z-20 max-w-[min(90vw,420px)] -translate-x-1/2 px-3 sm:bottom-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.35 } }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="rounded-full border border-[rgba(212,160,60,0.3)] bg-[rgba(20,15,10,0.85)] px-3 py-1.5 text-center text-[13px] italic leading-snug text-[#F5E6C8] backdrop-blur-md"
              style={{ fontFamily: "var(--font-crimson-pro), serif" }}
            >
              hover over items in the kitchen to explore ✨
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {cfg && Section && (
        <Modal
          open={modalOpen}
          onClose={closeModal}
          onExitComplete={handleExitComplete}
          subtitle={cfg.subtitle}
          title={cfg.title}
          theme={cfg.theme}
        >
          <Section theme={cfg.theme} />
        </Modal>
      )}
    </div>
  );
}
