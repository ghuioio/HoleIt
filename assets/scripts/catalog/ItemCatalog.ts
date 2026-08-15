import { _decorator, CCString, Component, Prefab } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('ItemCatalog')
export class ItemCatalog extends Component {
    @property({ type: [CCString], tooltip: 'LevelData ID for each prefab at the same index in itemPrefabs.' })
    public itemPrefabIds: string[] = [];

    @property({ type: [Prefab], tooltip: 'Prefab for each ID at the same index in itemPrefabIds.' })
    public itemPrefabs: Prefab[] = [];

    @property({ type: Prefab, tooltip: 'Fallback visual used for IDs that have no supplied FBX.' })
    public fallbackPrefab: Prefab | null = null;

    @property({ type: [CCString], tooltip: 'Optional alias ID list. Must have same length as aliasPrefabs.' })
    public aliasIds: string[] = [];

    @property({ type: [Prefab], tooltip: 'Prefab mapped to the ID at the same index in aliasIds.' })
    public aliasPrefabs: Prefab[] = [];

    private readonly _map = new Map<string, Prefab>();

    protected onLoad(): void {
        this.rebuild();
    }

    public rebuild(): void {
        this._map.clear();

        for (let i = 0; i < this.itemPrefabs.length; i++) {
            const prefab = this.itemPrefabs[i];
            if (!prefab) {
                continue;
            }

            const id = this.itemPrefabIds[i] || prefab.name;
            if (!id) {
                console.warn(`[ItemCatalog] Prefab at index ${i} has no explicit LevelData ID.`);
                continue;
            }
            this._map.set(id, prefab);
        }

        const count = Math.min(this.aliasIds.length, this.aliasPrefabs.length);
        for (let i = 0; i < count; i++) {
            const id = this.aliasIds[i];
            const prefab = this.aliasPrefabs[i];
            if (id && prefab) {
                this._map.set(id, prefab);
            }
        }
    }

    public getPrefab(id: string): Prefab | null {
        return this._map.get(id) || this.fallbackPrefab;
    }

    public hasExactPrefab(id: string): boolean {
        return this._map.has(id);
    }
}
