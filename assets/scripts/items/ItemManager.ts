import { _decorator, Component, Vec3 } from 'cc';
import { ItemCube } from './ItemCube';
import { SpatialHashGrid } from './SpatialHashGrid';

const { ccclass, property } = _decorator;

@ccclass('ItemManager')
export class ItemManager extends Component {
    @property({ tooltip: 'Kich thuoc moi cell spatial grid. Nen lon hon duong kinh Hole mot chut.' })
    public gridCellSize = 2.5;

    private _grid: SpatialHashGrid<ItemCube> | null = null;
    private readonly _consuming: ItemCube[] = [];

    private _totalSpawned = 0;
    private _eatenCount = 0;

    public get totalSpawned(): number {
        return this._totalSpawned;
    }

    public get eatenCount(): number {
        return this._eatenCount;
    }

    public get activeCount(): number {
        return this._totalSpawned - this._eatenCount;
    }

    protected onLoad(): void {
        this._grid = new SpatialHashGrid<ItemCube>(Math.max(0.5, this.gridCellSize));
    }

    public registerItem(item: ItemCube): void {
        if (!this._grid) {
            return;
        }

        item.prepareForUse();
        this._grid.add(item);
        this._totalSpawned++;
    }

    public queryNearby(position: Vec3, radius: number, out: ItemCube[]): ItemCube[] {
        if (!this._grid) {
            out.length = 0;
            return out;
        }

        return this._grid.query(position.x, position.z, radius, out);
    }

    public consumeItem(item: ItemCube, targetWorldPos: Vec3, delay: number, duration: number): boolean {
        if (!this._grid || !item.isIdle) {
            return false;
        }

        // Remove khoi grid ngay luc bat dau roi de lan scan tiep theo khong tim lai item nay.
        this._grid.remove(item);

        if (!item.beginConsume(targetWorldPos, delay, duration)) {
            return false;
        }

        this._consuming.push(item);
        return true;
    }

    protected update(deltaTime: number): void {
        const dt = Math.min(deltaTime, 0.05);

        for (let i = this._consuming.length - 1; i >= 0; i--) {
            const item = this._consuming[i];
            if (!item.tickConsume(dt)) {
                continue;
            }

            this._consuming.splice(i, 1);
            this._eatenCount++;
        }
    }
}
