"use client";

import Matter, { type Engine, type IEventCollision } from "matter-js";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  applyArenaLayoutToBodies,
  bodyToRenderState,
  createFridgePhysics,
  createIngredientBody,
  destroyFridgePhysics,
  getIngredientGameData,
  isBodyPastBottom,
  isIngredientBody,
  removeBodyFromWorld,
  setEngineGravity,
  stepPhysics,
  updateBowlBodyPosition,
} from "./fridgePhysics";
import {
  BOWL_IMAGE_SRC,
  FRIDGE_INGREDIENT_IMAGE_SRCS,
  getArenaLayout,
  getDifficultySettings,
  GOOD_CATCH_POINTS,
  INITIAL_LIVES,
  pickRandomIngredientTemplate,
  type ArenaLayout,
  type FallingIngredient,
} from "./ingredients";

const CREAM = "#F5E6C8";
const GOLD = "#D4A03C";

const DEFAULT_LAYOUT = getArenaLayout(800, 600);

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
    <img
      src={item.imageSrc}
      alt=""
      aria-hidden
      draggable={false}
      decoding="async"
      width={item.size}
      height={item.size}
      className="pointer-events-none absolute select-none"
      style={{
        left: item.x,
        top: item.y,
        transform: `rotate(${item.angle}rad)`,
        transformOrigin: "center center",
      }}
    />
  );
}

