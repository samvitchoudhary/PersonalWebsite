const KEY = "kitchenBridgeReveal";

/** Call right before navigating away from the kitchen so the destination can match the cream end state. */
export function setKitchenBridgeRevealFlag(): void {
  try {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(KEY, "1");
    }
  } catch {
    /* ignore quota / private mode */
  }
}

/**
 * One-shot read for the destination page. Returns true if we should show the cream overlay and fade it out.
 */
export function consumeKitchenBridgeReveal(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const v = sessionStorage.getItem(KEY) === "1";
    if (v) sessionStorage.removeItem(KEY);
    return v;
  } catch {
    return false;
  }
}
