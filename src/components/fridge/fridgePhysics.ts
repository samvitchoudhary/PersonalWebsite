import Matter, { type Body, type Engine, type IEventCollision } from "matter-js";
import {
  FALL_SPEED_START,
  GRAVITY_PX_FRAME_TO_SCALE,
  type ArenaLayout,
  type IngredientKind,
  type IngredientShape,
  type IngredientTemplate,
} from "./ingredients";

/** Metadata attached to each ingredient physics body */
export type IngredientBodyGameData = {
  instanceId: number;
  templateId: string;
  kind: IngredientKind;
  imageSrc: string;
  size: number;
  shape: IngredientShape;
  label: string;
};

type BodySizeSnapshot = { w: number; h: number };

export type FridgePhysicsHandles = {
  engine: Engine;
  bowlBody: Body;
};

export const BOWL_BODY_LABEL = "fridge-bowl";
export const INGREDIENT_BODY_LABEL = "fridge-ingredient";

/** Subtle tumble/drift on spawn — scaled per ingredient size in createIngredientBody */
export const INGREDIENT_DRIFT_X_PCT = 0.03;
export const INGREDIENT_SPIN = 0.14;

const PHYSICS_DELTA_MS = 1000 / 60;
const SIZE_EPSILON = 0.5;

export function getBowlCenterY(layout: ArenaLayout): number {
  return layout.containerHeight - layout.bowlBottom - layout.bowlHeight / 2;
}

export function getBowlCenterX(bowlLeft: number, layout: ArenaLayout): number {
  return bowlLeft + layout.bowlWidth / 2;
}

export function createFridgePhysics(
  layout: ArenaLayout,
  bowlLeft: number,
): FridgePhysicsHandles {
  const engine = Matter.Engine.create({
    gravity: {
      x: 0,
      y: FALL_SPEED_START * GRAVITY_PX_FRAME_TO_SCALE,
      scale: 0.001,
    },
  });

  const bowlBody = Matter.Bodies.rectangle(
    getBowlCenterX(bowlLeft, layout),
    getBowlCenterY(layout),
    layout.bowlWidth,
    layout.bowlHeight,
    {
      isStatic: true,
      label: BOWL_BODY_LABEL,
      friction: 0.8,
      restitution: 0.05,
    },
  );

  bowlBody.plugin.lastSize = {
    w: layout.bowlWidth,
    h: layout.bowlHeight,
  } satisfies BodySizeSnapshot;

  Matter.Composite.add(engine.world, bowlBody);

  return { engine, bowlBody };
}

export function destroyFridgePhysics(
  engine: Engine | null,
  onCollision?: (event: IEventCollision<Engine>) => void,
) {
  if (!engine) return;

  if (onCollision) {
    Matter.Events.off(engine, "collisionStart", onCollision);
  }

  Matter.Composite.clear(engine.world, false, true);
  Matter.Engine.clear(engine);
}

export function setEngineGravity(engine: Engine, gravityScale: number) {
  engine.gravity.y = gravityScale;
  engine.gravity.x = 0;
}

export function updateBowlBodyPosition(
  bowlBody: Body,
  bowlLeft: number,
  layout: ArenaLayout,
) {
  Matter.Body.setPosition(bowlBody, {
    x: getBowlCenterX(bowlLeft, layout),
    y: getBowlCenterY(layout),
  });
}