export function FridgeGameArena() {
  const containerRef = useRef<HTMLDivElement>(null);
  const keysRef = useRef<KeyState>({ left: false, right: false });
  const bowlXRef = useRef(0);
  const nextInstanceIdRef = useRef(1);
  const lastSpawnRef = useRef(0);
  const gameStartTimestampRef = useRef(0);
  const gameOverRef = useRef(false);
  const scoreDeltaRef = useRef(0);
  const livesDeltaRef = useRef(0);
  const layoutRef = useRef<ArenaLayout>(DEFAULT_LAYOUT);

  const [bowlX, setBowlX] = useState(0);
  const [arenaLayout, setArenaLayout] = useState<ArenaLayout>(DEFAULT_LAYOUT);
  const [items, setItems] = useState<FallingIngredient[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(INITIAL_LIVES);
  const [gameOver, setGameOver] = useState(false);
  const [gameKey, setGameKey] = useState(0);

  gameOverRef.current = gameOver;

  const syncLayoutFromContainer = useCallback(() => {
    const el = containerRef.current;
    if (!el) return DEFAULT_LAYOUT;
    const layout = getArenaLayout(el.clientWidth, el.clientHeight);
    layoutRef.current = layout;
    setArenaLayout(layout);
    return layout;
  }, []);

  const centerBowl = useCallback(() => {
    const layout = syncLayoutFromContainer();
    const maxX = Math.max(0, layout.containerWidth - layout.bowlWidth);
    const centered = maxX / 2;
    bowlXRef.current = centered;
    setBowlX(centered);
  }, [syncLayoutFromContainer]);

  const resetGame = useCallback(() => {
    keysRef.current = { left: false, right: false };
    nextInstanceIdRef.current = 1;
    lastSpawnRef.current = 0;
    gameStartTimestampRef.current = 0;
    gameOverRef.current = false;
    scoreDeltaRef.current = 0;
    livesDeltaRef.current = 0;
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
      const layout = getArenaLayout(el.clientWidth, el.clientHeight);
      layoutRef.current = layout;
      setArenaLayout(layout);
      const maxX = Math.max(0, layout.containerWidth - layout.bowlWidth);
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

  useEffect(() => {
    for (const src of FRIDGE_INGREDIENT_IMAGE_SRCS) {
      const img = new window.Image();
      img.src = src;
    }
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const initialLayout = getArenaLayout(el.clientWidth, el.clientHeight);
    layoutRef.current = initialLayout;
    setArenaLayout(initialLayout);

    const { engine, bowlBody } = createFridgePhysics(
      initialLayout,
      bowlXRef.current,
    );

    let previousLayout: ArenaLayout | null = null;
    const handledCollisions = new Set<number>();

    const onCollisionStart = (event: IEventCollision<Engine>) => {
      if (gameOverRef.current) return;

      for (const pair of event.pairs) {
        const ingredientBody = isIngredientBody(pair.bodyA)
          ? pair.bodyA
          : isIngredientBody(pair.bodyB)
            ? pair.bodyB
            : null;
        const bowlBodyHit =
          pair.bodyA === bowlBody || pair.bodyB === bowlBody;

        if (!ingredientBody || !bowlBodyHit) continue;

        const game = getIngredientGameData(ingredientBody);
        if (!game || handledCollisions.has(game.instanceId)) continue;

        handledCollisions.add(game.instanceId);

        if (game.kind === "good") {
          scoreDeltaRef.current += GOOD_CATCH_POINTS;
        } else {
          livesDeltaRef.current += 1;
        }

        removeBodyFromWorld(engine, ingredientBody);
      }
    };

    Matter.Events.on(engine, "collisionStart", onCollisionStart);

    let frameId = 0;

    const tick = (timestamp: number) => {
      const container = containerRef.current;
      if (!container) {
        frameId = requestAnimationFrame(tick);
        return;
      }

      const layout = getArenaLayout(
        container.clientWidth,
        container.clientHeight,
      );
      layoutRef.current = layout;

      const maxBowlX = Math.max(0, layout.containerWidth - layout.bowlWidth);
      const isFrozen = gameOverRef.current;

      let bowlChanged = false;

      if (!isFrozen) {
        const { left, right } = keysRef.current;
        if (left || right) {
          let next = bowlXRef.current;
          if (left) next -= layout.bowlSpeed;
          if (right) next += layout.bowlSpeed;
          next = Math.min(maxBowlX, Math.max(0, next));
          if (next !== bowlXRef.current) {
            bowlXRef.current = next;
            bowlChanged = true;
          }
        }
      }

      applyArenaLayoutToBodies(engine, bowlBody, layout, previousLayout);
      previousLayout = layout;
      updateBowlBodyPosition(bowlBody, bowlXRef.current, layout);

      if (!isFrozen) {
        if (gameStartTimestampRef.current === 0) {
          gameStartTimestampRef.current = timestamp;
        }
        const elapsedSeconds =
          (timestamp - gameStartTimestampRef.current) / 1000;
        const difficulty = getDifficultySettings(elapsedSeconds);

        setEngineGravity(engine, difficulty.gravityScale);

        if (lastSpawnRef.current === 0) {
          lastSpawnRef.current = timestamp;
        }
        if (timestamp - lastSpawnRef.current >= difficulty.spawnIntervalMs) {
          lastSpawnRef.current = timestamp;
          const template = pickRandomIngredientTemplate(
            difficulty.goodSpawnWeight,
          );
          const maxSpawnX = Math.max(0, layout.containerWidth - layout.ingredientSize);
          const spawnX = Math.random() * maxSpawnX;
          const instanceId = nextInstanceIdRef.current++;
          const body = createIngredientBody(
            template,
            instanceId,
            spawnX,
            layout.ingredientSize,
          );
          Matter.Composite.add(engine.world, body);
        }

        stepPhysics(engine);

        for (const body of Matter.Composite.allBodies(engine.world)) {
          if (!isIngredientBody(body)) continue;
          if (isBodyPastBottom(body, layout.containerHeight)) {
            removeBodyFromWorld(engine, body);
          }
        }
      }

      const renderItems = Matter.Composite.allBodies(engine.world)
        .filter(isIngredientBody)
        .map(bodyToRenderState)
        .filter((item): item is FallingIngredient => item != null);

      setArenaLayout(layout);
      setItems(renderItems);

      if (bowlChanged) {
        setBowlX(bowlXRef.current);
      }

      if (scoreDeltaRef.current > 0) {
        const delta = scoreDeltaRef.current;
        scoreDeltaRef.current = 0;
        setScore((s) => s + delta);
      }

      if (livesDeltaRef.current > 0) {
        const delta = livesDeltaRef.current;
        livesDeltaRef.current = 0;
        setLives((l) => {
          const next = l - delta;
          if (next <= 0) {
            gameOverRef.current = true;
            setGameOver(true);
            keysRef.current = { left: false, right: false };
            return 0;
          }
          return next;
        });
      }

      handledCollisions.clear();
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frameId);
      destroyFridgePhysics(engine, onCollisionStart);
    };
  }, [gameKey]);

  return (
    <div
      ref={containerRef}
      className="fridge-game-shell relative overflow-hidden"
    >
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

      {items.map((item) => (
        <IngredientSprite key={item.instanceId} item={item} />
      ))}

      <img
        src={BOWL_IMAGE_SRC}
        alt="Bowl"
        width={arenaLayout.bowlWidth}
        height={arenaLayout.bowlHeight}
        draggable={false}
        decoding="async"
        className="pointer-events-none absolute z-10 select-none object-contain"
        style={{
          left: bowlX,
          bottom: arenaLayout.bowlBottom,
        }}
      />

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
