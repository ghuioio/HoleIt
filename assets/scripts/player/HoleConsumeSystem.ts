import { _decorator, Component, Node, Vec3 } from 'cc';
import { GameEvent, gameEvents } from '../core/GameEvents';
import { ItemRegistry } from '../items/ItemRegistry';
import { ItemRuntime } from '../items/ItemRuntime';
import { HoleSizeController } from './HoleSizeController';

const { ccclass, property } = _decorator;

@ccclass('HoleConsumeSystem')
export class HoleConsumeSystem extends Component {
    @property({ type: ItemRegistry })
    public registry: ItemRegistry | null = null;

    @property({ type: Node })
    public hole: Node | null = null;

    @property({ type: HoleSizeController })
    public holeSize: HoleSizeController | null = null;

    @property({ tooltip: 'Y coordinate of the visible hole surface.' })
    public holePlaneY = 0.03;

    @property({ tooltip: 'Item center must fall below holePlaneY + this value before capture.' })
    public captureHeight = 0.45;

    @property({ tooltip: 'Extra safety margin so large objects do not clip through the rim.' })
    public rimPadding = 0.04;

    @property({ tooltip: 'Horizontal pull speed while an item is falling through the Hole.' })
    public pullSpeed = 3.5;

    @property({ tooltip: 'Downward velocity while an item is in the Hole.' })
    public downSpeed = 5.5;

    @property({ tooltip: 'Disable an item after it reaches holePlaneY - killDepth.' })
    public killDepth = 1.8;

    @property({ tooltip: 'How often dynamic items are tested for capture.' })
    public captureScanInterval = 0.025;

    private _captureTimer = 0;
    private readonly _dynamic: ItemRuntime[] = [];
    private readonly _falling: ItemRuntime[] = [];
    private readonly _holePos = new Vec3();
    private readonly _itemPos = new Vec3();
    private readonly _velocity = new Vec3();

    protected update(dt: number): void {
        if (!this.registry || !this.hole || !this.holeSize) {
            return;
        }

        this.hole.getWorldPosition(this._holePos);
        this._captureTimer -= dt;
        if (this._captureTimer <= 0) {
            this._captureTimer = Math.max(0.01, this.captureScanInterval);
            this.captureNearbyDynamicItems();
        }

        this.updateFallingItems();
    }

    private captureNearbyDynamicItems(): void {
        this.registry!.copyDynamicTo(this._dynamic);
        const holeRadius = this.holeSize!.radius;
        const holeLevel = this.holeSize!.level;

        for (let i = 0; i < this._dynamic.length; i++) {
            const item = this._dynamic[i];
            if (!item.isDynamic || item.requiredHoleLevel > holeLevel) {
                continue;
            }

            item.node.getWorldPosition(this._itemPos);
            if (this._itemPos.y > this.holePlaneY + this.captureHeight) {
                continue;
            }

            const allowedRadius = Math.max(
                0.02,
                holeRadius - item.consumeRadius - this.rimPadding,
            );
            const dx = this._itemPos.x - this._holePos.x;
            const dz = this._itemPos.z - this._holePos.z;
            if ((dx * dx + dz * dz) > allowedRadius * allowedRadius) {
                continue;
            }

            this.buildPullVelocity(this._itemPos, this._velocity);
            item.beginFalling(this._velocity);
            if (item.isFalling) {
                this._falling.push(item);
                gameEvents.emit(GameEvent.ITEM_CONSUME_STARTED, item.id, item);
            }
        }
    }

    private updateFallingItems(): void {
        for (let i = this._falling.length - 1; i >= 0; i--) {
            const item = this._falling[i];
            if (!item.node.active || !item.isFalling) {
                this._falling.splice(i, 1);
                continue;
            }

            item.node.getWorldPosition(this._itemPos);
            if (this._itemPos.y <= this.holePlaneY - this.killDepth) {
                const id = item.id;
                const value = item.consumeValue;
                this.registry!.markConsumed(item);
                this.holeSize!.addXp(value);
                gameEvents.emit(GameEvent.ITEM_CONSUMED, id, value, item);
                this._falling.splice(i, 1);
                continue;
            }

            this.buildPullVelocity(this._itemPos, this._velocity);
            item.setFallingVelocity(this._velocity);
        }
    }

    private buildPullVelocity(itemPosition: Vec3, out: Vec3): Vec3 {
        let dx = this._holePos.x - itemPosition.x;
        let dz = this._holePos.z - itemPosition.z;
        const len = Math.sqrt(dx * dx + dz * dz);
        if (len > 0.0001) {
            dx /= len;
            dz /= len;
        }

        out.set(dx * this.pullSpeed, -Math.abs(this.downSpeed), dz * this.pullSpeed);
        return out;
    }
}
