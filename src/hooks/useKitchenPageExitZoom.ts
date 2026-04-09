"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { setKitchenBridgeRevealFlag } from "@/lib/kitchenBridgeReveal";

const DEFAULT_DURATION_MS = 600;

/**
 * Runs a zoom + cream overlay on the kitchen layer, then navigates with the router.
 * Reuse for any page-linked hotspot — pass transform-origin from {@link transformOriginPercentFromShape}.
 */
export function useKitchenPageExitZoom(durationMs = DEFAULT_DURATION_MS) {
  const router = useRouter();
  const [exit, setExit] = useState<{
    href: string;
    transformOrigin: string;
  } | null>(null);
  const pendingRef = useRef(false);

  const navigateWithZoom = useCallback(
    (href: string, transformOrigin: string) => {
      if (pendingRef.current) return;
      pendingRef.current = true;
      setExit({ href, transformOrigin });
    },
    [],
  );

  useEffect(() => {
    if (!exit) return;
    const t = window.setTimeout(() => {
      setKitchenBridgeRevealFlag();
      router.push(exit.href);
    }, durationMs);
    return () => window.clearTimeout(t);
  }, [exit, router, durationMs]);

  const isExiting = exit !== null;
  const transformOrigin = exit?.transformOrigin ?? "50% 50%";

  return {
    isExiting,
    transformOrigin,
    navigateWithZoom,
    durationMs,
  };
}
