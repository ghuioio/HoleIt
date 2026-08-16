import { _decorator, Component, Node, Vec3 } from 'cc';
import { HoleSizeController } from '../player/HoleSizeController';
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
    /** Always sorted bottom-to-top. */
    pieces: ItemRuntime[];
    collapsed: boolean;
}

/**
 * Builds vertical columns and starts a Pez-dispenser-style cascade when a
 * column's bottom item is swallowed. Ground fallback is owned by ItemRuntime,
 * so this class only manages ordering and activation.
 */
@ccclass('StackController')
export class StackController extends Component {
    @property({ tooltip: 'World-space X/Z tolerance used to identify one vertical column.' })
    public columnTolerance = 0.035;

    private _registry: ItemRegistry | null = null;
    private _hole: Node | null = null;
    private _holeSize: HoleSizeController | null = null;
    private _groundY = 0.075;
    private _groundSafetyOffset = 0.01;
    private readonly _entries: StackEntry[] = [];
    private readonly _allItems: ItemRuntime[] = [];
    private readonly _towerByItem = new Map<ItemRuntime, TowerStack>();
    private readonly _worldPos = new Vec3();
    private _ready = false;

    public get isReady(): boolean {
        return this._ready;
    }

    public configure(registry: ItemRegistry): void {
        this._registry = registry;
    }

    /** Supplies the scene references used by every activated ItemRuntime. */
    public configureGroundFallback(
        hole: Node,
        holeSize: HoleSizeController,
        groundY: number,
        groundSafetyOffset: number,
    ): void {
        this._hole = hole;
        this._holeSize = holeSize;
        this._groundY = groundY;
        this._groundSafetyOffset = groundSafetyOffset;

        for (let i = 0; i < this._allItems.length; i++) {
            this.configureItem(this._allItems[i]);
        }
    }

    public resetStacks(): void {
        this._entries.length = 0;
        this._allItems.length = 0;
        this._towerByItem.clear();
        this._ready = false;
    }

    public register(item: ItemRuntime): void {
        item.node.getWorldPosition(this._worldPos);
        this._allItems.push(item);
        this._entries.push({
            item,
            x: this._worldPos.x,
            y: this._worldPos.y,
            z: this._worldPos.z,
        });
        this.configureItem(item);
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
            const tower: TowerStack = { pieces: [], collapsed: false };
            for (let i = 0; i < column.length; i++) {
                const piece = column[i].item;
                tower.pieces.push(piece);
                this._towerByItem.set(piece, tower);
            }
        });

        this._ready = true;
        this._entries.length = 0;
    }

    /** Only the bottom item may wake before its column has collapsed. */
    public canActivate(item: ItemRuntime): boolean {
        if (!this._ready) {
            return false;
        }
        const tower = this._towerByItem.get(item);
        return !tower || tower.collapsed || tower.pieces[0] === item;
    }

    public isCollapsedTowerPiece(item: ItemRuntime): boolean {
        return !!this._towerByItem.get(item)?.collapsed;
    }

    public activateItem(item: ItemRuntime): boolean {
        if (!this.canActivate(item)) {
            return false;
        }

        this.configureItem(item);
        const tower = this._towerByItem.get(item);
        return tower?.collapsed ? item.activateStackFall() : item.activateDynamic();
    }

    /**
     * The inner threshold has already disabled the consumed base's collider.
     * Activate every remaining piece with gravity and locked X/Z motion.
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

        // Only removing stack[0] starts the vertical cascade.
        if (index !== 0 || tower.collapsed) {
            return;
        }

        tower.collapsed = true;
        for (let i = 0; i < tower.pieces.length; i++) {
            const piece = tower.pieces[i];
            this.configureItem(piece);
            if (piece.isDormant && piece.activateStackFall()) {
                this._registry.markDynamic(piece);
            }
        }
    }

    /** Backward-compatible configuration entry point for older scene code. */
    public updateFallingPieces(
        _holePosition: Vec3,
        _holeRadius: number,
        groundY: number,
        groundSafetyOffset: number,
    ): void {
        this._groundY = groundY;
        this._groundSafetyOffset = groundSafetyOffset;
    }

    private configureItem(item: ItemRuntime): void {
        if (!this._hole || !this._holeSize) {
            return;
        }
        item.configureGroundFallback(
            this._hole,
            this._holeSize,
            this._groundY,
            this._groundSafetyOffset,
        );
    }
}
