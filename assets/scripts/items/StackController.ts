import { _decorator, Component, Vec3 } from 'cc';
import { ItemRegistry } from './ItemRegistry';
import { ItemRuntime } from './ItemRuntime';

const { ccclass, property } = _decorator;

interface StackEntry {
    item: ItemRuntime;
    x: number;
    y: number;
    z: number;
}

/**
 * Builds cheap vertical-stack links after level spawning. Only the lowest
 * remaining item in a column may enter dynamic simulation. When it reaches the
 * inner swallow zone, the next item is released domino-style.
 */
@ccclass('StackController')
export class StackController extends Component {
    @property({ tooltip: 'World-space X/Z tolerance used to identify one vertical column.' })
    public columnTolerance = 0.035;

    private _registry: ItemRegistry | null = null;
    private readonly _entries: StackEntry[] = [];
    private readonly _below = new Map<ItemRuntime, ItemRuntime>();
    private readonly _above = new Map<ItemRuntime, ItemRuntime>();
    private readonly _worldPos = new Vec3();
    private _ready = false;

    public get isReady(): boolean {
        return this._ready;
    }

    public configure(registry: ItemRegistry): void {
        this._registry = registry;
    }

    public resetStacks(): void {
        this._entries.length = 0;
        this._below.clear();
        this._above.clear();
        this._ready = false;
    }

    public register(item: ItemRuntime): void {
        item.node.getWorldPosition(this._worldPos);
        this._entries.push({
            item,
            x: this._worldPos.x,
            y: this._worldPos.y,
            z: this._worldPos.z,
        });
    }

    public finalizeStacks(): void {
        const columns = new Map<string, StackEntry[]>();
        const tolerance = Math.max(0.005, this.columnTolerance);

        for (let i = 0; i < this._entries.length; i++) {
            const entry = this._entries[i];
            const key = `${Math.round(entry.x / tolerance)}|${Math.round(entry.z / tolerance)}`;
            let column = columns.get(key);
            if (!column) {
                column = [];
                columns.set(key, column);
            }
            column.push(entry);
        }

        columns.forEach((column) => {
            if (column.length < 2) {
                return;
            }

            column.sort((a, b) => a.y - b.y);
            for (let i = 1; i < column.length; i++) {
                const lower = column[i - 1].item;
                const upper = column[i].item;
                this._below.set(upper, lower);
                this._above.set(lower, upper);
            }
        });

        this._ready = true;
        this._entries.length = 0;
    }

    /**
     * Reject upper tower pieces while their support still exists. A very low
     * piece directly over the opening may also activate, which handles short,
     * irregular piles without waking the whole column.
     */
    public canActivate(
        item: ItemRuntime,
        holePosition: Vec3,
        holeRadius: number,
        holePlaneY: number,
        directActivationHeight: number,
    ): boolean {
        if (!this._ready) {
            return false;
        }

        const lower = this._below.get(item);
        if (!lower || lower.isSwallowing || lower.isConsumed) {
            return true;
        }

        item.node.getWorldPosition(this._worldPos);
        if (this._worldPos.y > holePlaneY + directActivationHeight) {
            return false;
        }

        const dx = this._worldPos.x - holePosition.x;
        const dz = this._worldPos.z - holePosition.z;
        const proximity = Math.max(0.05, holeRadius - item.consumeRadius);
        return (dx * dx + dz * dz) <= proximity * proximity;
    }

    /** Release exactly one piece above the swallowed base. */
    public onItemEnteredSwallow(item: ItemRuntime): void {
        if (!this._registry) {
            return;
        }

        const upper = this._above.get(item);
        if (!upper || !upper.isDormant) {
            return;
        }

        if (upper.activateDynamic()) {
            this._registry.markDynamic(upper);
        }
    }
}
