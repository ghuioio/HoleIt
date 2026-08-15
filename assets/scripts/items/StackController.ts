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

interface TowerStack {
    /** Always ordered bottom-to-top; index 0 is the current base piece. */
    pieces: ItemRuntime[];
    collapsed: boolean;
}

/**
 * Builds ordered vertical towers after level spawning. Towers stay dormant
 * until their base enters the Hole, then every remaining piece is released at
 * once with Y-only constrained physics.
 */
@ccclass('StackController')
export class StackController extends Component {
    @property({ tooltip: 'World-space X/Z tolerance used to identify one vertical column.' })
    public columnTolerance = 0.035;

    private _registry: ItemRegistry | null = null;
    private readonly _entries: StackEntry[] = [];
    private readonly _towerByItem = new Map<ItemRuntime, TowerStack>();
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
        this._towerByItem.clear();
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
            const tower: TowerStack = {
                pieces: [],
                collapsed: false,
            };
            for (let i = 0; i < column.length; i++) {
                const piece = column[i].item;
                tower.pieces.push(piece);
                this._towerByItem.set(piece, tower);
            }
        });

        this._ready = true;
        this._entries.length = 0;
    }

    /**
     * Before collapse, only index 0 (the bottom piece) can activate. Once the
     * base enters the Hole, onItemEnteredSwallow activates the whole remainder.
     */
    public canActivate(item: ItemRuntime): boolean {
        if (!this._ready) {
            return false;
        }

        const tower = this._towerByItem.get(item);
        if (!tower) {
            return true;
        }
        return tower.collapsed || tower.pieces[0] === item;
    }

    /**
     * Remove the current base, then release every piece above it. Released
     * bodies stay in ITEM so they collide with the ground if the Hole leaves.
     */
    public onItemEnteredSwallow(item: ItemRuntime): void {
        if (!this._registry) {
            return;
        }

        const tower = this._towerByItem.get(item);
        if (!tower) {
            return;
        }

        const index = tower.pieces.indexOf(item);
        if (index < 0) {
            return;
        }

        tower.pieces.splice(index, 1);
        this._towerByItem.delete(item);
        if (index !== 0 || tower.collapsed) {
            return;
        }

        tower.collapsed = true;
        for (let i = 0; i < tower.pieces.length; i++) {
            const piece = tower.pieces[i];
            if (piece.isDormant && piece.activateStackFall()) {
                this._registry.markDynamic(piece);
            }
        }
    }
}
