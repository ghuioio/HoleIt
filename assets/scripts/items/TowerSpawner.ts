import { _decorator, Component, instantiate, Prefab, Vec3 } from 'cc';
import { ItemCube } from './ItemCube';
import { ItemManager } from './ItemManager';

const { ccclass, property } = _decorator;

@ccclass('TowerSpawner')
export class TowerSpawner extends Component {
    @property({ type: Prefab, tooltip: 'Prefab Cube co ItemCube component.' })
    public cubePrefab: Prefab | null = null;

    @property({ type: ItemManager })
    public itemManager: ItemManager | null = null;

    @property({ tooltip: 'So tower theo truc X.' })
    public towerCountX = 4;

    @property({ tooltip: 'So tower theo truc Z.' })
    public towerCountZ = 3;

    @property({ tooltip: 'So cube moi canh cua 1 layer. 5 => 25 cube/layer.' })
    public baseSize = 5;

    @property({ tooltip: 'So layer cua moi tower.' })
    public layerCount = 4;

    @property({ tooltip: 'Khoang cach giua tam cac tower.' })
    public towerSpacing = 6;

    @property({ tooltip: 'Scale dong deu cua cube prefab.' })
    public cubeScale = 0.45;

    @property({ tooltip: 'Khoang trong nho giua cac cube.' })
    public cubeGap = 0.04;

    @property({ tooltip: 'So cube instantiate moi frame de tranh spike luc khoi tao.' })
    public spawnPerFrame = 120;

    private readonly _spawnPositions: Vec3[] = [];
    private _spawnIndex = 0;
    private _isReady = false;

    public get plannedCount(): number {
        return this._spawnPositions.length;
    }

    public get isFinished(): boolean {
        return this._isReady && this._spawnIndex >= this._spawnPositions.length;
    }

    protected start(): void {
        if (!this.cubePrefab) {
            console.error('[TowerSpawner] cubePrefab is missing.');
            return;
        }

        if (!this.itemManager) {
            console.error('[TowerSpawner] itemManager is missing.');
            return;
        }

        this.buildSpawnPositions();
        this._isReady = true;
    }

    protected update(): void {
        if (!this._isReady || this.isFinished || !this.cubePrefab || !this.itemManager) {
            return;
        }

        const countThisFrame = Math.max(1, Math.floor(this.spawnPerFrame));
        const end = Math.min(this._spawnIndex + countThisFrame, this._spawnPositions.length);

        while (this._spawnIndex < end) {
            const cubeNode = instantiate(this.cubePrefab);
            this.node.addChild(cubeNode);
            cubeNode.setPosition(this._spawnPositions[this._spawnIndex]);
            cubeNode.setScale(this.cubeScale, this.cubeScale, this.cubeScale);

            const itemCube = cubeNode.getComponent(ItemCube);
            if (!itemCube) {
                console.error('[TowerSpawner] Cube prefab must contain ItemCube component.');
                cubeNode.destroy();
                this._spawnIndex++;
                continue;
            }

            this.itemManager.registerItem(itemCube);
            this._spawnIndex++;
        }
    }

    private buildSpawnPositions(): void {
        this._spawnPositions.length = 0;
        this._spawnIndex = 0;

        const countX = Math.max(1, Math.floor(this.towerCountX));
        const countZ = Math.max(1, Math.floor(this.towerCountZ));
        const size = Math.max(1, Math.floor(this.baseSize));
        const layers = Math.max(1, Math.floor(this.layerCount));
        const cubeStep = this.cubeScale + this.cubeGap;

        const towerOffsetX = (countX - 1) * 0.5;
        const towerOffsetZ = (countZ - 1) * 0.5;
        const cubeOffset = (size - 1) * 0.5;

        for (let towerX = 0; towerX < countX; towerX++) {
            for (let towerZ = 0; towerZ < countZ; towerZ++) {
                const centerX = (towerX - towerOffsetX) * this.towerSpacing;
                const centerZ = (towerZ - towerOffsetZ) * this.towerSpacing;

                for (let layer = 0; layer < layers; layer++) {
                    for (let x = 0; x < size; x++) {
                        for (let z = 0; z < size; z++) {
                            const px = centerX + (x - cubeOffset) * cubeStep;
                            const py = this.cubeScale * 0.5 + layer * cubeStep;
                            const pz = centerZ + (z - cubeOffset) * cubeStep;
                            this._spawnPositions.push(new Vec3(px, py, pz));
                        }
                    }
                }
            }
        }

        console.log('[TowerSpawner] Planned item count:', this._spawnPositions.length);
    }
}
