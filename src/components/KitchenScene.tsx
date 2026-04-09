"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { hotspots } from "@/data/hotspots";
import type { HotspotId, ModalTheme } from "@/types";
import { transformOriginPercentFromShape } from "@/lib/hotspotGeometry";
import { KITCHEN_PAGE_ROUTES } from "@/lib/kitchenPageRoutes";
import { useKitchenPageExitZoom } from "@/hooks/useKitchenPageExitZoom";
import { KitchenExitZoomLayer } from "@/components/kitchen/KitchenExitZoomLayer";
import { KitchenHotspotOverlay } from "./KitchenHotspotOverlay";
import { Modal } from "./Modal";
import { Projects } from "./sections/Projects";
import { Cooking } from "./sections/Cooking";
import { Resume } from "./sections/Resume";
import { Interests } from "./sections/Interests";
import { EasterEgg } from "./sections/EasterEgg";
import { FridgeComingSoon } from "./sections/FridgeComingSoon";
import type { ComponentType } from "react";

type SectionComponent = ComponentType<{ theme: ModalTheme }>;

type ModalHotspotId = Exclude<HotspotId, "about" | "skills" | "contact">;

const modalRegistry: Record<
  ModalHotspotId,
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
  const {
    isExiting,
    transformOrigin,
    navigateWithZoom,
    durationMs,
  } = useKitchenPageExitZoom(600);

  const [modalOpen, setModalOpen] = useState(false);
  const [activeId, setActiveId] = useState<ModalHotspotId | null>(null);
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

  const openHotspot = useCallback(
    (id: HotspotId) => {
      const path = KITCHEN_PAGE_ROUTES[id];
      if (path) {
        const def = hotspots.find((h) => h.id === id);
        if (def) {
          const origin =
            def.transformOrigin ?? transformOriginPercentFromShape(def.shape);
          navigateWithZoom(path, origin);
        }
        setShowHint(false);
        return;
      }
      setActiveId(id as ModalHotspotId);
      setModalOpen(true);
      setShowHint(false);
    },
    [navigateWithZoom],
  );

  const closeModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  const handleExitComplete = useCallback(() => {
    setActiveId(null);
  }, []);

  const cfg = activeId ? modalRegistry[activeId] : null;
  const Section = cfg?.Section;

  const durationSec = durationMs / 1000;

  return (
    <div
      className="relative overflow-hidden"
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        margin: 0,
        padding: 0,
        pointerEvents: isExiting ? "none" : "auto",
      }}
    >
      <KitchenExitZoomLayer
        isExiting={isExiting}
        transformOrigin={transformOrigin}
        durationSec={durationSec}
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
      </KitchenExitZoomLayer>

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
