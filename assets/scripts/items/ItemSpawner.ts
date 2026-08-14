import { _decorator, Component, instantiate, Node, Quat, Vec3 } from 'cc';
import { GameEvent, gameEvents } from '../core/GameEvents';
import { ItemCatalog } from '../catalog/ItemCatalog';
import { LevelDataLoader } from '../data/LevelDataLoader';
import { LevelVec3Data, RuntimeSpawnRecord } from '../data/LevelDataTypes';
import { UnityTransformConverter } from '../data/UnityTransformConverter';
import { ItemRegistry } from './ItemRegistry';
import { ItemRuntime } from './ItemRuntime';

const { ccclass, property } = _decorator;

@ccclass('ItemSpawner')
export class ItemSpawner extends Component {
    @property({ type: LevelDataLoader })
    public levelLoader: LevelDataLoader | null = null;

    @property({ type: UnityTransformConverter })
    public transformConverter: UnityTransformConverter | null = null;

    @property({ type: ItemCatalog })
    public catalog: ItemCatalog | null = null;

    @property({ type: ItemRegistry })
    public registry: ItemRegistry | null = null;

    @property({ type: Node, tooltip: 'Parent for every runtime level item. Keep this node at identity transform.' })
    public levelRoot: Node | null = null;

    @property({ tooltip: 'Chunk spawning prevents a multi-frame stall. 80-150 is a good mobile starting range.' })
    public spawnPerFrame = 100;

    private _records: ReadonlyArray<RuntimeSpawnRecord> = [];
    private _spawnIndex = 0;
    private _spawning = false;
    private readonly _missingIds = new Set<string>();
    private readonly _srcPos: LevelVec3Data = { x: 0, y: 0, z: 0 };
    private readonly _srcRot: LevelVec3Data = { x: 0, y: 0, z: 0 };
    private readonly _position = new Vec3();
    private readonly _rotation = new Quat();

    protected onEnable(): void {
        gameEvents.on(GameEvent.LEVEL_DATA_READY, this.onLevelDataReady, this);
    }

    protected onDisable(): void {
        gameEvents.off(GameEvent.LEVEL_DATA_READY, this.onLevelDataReady, this);
    }

    protected update(): void {
        if (!this._spawning) {
            return;
        }

        const end = Math.min(this._records.length, this._spawnIndex + Math.max(1, this.spawnPerFrame));
        while (this._spawnIndex < end) {
            this.spawnOne(this._records[this._spawnIndex], this._spawnIndex);
            this._spawnIndex++;
        }

        gameEvents.emit(
            GameEvent.LEVEL_SPAWN_PROGRESS,
            this._spawnIndex,
            this._records.length,
        );

        if (this._spawnIndex >= this._records.length) {
            this._spawning = false;
            this.registry!.notifyCounts();
            gameEvents.emit(GameEvent.LEVEL_SPAWN_COMPLETE, this._records.length);
        }
    }

    private onLevelDataReady(loader: LevelDataLoader): void {
        if (this.levelLoader && loader !== this.levelLoader) {
            return;
        }
        if (!this.catalog || !this.registry || !this.transformConverter || !this.levelRoot) {
            console.error('[ItemSpawner] Missing Inspector references. Check README_SETUP.md.');
            return;
        }

        this.catalog.rebuild();
        this._records = loader.records;
        this._spawnIndex = 0;
        this._spawning = true;
    }

    private spawnOne(record: RuntimeSpawnRecord, spawnIndex: number): void {
        const prefab = this.catalog!.getPrefab(record.id);
        if (!prefab) {
            if (!this._missingIds.has(record.id)) {
                this._missingIds.add(record.id);
                console.warn(`[ItemSpawner] No prefab/fallback for ${record.id}. Skipping these instances.`);
            }
            return;
        }

        if (!this.catalog!.hasExactPrefab(record.id) && !this._missingIds.has(record.id)) {
            this._missingIds.add(record.id);
            console.warn(`[ItemSpawner] ${record.id} uses fallback/alias prefab.`);
        }

        const node = instantiate(prefab);
        node.parent = this.levelRoot!;

        this._srcPos.x = record.px;
        this._srcPos.y = record.py;
        this._srcPos.z = record.pz;
        this.transformConverter!.convertPosition(this._srcPos, this._position);
        node.setPosition(this._position);

        this._srcRot.x = record.rx;
        this._srcRot.y = record.ry;
        this._srcRot.z = record.rz;
        this.transformConverter!.convertRotation(this._srcRot, this._rotation);
        node.setRotation(this._rotation);

        const runtime = node.getComponent(ItemRuntime);
        if (!runtime) {
            console.error(`[ItemSpawner] Prefab ${prefab.name} must have ItemRuntime on its root node.`);
            node.destroy();
            return;
        }

        runtime.initialize(record.id, spawnIndex);
        this.registry!.register(runtime);
    }
}
