"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { hotspots } from "@/data/hotspots";
import type { HotspotId, ModalTheme } from "@/types";
import { Hotspot } from "./Hotspot";
import { Modal } from "./Modal";
import { Projects } from "./sections/Projects";
import { Skills } from "./sections/Skills";
import { About } from "./sections/About";
import { Cooking } from "./sections/Cooking";
import { Resume } from "./sections/Resume";
import { Interests } from "./sections/Interests";
import { Contact } from "./sections/Contact";
import { EasterEgg } from "./sections/EasterEgg";
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
  about: {
    subtitle: "Fridge",
    title: "About Me",
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
    <div className="flex w-full flex-col items-center">
      <motion.div
        className="relative w-[95vw] max-w-[1200px] overflow-hidden rounded-2xl shadow-[0_20px_80px_rgba(0,0,0,0.6),0_0_0_1px_rgba(212,160,60,0.1)]"
        initial={{ y: 24 }}
        animate={{ y: 0 }}
        transition={{
          delay: 0.5,
          duration: 0.55,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <div
          className="relative w-full overflow-hidden"
          style={{ aspectRatio: "3 / 2" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/PersonalWebsite.png"
            alt="Kitchen"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 0,
            }}
          />
          <div className="absolute inset-0 z-10 cursor-default">
            {hotspots.map((h) => (
              <Hotspot key={h.id} {...h} onActivate={() => openHotspot(h.id)} />
            ))}
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showHint && (
          <motion.p
            key="kitchen-hint"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4, transition: { duration: 0.35 } }}
            transition={{ delay: 0.65, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 max-w-md text-center text-sm text-[#B8A888] max-[479px]:hidden"
            style={{ fontFamily: "var(--font-crimson-pro), serif" }}
          >
            <motion.span
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.05,
              }}
              className="inline-block"
            >
              hover over items in the kitchen to explore ✨
            </motion.span>
          </motion.p>
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
