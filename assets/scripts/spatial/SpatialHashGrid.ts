import { Vec3 } from 'cc';

/**
 * XZ spatial hash for dormant items. Dynamic items are removed from this grid
 * until they are frozen again, so the Hole never scans all 4k+ objects.
 */
export class SpatialHashGrid<T extends object> {
    private readonly _cells = new Map<string, Set<T>>();
    private readonly _itemKeys = new Map<T, string>();

    public constructor(private readonly _cellSize: number) {}

    public clear(): void {
        this._cells.clear();
        this._itemKeys.clear();
    }

    public insert(item: T, position: Vec3): void {
        this.remove(item);
        const key = this.getKey(position.x, position.z);
        let cell = this._cells.get(key);
        if (!cell) {
            cell = new Set<T>();
            this._cells.set(key, cell);
        }
        cell.add(item);
        this._itemKeys.set(item, key);
    }

    public remove(item: T): void {
        const key = this._itemKeys.get(item);
        if (key === undefined) {
            return;
        }

        const cell = this._cells.get(key);
        if (cell) {
            cell.delete(item);
            if (cell.size === 0) {
                this._cells.delete(key);
            }
        }
        this._itemKeys.delete(item);
    }

    public query(position: Vec3, radius: number, out: T[]): void {
        out.length = 0;
        const minX = Math.floor((position.x - radius) / this._cellSize);
        const maxX = Math.floor((position.x + radius) / this._cellSize);
        const minZ = Math.floor((position.z - radius) / this._cellSize);
        const maxZ = Math.floor((position.z + radius) / this._cellSize);

        for (let x = minX; x <= maxX; x++) {
            for (let z = minZ; z <= maxZ; z++) {
                const cell = this._cells.get(`${x}:${z}`);
                if (!cell) {
                    continue;
                }
                cell.forEach((item) => out.push(item));
            }
        }
    }

    private getKey(x: number, z: number): string {
        return `${Math.floor(x / this._cellSize)}:${Math.floor(z / this._cellSize)}`;
    }
}
