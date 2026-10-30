/** Ingredient definitions — image paths map to /public/fridge/*.webp */

export type IngredientKind = "good" | "bad";

/** Physics collision shape (circle vs square); rendering uses imageSrc */
export type IngredientShape = "circle" | "square";

export type IngredientTemplate = {
  id: string;
  kind: IngredientKind;
  imageSrc: string;
  shape: IngredientShape;
  label: string;
};

export type FallingIngredient = {
  instanceId: number;
  templateId: string;
  kind: IngredientKind;
  imageSrc: string;
  size: number;
  label: string;
  /** Top-left render position (synced from Matter.js each frame) */
  x: number;
  y: number;
  /** Radians — synced from Matter.js body.angle */
  angle: number;
};

export const BOWL_IMAGE_SRC = "/fridge/11.webp";

/** Good items */
export const GOOD_INGREDIENTS: IngredientTemplate[] = [
  {
    id: "tomato",
    kind: "good",
    imageSrc: "/fridge/1.webp",
    shape: "circle",
    label: "Tomato",
  },
  {
    id: "carrot",
    kind: "good",
    imageSrc: "/fridge/2.webp",
    shape: "circle",
    label: "Carrot",
  },
  {
    id: "lettuce",
    kind: "good",
    imageSrc: "/fridge/3.webp",
    shape: "circle",
    label: "Lettuce",
  },
  {
    id: "lemon",
    kind: "good",
    imageSrc: "/fridge/4.webp",
    shape: "circle",
    label: "Lemon",
  },
  {
    id: "blueberry",
    kind: "good",
    imageSrc: "/fridge/5.webp",
    shape: "circle",
    label: "Blueberry",
  },
  {
    id: "cheese",
    kind: "good",
    imageSrc: "/fridge/6.webp",
    shape: "square",
    label: "Cheese",
  },
];

/** Bad items */
export const BAD_INGREDIENTS: IngredientTemplate[] = [
  {
    id: "moldy-bread",
    kind: "bad",
    imageSrc: "/fridge/7.webp",
    shape: "square",
    label: "Moldy bread",
  },
  {
    id: "burnt-toast",
    kind: "bad",
    imageSrc: "/fridge/8.webp",
    shape: "square",
    label: "Burnt toast",
  },
  {
    id: "spoiled-vegetable",
    kind: "bad",
    imageSrc: "/fridge/9.webp",
    shape: "square",
    label: "Spoiled vegetable",
  },
  {
    id: "rotten-apple",
    kind: "bad",
    imageSrc: "/fridge/10.webp",
    shape: "square",
    label: "Rotten apple",
  },
];

/** All ingredient image paths — useful for preloading */
export const FRIDGE_INGREDIENT_IMAGE_SRCS = [
  ...GOOD_INGREDIENTS.map((item) => item.imageSrc),
  ...BAD_INGREDIENTS.map((item) => item.imageSrc),
  BOWL_IMAGE_SRC,
];

/** Difficulty ramp — tune these without hunting through game loop logic */
export const DIFFICULTY_RAMP_INTERVAL_SEC = 5;

/** px/frame fall targets at ~60fps — converted to Matter gravity via GRAVITY_PX_FRAME_TO_SCALE */
export const FALL_SPEED_START = 1.75;
export const FALL_SPEED_INCREMENT = 0.075;
export const FALL_SPEED_MAX = 4.5;

/**
 * Converts px/frame targets to engine.gravity.y.
 * Matter uses acceleration, not constant velocity — this scale is tuned to feel similar.
 */
export const GRAVITY_PX_FRAME_TO_SCALE = 0.18;

export const SPAWN_INTERVAL_MS_START = 1200;
export const SPAWN_INTERVAL_DECREMENT_MS = 50;
export const SPAWN_INTERVAL_MS_MIN = 550;

export const GOOD_SPAWN_WEIGHT_START = 0.7;
export const GOOD_SPAWN_WEIGHT_MIN = 0.6;

