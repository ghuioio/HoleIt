import { EventTarget } from 'cc';

/**
 * Lightweight project-wide event bus.
 * Keep payload ownership in the system that emits the event; this file only
 * contains event names so gameplay systems stay decoupled.
 */
export const gameEvents = new EventTarget();

export const GameEvent = {
    LEVEL_DATA_READY: 'hm-level-data-ready',
    LEVEL_SPAWN_PROGRESS: 'hm-level-spawn-progress',
    LEVEL_SPAWN_COMPLETE: 'hm-level-spawn-complete',

    FIRST_PLAYER_INPUT: 'hm-first-player-input',
    GAME_STARTED: 'hm-game-started',
    GAME_WON: 'hm-game-won',
    GAME_LOST: 'hm-game-lost',

    ITEM_CONSUME_STARTED: 'hm-item-consume-started',
    ITEM_SWALLOW_ENTERED: 'hm-item-swallow-entered',
    ITEM_CONSUMED: 'hm-item-consumed',
    ITEM_COUNTS_CHANGED: 'hm-item-counts-changed',

    HOLE_PROGRESS_CHANGED: 'hm-hole-progress-changed',
    HOLE_LEVEL_UP: 'hm-hole-level-up',

    OBJECTIVE_CHANGED: 'hm-objective-changed',
    OBJECTIVE_COMPLETED: 'hm-objective-completed',
    ALL_OBJECTIVES_COMPLETED: 'hm-all-objectives-completed',

    TIMER_CHANGED: 'hm-timer-changed',
    TIMER_EXPIRED: 'hm-timer-expired',
} as const;
