import { _decorator, Component, Vec3 } from 'cc';
import { ItemCube } from '../items/ItemCube';
import { ItemManager } from '../items/ItemManager';

const { ccclass, property } = _decorator;

@ccclass('HoleEater')
export class HoleEater extends Component {
    @property({ type: ItemManager })
    public itemManager: ItemManager | null = null;

    @property({ tooltip: 'Ban kinh an item theo mat phang XZ.' })
    public eatRadius = 1.15;

    @property({ tooltip: 'Moi bao nhieu giay moi scan spatial grid mot lan.' })
    public scanInterval = 0.035;

    @property({ tooltip: 'Gioi han so item bat dau roi trong moi lan scan.' })
    public maxEatPerScan = 30;

    @property({ tooltip: 'Thoi gian mot cube roi vao Hole.' })
    public eatDuration = 0.28;

    @property({ tooltip: 'Cube o cao se bat dau roi tre hon de tao hieu ung sap thap.' })
    public heightDelayFactor = 0.025;

    @property({ tooltip: 'Y world cua diem ket thuc, nen nam duoi Ground.' })
    public targetY = -0.9;

    private _timer = 0;
    private readonly _holeWorldPos = new Vec3();
    private readonly _itemWorldPos = new Vec3();
    private readonly _eatTarget = new Vec3();
    private readonly _candidates: ItemCube[] = [];

    protected update(deltaTime: number): void {
        if (!this.itemManager) {
            return;
        }

        this._timer += deltaTime;
        if (this._timer < this.scanInterval) {
            return;
        }
        this._timer = 0;

        this.node.getWorldPosition(this._holeWorldPos);
        this.itemManager.queryNearby(this._holeWorldPos, this.eatRadius, this._candidates);

        const radiusSq = this.eatRadius * this.eatRadius;
        let started = 0;

        for (let i = 0; i < this._candidates.length; i++) {
            if (started >= this.maxEatPerScan) {
                break;
            }

            const item = this._candidates[i];
            if (!item.isIdle) {
                continue;
            }

            item.node.getWorldPosition(this._itemWorldPos);
            const dx = this._itemWorldPos.x - this._holeWorldPos.x;
            const dz = this._itemWorldPos.z - this._holeWorldPos.z;
            if (dx * dx + dz * dz > radiusSq) {
                continue;
            }

            this._eatTarget.set(this._holeWorldPos.x, this.targetY, this._holeWorldPos.z);
            const delay = Math.max(0, this._itemWorldPos.y) * this.heightDelayFactor + (started % 4) * 0.008;

            if (this.itemManager.consumeItem(item, this._eatTarget, delay, this.eatDuration)) {
                started++;
            }
        }
    }
}