/** Scale bowl + ingredient collision bodies when arena layout size changes */
export function applyArenaLayoutToBodies(
  engine: Engine,
  bowlBody: Body,
  layout: ArenaLayout,
  previousLayout: ArenaLayout | null,
) {
  const sizeChanged =
    !previousLayout ||
    Math.abs(previousLayout.ingredientSize - layout.ingredientSize) >
      SIZE_EPSILON ||
    Math.abs(previousLayout.bowlWidth - layout.bowlWidth) > SIZE_EPSILON ||
    Math.abs(previousLayout.bowlHeight - layout.bowlHeight) > SIZE_EPSILON;

  if (!sizeChanged) return;

  const prevBowl = bowlBody.plugin.lastSize as BodySizeSnapshot | undefined;
  if (prevBowl && prevBowl.w > 0 && prevBowl.h > 0) {
    Matter.Body.scale(
      bowlBody,
      layout.bowlWidth / prevBowl.w,
      layout.bowlHeight / prevBowl.h,
    );
  }
  bowlBody.plugin.lastSize = { w: layout.bowlWidth, h: layout.bowlHeight };

  for (const body of Matter.Composite.allBodies(engine.world)) {
    if (!isIngredientBody(body)) continue;

    const game = getIngredientGameData(body);
    if (!game || game.size <= 0) continue;

    const scale = layout.ingredientSize / game.size;
    if (Math.abs(scale - 1) <= 0.01) continue;

    Matter.Body.scale(body, scale, scale);
    game.size = layout.ingredientSize;
    body.plugin.game = game;
  }
}

export function createIngredientBody(
  template: IngredientTemplate,
  instanceId: number,
  spawnLeft: number,
  ingredientSize: number,
): Body {
  const radius = ingredientSize / 2;
  const centerX = spawnLeft + radius;
  const centerY = radius;
  const driftX = ingredientSize * INGREDIENT_DRIFT_X_PCT;

  const body =
    template.shape === "circle"
      ? Matter.Bodies.circle(centerX, centerY, radius, {
          restitution: 0.25,
          friction: 0.4,
          frictionAir: 0.012,
          label: INGREDIENT_BODY_LABEL,
        })
      : Matter.Bodies.rectangle(
          centerX,
          centerY,
          ingredientSize,
          ingredientSize,
          {
            chamfer: { radius: Math.max(2, ingredientSize * 0.1) },
            restitution: 0.25,
            friction: 0.4,
            frictionAir: 0.012,
            label: INGREDIENT_BODY_LABEL,
          },
        );

  body.plugin.game = {
    instanceId,
    templateId: template.id,
    kind: template.kind,
    imageSrc: template.imageSrc,
    size: ingredientSize,
    shape: template.shape,
    label: template.label,
  } satisfies IngredientBodyGameData;

  Matter.Body.setVelocity(body, {
    x: (Math.random() - 0.5) * driftX,
    y: 0.4,
  });
  Matter.Body.setAngularVelocity(
    body,
    (Math.random() - 0.5) * INGREDIENT_SPIN,
  );

  return body;
}

export function getIngredientGameData(body: Body): IngredientBodyGameData | null {
  const data = body.plugin?.game as IngredientBodyGameData | undefined;
  return data?.instanceId != null ? data : null;
}

export function isBowlBody(body: Body): boolean {
  return body.label === BOWL_BODY_LABEL;
}

export function isIngredientBody(body: Body): boolean {
  return body.label === INGREDIENT_BODY_LABEL;
}

export function stepPhysics(engine: Engine, deltaMs = PHYSICS_DELTA_MS) {
  Matter.Engine.update(engine, deltaMs);
}

export function removeBodyFromWorld(engine: Engine, body: Body) {
  Matter.Composite.remove(engine.world, body);
}

/** Read physics state for React rendering (top-left x/y + rotation) */
export function bodyToRenderState(body: Body): {
  instanceId: number;
  templateId: string;
  kind: IngredientKind;
  imageSrc: string;
  size: number;
  label: string;
  x: number;
  y: number;
  angle: number;
} | null {
  const game = getIngredientGameData(body);
  if (!game) return null;

  return {
    instanceId: game.instanceId,
    templateId: game.templateId,
    kind: game.kind,
    imageSrc: game.imageSrc,
    size: game.size,
    label: game.label,
    x: body.position.x - game.size / 2,
    y: body.position.y - game.size / 2,
    angle: body.angle,
  };
}

/** True when the body's bottom edge is below the arena */
export function isBodyPastBottom(body: Body, containerHeight: number): boolean {
  return body.bounds.max.y > containerHeight;
}
