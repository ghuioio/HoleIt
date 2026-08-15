import { _decorator, Component, Vec3 } from 'cc';
import { GameEvent, gameEvents } from '../core/GameEvents';
import { SpatialHashGrid } from '../spatial/SpatialHashGrid';
import { ItemRuntime } from './ItemRuntime';

const { ccclass, property } = _decorator;

@ccclass('ItemRegistry')
export class ItemRegistry extends Component {
    @property({ tooltip: 'Spatial hash cell size in world units.' })
    public cellSize = 2.5;

    private _grid: SpatialHashGrid<ItemRuntime> | null = null;
    private readonly _all = new Set<ItemRuntime>();
    private readonly _dynamic = new Set<ItemRuntime>();
    private _consumedCount = 0;
    private _recycleHandler: ((item: ItemRuntime) => void) | null = null;
    private readonly _worldPos = new Vec3();

    public get totalCount(): number {
        return this._all.size;
    }

    public get dynamicCount(): number {
        return this._dynamic.size;
    }

    public get consumedCount(): number {
        return this._consumedCount;
    }

    public get remainingCount(): number {
        return Math.max(0, this._all.size - this._consumedCount);
    }

    protected onLoad(): void {
        this._grid = new SpatialHashGrid<ItemRuntime>(Math.max(0.5, this.cellSize));
    }

    public register(item: ItemRuntime): void {
        if (this._all.has(item)) {
            return;
        }
        this._all.add(item);
        item.node.getWorldPosition(this._worldPos);
        this._grid!.insert(item, this._worldPos);
        if ((this._all.size % 100) === 0) {
            this.emitCounts();
        }
    }

    public setRecycleHandler(handler: ((item: ItemRuntime) => void) | null): void {
        this._recycleHandler = handler;
    }

    public unregister(item: ItemRuntime): void {
        this._grid!.remove(item);
        this._dynamic.delete(item);
        this._all.delete(item);
        this.emitCounts();
    }

    public markDynamic(item: ItemRuntime): void {
        this._grid!.remove(item);
        this._dynamic.add(item);
    }

    public markDormant(item: ItemRuntime): void {
        this._dynamic.delete(item);
        item.node.getWorldPosition(this._worldPos);
        this._grid!.insert(item, this._worldPos);
    }

    public markConsumed(item: ItemRuntime): void {
        if (item.isConsumed) {
            return;
        }
        this._grid!.remove(item);
        this._dynamic.delete(item);
        this._consumedCount++;
        item.markConsumed();
        if (this._recycleHandler) {
            this._recycleHandler(item);
        }
        this.emitCounts();
    }

    public queryDormant(position: Vec3, radius: number, out: ItemRuntime[]): void {
        this._grid!.query(position, radius, out);
    }

    public notifyCounts(): void {
        this.emitCounts();
    }

    public copyDynamicTo(out: ItemRuntime[]): void {
        out.length = 0;
        this._dynamic.forEach((item) => out.push(item));
    }

    private emitCounts(): void {
        gameEvents.emit(
            GameEvent.ITEM_COUNTS_CHANGED,
            this.totalCount,
            this.remainingCount,
            this.consumedCount,
            this.dynamicCount,
        );
    }
}