/** Elapsed seconds at which fall speed hits max; bad-item weight follows the same curve */
export const DIFFICULTY_FULL_RAMP_SECONDS =
  ((FALL_SPEED_MAX - FALL_SPEED_START) / FALL_SPEED_INCREMENT) *
  DIFFICULTY_RAMP_INTERVAL_SEC;

export type DifficultySettings = {
  elapsedSeconds: number;
  /** Original px/frame tuning baseline (reference only) */
  fallSpeedTarget: number;
  /** Applied to Matter.Engine.gravity.y */
  gravityScale: number;
  spawnIntervalMs: number;
  goodSpawnWeight: number;
};

function fallSpeedTargetForElapsed(elapsedSeconds: number): number {
  const rampSteps = elapsedSeconds / DIFFICULTY_RAMP_INTERVAL_SEC;
  return Math.min(
    FALL_SPEED_MAX,
    FALL_SPEED_START + rampSteps * FALL_SPEED_INCREMENT,
  );
}

/** Map elapsed game time (seconds) to current difficulty parameters */
export function getDifficultySettings(elapsedSeconds: number): DifficultySettings {
  const fallSpeedTarget = fallSpeedTargetForElapsed(elapsedSeconds);

  const spawnIntervalMs = Math.max(
    SPAWN_INTERVAL_MS_MIN,
    SPAWN_INTERVAL_MS_START -
      (elapsedSeconds / DIFFICULTY_RAMP_INTERVAL_SEC) *
        SPAWN_INTERVAL_DECREMENT_MS,
  );

  const difficultyProgress = Math.min(1, elapsedSeconds / DIFFICULTY_FULL_RAMP_SECONDS);
  const goodSpawnWeight =
    GOOD_SPAWN_WEIGHT_START -
    difficultyProgress * (GOOD_SPAWN_WEIGHT_START - GOOD_SPAWN_WEIGHT_MIN);

  return {
    elapsedSeconds,
    fallSpeedTarget,
    gravityScale: fallSpeedTarget * GRAVITY_PX_FRAME_TO_SCALE,
    spawnIntervalMs,
    goodSpawnWeight,
  };
}

export function pickRandomIngredientTemplate(
  goodWeight: number = GOOD_SPAWN_WEIGHT_START,
): IngredientTemplate {
  const pool = Math.random() < goodWeight ? GOOD_INGREDIENTS : BAD_INGREDIENTS;
  return pool[Math.floor(Math.random() * pool.length)]!;
}

/** Proportional sprite/layout sizing — tuned for ~800px-wide arena (40px items, 80×40 bowl) */
export const INGREDIENT_SIZE_PCT = 0.05;
export const BOWL_WIDTH_PCT = 0.1;
/** Bowl height = bowlWidth × this ratio (preserves prior 80×40 aspect) */
export const BOWL_HEIGHT_TO_WIDTH = 0.5;
/** Distance from container bottom edge to bowl bottom edge */
export const BOWL_BOTTOM_HEIGHT_PCT = 0.033;
/** Horizontal bowl speed as fraction of container width per frame */
export const BOWL_SPEED_WIDTH_PCT = 0.00875;

export type ArenaLayout = {
  containerWidth: number;
  containerHeight: number;
  ingredientSize: number;
  bowlWidth: number;
  bowlHeight: number;
  bowlBottom: number;
  bowlSpeed: number;
};

export function getArenaLayout(
  containerWidth: number,
  containerHeight: number,
): ArenaLayout {
  const bowlWidth = containerWidth * BOWL_WIDTH_PCT;
  return {
    containerWidth,
    containerHeight,
    ingredientSize: containerWidth * INGREDIENT_SIZE_PCT,
    bowlWidth,
    bowlHeight: bowlWidth * BOWL_HEIGHT_TO_WIDTH,
    bowlBottom: containerHeight * BOWL_BOTTOM_HEIGHT_PCT,
    bowlSpeed: containerWidth * BOWL_SPEED_WIDTH_PCT,
  };
}

export const GOOD_CATCH_POINTS = 10;
export const INITIAL_LIVES = 3;
