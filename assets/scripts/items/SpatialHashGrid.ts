import { Node } from 'cc';

export interface SpatialItem {
    node: Node;
}

/**
 * Spatial hash nhe cho cac item dung yen tren mat dat.
 * Item chi nam trong grid khi dang Idle. Khi bat dau bi an, ItemManager se remove no.
 */
export class SpatialHashGrid<T extends SpatialItem> {
    private readonly _cells = new Map<string, T[]>();
    private readonly _itemToCell = new Map<T, string>();

    public constructor(private readonly _cellSize: number) {
    }

    public clear(): void {
        this._cells.clear();
        this._itemToCell.clear();
    }

    public add(item: T): void {
        const position = item.node.position;
        const key = this.makeKeyFromPosition(position.x, position.z);

        let bucket = this._cells.get(key);
        if (!bucket) {
            bucket = [];
            this._cells.set(key, bucket);
        }

        bucket.push(item);
        this._itemToCell.set(item, key);
    }

    public remove(item: T): void {
        const key = this._itemToCell.get(item);
        if (!key) {
            return;
        }

        const bucket = this._cells.get(key);
        if (bucket) {
            const index = bucket.indexOf(item);
            if (index >= 0) {
                bucket.splice(index, 1);
            }

            if (bucket.length === 0) {
                this._cells.delete(key);
            }
        }

        this._itemToCell.delete(item);
    }

    public query(x: number, z: number, radius: number, out: T[]): T[] {
        out.length = 0;

        const minCellX = Math.floor((x - radius) / this._cellSize);
        const maxCellX = Math.floor((x + radius) / this._cellSize);
        const minCellZ = Math.floor((z - radius) / this._cellSize);
        const maxCellZ = Math.floor((z + radius) / this._cellSize);

        for (let cellX = minCellX; cellX <= maxCellX; cellX++) {
            for (let cellZ = minCellZ; cellZ <= maxCellZ; cellZ++) {
                const bucket = this._cells.get(this.makeKey(cellX, cellZ));
                if (!bucket) {
                    continue;
                }

                for (let i = 0; i < bucket.length; i++) {
                    out.push(bucket[i]);
                }
            }
        }

        return out;
    }

    private makeKeyFromPosition(x: number, z: number): string {
        const cellX = Math.floor(x / this._cellSize);
        const cellZ = Math.floor(z / this._cellSize);
        return this.makeKey(cellX, cellZ);
    }

    private makeKey(cellX: number, cellZ: number): string {
        return cellX + ':' + cellZ;
    }
}
