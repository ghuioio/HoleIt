/**
 * These bit values must match Project Settings -> Physics -> Collision Matrix.
 * Group index 0 is DEFAULT. Create the following custom groups in this order:
 * 1 GROUND, 2 ITEM, 3 FALLING_ITEM, 4 HOLE.
 */
export const PhysicsGroup = {
    DEFAULT: 1 << 0,
    GROUND: 1 << 1,
    ITEM: 1 << 2,
    FALLING_ITEM: 1 << 3,
    HOLE: 1 << 4,
} as const;
