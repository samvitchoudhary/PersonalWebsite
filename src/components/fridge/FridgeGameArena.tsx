"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  BOWL_BOTTOM,
  BOWL_COLOR,
  BOWL_HEIGHT,
  BOWL_SPEED,
  BOWL_WIDTH,
  createFallingIngredient,
  getBowlRect,
  getDifficultySettings,
  getIngredientRect,
  GOOD_CATCH_POINTS,
  INITIAL_LIVES,
  pickRandomIngredientTemplate,
  rectsOverlap,
  type FallingIngredient,
} from "./ingredients";

const CREAM = "#F5E6C8";
const GOLD = "#D4A03C";

type KeyState = {
  left: boolean;
  right: boolean;
};

function isLeftKey(key: string) {
  return key === "ArrowLeft" || key === "a" || key === "A";
}

function isRightKey(key: string) {
  return key === "ArrowRight" || key === "d" || key === "D";
}

function IngredientSprite({ item }: { item: FallingIngredient }) {
  return (
    <div
      className={item.shape === "circle" ? "rounded-full" : "rounded-sm"}
      style={{
        position: "absolute",
        left: item.x,
        top: item.y,
        width: item.size,
        height: item.size,
        backgroundColor: item.color,
        boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
      }}
      aria-hidden
      title={item.label}
    />
  );
}

