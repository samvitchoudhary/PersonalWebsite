/** Placeholder ingredient definitions — swap colors/shapes for images later. */

export type IngredientKind = "good" | "bad";

export type IngredientShape = "circle" | "square";

export type IngredientTemplate = {
  id: string;
  kind: IngredientKind;
  color: string;
  size: number;
  shape: IngredientShape;
  label: string;
};

export type FallingIngredient = {
  instanceId: number;
  templateId: string;
  kind: IngredientKind;
  color: string;
  size: number;
  shape: IngredientShape;
  label: string;
  x: number;
  y: number;
};

/** Good items — colorful produce placeholders */
export const GOOD_INGREDIENTS: IngredientTemplate[] = [
  { id: "tomato", kind: "good", color: "#C0392B", size: 40, shape: "circle", label: "Tomato" },
  { id: "carrot", kind: "good", color: "#E67E22", size: 40, shape: "circle", label: "Carrot" },
  { id: "lettuce", kind: "good", color: "#58A55C", size: 40, shape: "circle", label: "Lettuce" },
  { id: "lemon", kind: "good", color: "#F1C40F", size: 40, shape: "circle", label: "Lemon" },
  { id: "blueberry", kind: "good", color: "#5B6BBF", size: 40, shape: "circle", label: "Blueberry" },
  { id: "cheese", kind: "good", color: "#F4D03F", size: 40, shape: "square", label: "Cheese" },
];

/** Bad items — moldy/burnt placeholders */
export const BAD_INGREDIENTS: IngredientTemplate[] = [
  { id: "moldy", kind: "bad", color: "#5D4E37", size: 40, shape: "square", label: "Moldy item" },
  { id: "burnt", kind: "bad", color: "#3D3226", size: 40, shape: "square", label: "Burnt item" },
  { id: "spoiled", kind: "bad", color: "#6B5344", size: 40, shape: "square", label: "Spoiled item" },
  { id: "rot", kind: "bad", color: "#4A3728", size: 40, shape: "square", label: "Rotten item" },
];

/** Difficulty ramp — tune these without hunting through game loop logic */
export const DIFFICULTY_RAMP_INTERVAL_SEC = 5;

export const FALL_SPEED_START = 3.5;
export const FALL_SPEED_INCREMENT = 0.15;
export const FALL_SPEED_MAX = 8.5;

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
  fallSpeed: number;
  spawnIntervalMs: number;
  goodSpawnWeight: number;
};

/** Map elapsed game time (seconds) to current difficulty parameters */
export function getDifficultySettings(elapsedSeconds: number): DifficultySettings {
  const rampSteps = elapsedSeconds / DIFFICULTY_RAMP_INTERVAL_SEC;

  const fallSpeed = Math.min(
    FALL_SPEED_MAX,
    FALL_SPEED_START + rampSteps * FALL_SPEED_INCREMENT,
  );

  const spawnIntervalMs = Math.max(
    SPAWN_INTERVAL_MS_MIN,
    SPAWN_INTERVAL_MS_START - rampSteps * SPAWN_INTERVAL_DECREMENT_MS,
  );

  const difficultyProgress = Math.min(1, elapsedSeconds / DIFFICULTY_FULL_RAMP_SECONDS);
  const goodSpawnWeight =
    GOOD_SPAWN_WEIGHT_START -
    difficultyProgress * (GOOD_SPAWN_WEIGHT_START - GOOD_SPAWN_WEIGHT_MIN);

  return {
    elapsedSeconds,
    fallSpeed,
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

export function createFallingIngredient(
  template: IngredientTemplate,
  instanceId: number,
  x: number,
): FallingIngredient {
  return {
    instanceId,
    templateId: template.id,
    kind: template.kind,
    color: template.color,
    size: template.size,
    shape: template.shape,
    label: template.label,
    x,
    y: 0,
  };
}

type Rect = { left: number; top: number; right: number; bottom: number };

export function rectsOverlap(a: Rect, b: Rect): boolean {
  return (
    a.left < b.right &&
    a.right > b.left &&
    a.top < b.bottom &&
    a.bottom > b.top
  );
}

export function getBowlRect(
  bowlX: number,
  containerHeight: number,
): Rect {
  return {
    left: bowlX,
    top: containerHeight - BOWL_BOTTOM - BOWL_HEIGHT,
    right: bowlX + BOWL_WIDTH,
    bottom: containerHeight - BOWL_BOTTOM,
  };
}

export function getIngredientRect(item: FallingIngredient): Rect {
  return {
    left: item.x,
    top: item.y,
    right: item.x + item.size,
    bottom: item.y + item.size,
  };
}

/** Shared layout constants for bowl + collision math */
export const BOWL_WIDTH = 80;
export const BOWL_HEIGHT = 40;
export const BOWL_BOTTOM = 20;
export const BOWL_SPEED = 7;
export const BOWL_COLOR = "#8B5A2B";

export const GOOD_CATCH_POINTS = 10;
export const INITIAL_LIVES = 3;