export function FridgeGameArena() {
  const containerRef = useRef<HTMLDivElement>(null);
  const keysRef = useRef<KeyState>({ left: false, right: false });
  const bowlXRef = useRef(0);
  const itemsRef = useRef<FallingIngredient[]>([]);
  const nextInstanceIdRef = useRef(1);
  const lastSpawnRef = useRef(0);
  const gameStartTimestampRef = useRef(0);
  const gameOverRef = useRef(false);

  const [bowlX, setBowlX] = useState(0);
  const [items, setItems] = useState<FallingIngredient[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(INITIAL_LIVES);
  const [gameOver, setGameOver] = useState(false);
  const [gameKey, setGameKey] = useState(0);

  gameOverRef.current = gameOver;

  const centerBowl = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const maxX = Math.max(0, el.clientWidth - BOWL_WIDTH);
    const centered = maxX / 2;
    bowlXRef.current = centered;
    setBowlX(centered);
  }, []);

  const resetGame = useCallback(() => {
    keysRef.current = { left: false, right: false };
    itemsRef.current = [];
    nextInstanceIdRef.current = 1;
    lastSpawnRef.current = 0;
    gameStartTimestampRef.current = 0;
    gameOverRef.current = false;
    setItems([]);
    setScore(0);
    setLives(INITIAL_LIVES);
    setGameOver(false);
    centerBowl();
    setGameKey((k) => k + 1);
  }, [centerBowl]);

  useLayoutEffect(() => {
    centerBowl();

    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver(() => {
      const maxX = Math.max(0, el.clientWidth - BOWL_WIDTH);
      bowlXRef.current = Math.min(maxX, Math.max(0, bowlXRef.current));
      setBowlX(bowlXRef.current);
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [centerBowl, gameKey]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (gameOverRef.current) return;
      if (isLeftKey(event.key)) {
        keysRef.current.left = true;
        event.preventDefault();
      }
      if (isRightKey(event.key)) {
        keysRef.current.right = true;
        event.preventDefault();
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      if (isLeftKey(event.key)) keysRef.current.left = false;
      if (isRightKey(event.key)) keysRef.current.right = false;
    };

    const onBlur = () => {
      keysRef.current = { left: false, right: false };
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
      keysRef.current = { left: false, right: false };
    };
  }, [gameKey]);

  /** Main game loop: bowl movement, spawning, falling, collisions */
  useEffect(() => {
    let frameId = 0;

    const tick = (timestamp: number) => {
      const el = containerRef.current;
      if (!el) {
        frameId = requestAnimationFrame(tick);
        return;
      }

      const containerWidth = el.clientWidth;
      const containerHeight = el.clientHeight;
      const maxBowlX = Math.max(0, containerWidth - BOWL_WIDTH);
      const isFrozen = gameOverRef.current;

      let bowlChanged = false;
      let itemsChanged = false;
      let scoreDelta = 0;
      let livesDelta = 0;

      // --- Bowl movement (skip when game over) ---
      if (!isFrozen) {
        const { left, right } = keysRef.current;
        if (left || right) {
          let next = bowlXRef.current;
          if (left) next -= BOWL_SPEED;
          if (right) next += BOWL_SPEED;
          next = Math.min(maxBowlX, Math.max(0, next));
          if (next !== bowlXRef.current) {
            bowlXRef.current = next;
            bowlChanged = true;
          }
        }
      }

      if (!isFrozen) {
        // --- Elapsed time drives difficulty (resets on Play Again) ---
        if (gameStartTimestampRef.current === 0) {
          gameStartTimestampRef.current = timestamp;
        }
        const elapsedSeconds =
          (timestamp - gameStartTimestampRef.current) / 1000;
        const difficulty = getDifficultySettings(elapsedSeconds);

        // --- Spawn new ingredients on a ramping interval ---
        if (lastSpawnRef.current === 0) {
          lastSpawnRef.current = timestamp;
        }
        if (timestamp - lastSpawnRef.current >= difficulty.spawnIntervalMs) {
          lastSpawnRef.current = timestamp;
          const template = pickRandomIngredientTemplate(
            difficulty.goodSpawnWeight,
          );
          const maxSpawnX = Math.max(0, containerWidth - template.size);
          const spawnX = Math.random() * maxSpawnX;
          const instanceId = nextInstanceIdRef.current++;
          itemsRef.current = [
            ...itemsRef.current,
            createFallingIngredient(template, instanceId, spawnX),
          ];
          itemsChanged = true;
        }

        // --- Fall + AABB collision with bowl ---
        const bowlRect = getBowlRect(bowlXRef.current, containerHeight);
        const remaining: FallingIngredient[] = [];

        for (const item of itemsRef.current) {
          const moved: FallingIngredient = {
            ...item,
            y: item.y + difficulty.fallSpeed,
          };

          // Off-screen: remove with no penalty for missed good items
          if (moved.y > containerHeight) {
            itemsChanged = true;
            continue;
          }

          if (rectsOverlap(getIngredientRect(moved), bowlRect)) {
            itemsChanged = true;
            if (moved.kind === "good") {
              scoreDelta += GOOD_CATCH_POINTS;
            } else {
              livesDelta += 1;
            }
            continue;
          }

          if (moved.y !== item.y) {
            itemsChanged = true;
          }
          remaining.push(moved);
        }

        if (itemsChanged) {
          itemsRef.current = remaining;
        }
      }

      // --- Sync React state when sim changed ---
      if (bowlChanged) {
        setBowlX(bowlXRef.current);
      }
      if (itemsChanged) {
        setItems([...itemsRef.current]);
      }
      if (scoreDelta > 0) {
        setScore((s) => s + scoreDelta);
      }
      if (livesDelta > 0) {
        setLives((l) => {
          const next = l - livesDelta;
          if (next <= 0) {
            gameOverRef.current = true;
            setGameOver(true);
            keysRef.current = { left: false, right: false };
            return 0;
          }
          return next;
        });
      }

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [gameKey]);

  return (
    <div
      ref={containerRef}
      className="fridge-game-shell relative w-full max-w-[800px] overflow-hidden"
      style={{ height: "min(600px, 72vh)" }}
    >
      {/* HUD */}
      <div
        className="pointer-events-none absolute left-4 top-4 z-20 text-sm md:text-base"
        style={{
          fontFamily: "var(--font-crimson-pro), serif",
          color: CREAM,
        }}
      >
        Lives:{" "}
        <span aria-label={`${lives} lives remaining`}>
          {"❤️".repeat(Math.max(0, lives)) || "—"}
        </span>
      </div>
      <div
        className="pointer-events-none absolute right-4 top-4 z-20 text-sm md:text-base"
        style={{
          fontFamily: "var(--font-crimson-pro), serif",
          color: CREAM,
        }}
      >
        Score: {score}
      </div>

      {/* Falling ingredients — replace IngredientSprite with <Image /> later */}
      {items.map((item) => (
        <IngredientSprite key={item.instanceId} item={item} />
      ))}

      {/* Bowl */}
      <div
        className="absolute z-10 rounded-lg"
        style={{
          left: bowlX,
          bottom: BOWL_BOTTOM,
          width: BOWL_WIDTH,
          height: BOWL_HEIGHT,
          backgroundColor: BOWL_COLOR,
          boxShadow:
            "inset 0 2px 4px rgba(255,255,255,0.15), 0 4px 10px rgba(0,0,0,0.35)",
        }}
        aria-label="Bowl"
        role="img"
      />

      {/* Game over overlay */}
      {gameOver && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#0A0806]/75 px-6 text-center">
          <h2
            className="text-3xl font-semibold md:text-4xl"
            style={{
              fontFamily: "var(--font-crimson-pro), serif",
              color: GOLD,
            }}
          >
            Game Over
          </h2>
          <p
            className="mt-3 text-lg"
            style={{
              fontFamily: "var(--font-crimson-pro), serif",
              color: CREAM,
            }}
          >
            Final Score: {score}
          </p>
          <button
            type="button"
            onClick={resetGame}
            className="mt-6 rounded-full border px-6 py-2.5 text-sm transition-opacity hover:opacity-90"
            style={{
              fontFamily: "var(--font-crimson-pro), serif",
              backgroundColor: "rgba(26, 21, 16, 0.9)",
              borderColor: "rgba(212, 160, 60, 0.35)",
              color: CREAM,
            }}
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
