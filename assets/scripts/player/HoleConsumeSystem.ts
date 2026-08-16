import { _decorator, Component, Node, PhysicsMaterial, Vec3 } from 'cc';
import { GameEvent, gameEvents } from '../core/GameEvents';
import { ItemRegistry } from '../items/ItemRegistry';
import { ItemRuntime } from '../items/ItemRuntime';
import { StackController } from '../items/StackController';
import { HoleSizeController } from './HoleSizeController';

const { ccclass, property } = _decorator;

/**
 * Two-stage Cocos equivalent of a Hole.io vacuum:
 *  1. Outer vortex attracts fitting objects and shrinks them at the rim.
 *  2. Inner zone disables physics immediately, animates scale to zero, then
 *     recycles the item through ItemRegistry/ItemPool.
 */
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

    @property({ tooltip: 'Outer vortex extends this far beyond the valid inner opening.' })
    public outerPadding = 0.18;

    @property({ tooltip: 'Outer suction radius as a multiple of the current hole radius (1.2-1.4).' })
    public outerRadiusMultiplier = 1.3;

    @property({ tooltip: 'Objects above this height are not captured by the vortex.' })
    public outerCaptureHeight = 8.0;

    @property({ tooltip: 'Inner swallow zone starts this far below the visible surface.' })
    public innerDepth = 0.12;

    @property({ tooltip: 'Top surface Y of the solid ground collider.' })
    public groundY = 0.075;

    @property({ tooltip: 'Minimum item-center clearance used when recovering outside the Hole.' })
    public groundSafetyOffset = 0.01;

    @property({ tooltip: 'Extra hysteresis before an item fully exits the outer vortex.' })
    public vortexExitPadding = 0.12;

    @property({ tooltip: 'Objects scale toward this fraction while crossing the rim.' })
    public rimScale = 0.76;

    @property({ tooltip: 'How quickly objects interpolate toward rimScale.' })
    public rimScaleSpeed = 11;

    @property({ tooltip: 'Acceleration pulling objects horizontally toward the hole center.' })
    public inwardAcceleration = 18;

    @property({ tooltip: 'Extra downward acceleration inside the outer vortex.' })
    public downwardAcceleration = 36;

    @property({ tooltip: 'Maximum horizontal speed while being vacuumed.' })
    public maxPullSpeed = 4;

    @property({ tooltip: 'Maximum downward speed while being vacuumed.' })
    public maxDownSpeed = 9;

    @property({ tooltip: 'Time to scale an ingested item to zero before pooling.' })
    public swallowDuration = 0.15;

    @property({ tooltip: 'Extra safety margin so large objects do not clip through the rim.' })
    public rimPadding = 0.035;

    @property({ tooltip: 'Small fit allowance that makes valid captures responsive.' })
    public captureForgiveness = 0.02;

    @property({ tooltip: 'Emergency depth that recycles an item even if the moving hole outruns it.' })
    public killDepth = 1.8;

    @property({ tooltip: 'How often dynamic items are tested for outer-vortex entry.' })
    public captureScanInterval = 0.025;

    @property({ tooltip: 'Maximum budget-bypass wakes per capture scan to avoid a physics spike.' })
    public maxPriorityActivationsPerScan = 24;

    private _captureTimer = 0;
    private _stackController: StackController | null = null;
    private readonly _dynamic: ItemRuntime[] = [];
    private readonly _dormantNearby: ItemRuntime[] = [];
    private readonly _vortex: ItemRuntime[] = [];
    private readonly _swallowing: ItemRuntime[] = [];
    private readonly _holePos = new Vec3();
    private readonly _itemPos = new Vec3();
    private readonly _zeroFrictionMaterial = new PhysicsMaterial();

    protected onLoad(): void {
        this._zeroFrictionMaterial.friction = 0;
        this._zeroFrictionMaterial.rollingFriction = 0;
        this._zeroFrictionMaterial.spinningFriction = 0;
        this._zeroFrictionMaterial.restitution = 0;
    }

    protected update(dt: number): void {
        if (!this.registry || !this.hole || !this.holeSize) {
            return;
        }

        this.hole.getWorldPosition(this._holePos);
        if (!this._stackController) {
            this._stackController = this.registry.node.getComponent(StackController);
            this._stackController?.configureGroundFallback(
                this.hole,
                this.holeSize,
                this.groundY,
                this.groundSafetyOffset,
            );
        }

        this._captureTimer -= dt;
        if (this._captureTimer <= 0) {
            this._captureTimer = Math.max(0.01, this.captureScanInterval);
            this.captureOuterVortexItems();
        }

        this.updateVortexItems(dt);
        this.applyVortexForces();
        this.updateSwallowingItems(dt);
    }

    private captureOuterVortexItems(): void {
        const holeRadius = this.holeSize!.radius;
        const holeLevel = this.holeSize!.level;
        const shrunkScale = Math.min(0.8, Math.max(0.7, this.rimScale));

        // Critical gameplay path: objects inside the Hole must not be blocked
        // by the global dynamic-body budget. Query the dormant spatial grid and
        // directly wake only eligible tower bases that are already in range.
        const dormantQueryRadius = holeRadius
            * Math.min(1.4, Math.max(1.2, this.outerRadiusMultiplier));
        this.registry!.queryDormant(this._holePos, dormantQueryRadius, this._dormantNearby);
        let priorityActivations = 0;
        for (let i = 0; i < this._dormantNearby.length; i++) {
            if (priorityActivations >= Math.max(1, this.maxPriorityActivationsPerScan)) {
                break;
            }
            if (this.tryEnterOuterVortex(
                this._dormantNearby[i],
                holeRadius,
                holeLevel,
                shrunkScale,
                true,
            )) {
                priorityActivations++;
            }
        }

        this.registry!.copyDynamicTo(this._dynamic);
        for (let i = 0; i < this._dynamic.length; i++) {
            this.tryEnterOuterVortex(
                this._dynamic[i],
                holeRadius,
                holeLevel,
                shrunkScale,
                false,
            );
        }
    }

    private tryEnterOuterVortex(
        item: ItemRuntime,
        holeRadius: number,
        holeLevel: number,
        shrunkScale: number,
        allowDormantActivation: boolean,
    ): boolean {
        if ((!item.isDynamic && !item.isDormant) || item.requiredHoleLevel > holeLevel) {
            return false;
        }

        item.node.getWorldPosition(this._itemPos);
        if (this._itemPos.y > this.holePlaneY + this.outerCaptureHeight + item.consumeRadius) {
            return false;
        }

        // Fit is evaluated at the anti-jam rim scale, matching what is
        // visually and physically entering the opening.
        const effectiveRadius = item.consumeRadius * shrunkScale;
        const innerRadius = holeRadius
            - effectiveRadius
            - this.rimPadding
            + this.captureForgiveness;
        if (innerRadius <= 0) {
            return false;
        }

        const dx = this._itemPos.x - this._holePos.x;
        const dz = this._itemPos.z - this._holePos.z;
        const outerRadius = this.getOuterRadius(holeRadius, innerRadius);
        if ((dx * dx + dz * dz) > outerRadius * outerRadius) {
            return false;
        }

        if (item.isDormant) {
            if (!allowDormantActivation
                || !this._stackController
                || !this._stackController.canActivate(item)) {
                return false;
            }

            const activated = this._stackController.activateItem(item);
            if (!activated) {
                return false;
            }
            this.registry!.markDynamic(item);
        }

        item.configureGroundFallback(
            this.hole!,
            this.holeSize!,
            this.groundY,
            this.groundSafetyOffset,
        );

        if (item.beginVortex(shrunkScale, this._zeroFrictionMaterial)) {
            this._vortex.push(item);
            gameEvents.emit(GameEvent.ITEM_CONSUME_STARTED, item.id, item);
            return true;
        }
        return false;
    }

    /** Hot physics loop: all bodies/components and temporary vectors are cached. */
    private applyVortexForces(): void {
        for (let i = this._vortex.length - 1; i >= 0; i--) {
            const item = this._vortex[i];
            if (!item.node.active || !item.isVortex) {
                this._vortex.splice(i, 1);
                continue;
            }

            item.node.getWorldPosition(this._itemPos);
            let dx = this._holePos.x - this._itemPos.x;
            let dz = this._holePos.z - this._itemPos.z;
            const horizontalLength = Math.sqrt(dx * dx + dz * dz);
            if (horizontalLength > 0.0001) {
                dx /= horizontalLength;
                dz /= horizontalLength;
            } else {
                dx = 0;
                dz = 0;
            }

            // Equivalent to ProjectOnPlane(center - position, Vec3.UP), then
            // ForceMode.Acceleration through ItemRuntime's F = mass * a.
            item.applyVortexAcceleration(
                dx,
                dz,
                this.inwardAcceleration,
                this.downwardAcceleration,
            );
            item.limitVortexVelocity(this.maxPullSpeed, this.maxDownSpeed);
        }
    }

    private updateVortexItems(dt: number): void {
        const holeRadius = this.holeSize!.radius;
        const shrunkScale = Math.min(0.8, Math.max(0.7, this.rimScale));

        for (let i = this._vortex.length - 1; i >= 0; i--) {
            const item = this._vortex[i];
            if (!item.node.active || !item.isVortex) {
                this._vortex.splice(i, 1);
                continue;
            }

            item.tickIngestionVisual(dt, this.rimScaleSpeed);
            item.node.getWorldPosition(this._itemPos);

            const effectiveRadius = item.consumeRadius * shrunkScale;
            const innerRadius = Math.max(
                0.04,
                holeRadius - effectiveRadius - this.rimPadding + this.captureForgiveness,
            );
            const dx = this._itemPos.x - this._holePos.x;
            const dz = this._itemPos.z - this._holePos.z;
            const distanceSq = dx * dx + dz * dz;
            const insideHoleRadius = distanceSq <= holeRadius * holeRadius;
            const insideOpening = distanceSq <= innerRadius * innerRadius;
            const outerRadius = this.getOuterRadius(holeRadius, innerRadius);
            const exitedOuterVortex = distanceSq
                > (outerRadius + this.vortexExitPadding) * (outerRadius + this.vortexExitPadding);
            const minimumCenterY = item.getGroundMinimumCenterY(
                this.groundY,
                this.groundSafetyOffset,
            );

            if (!insideHoleRadius
                && (exitedOuterVortex || this._itemPos.y <= minimumCenterY)) {
                item.exitVortexToGround(minimumCenterY);
                this._vortex.splice(i, 1);
                continue;
            }

            const belowInnerZone = this._itemPos.y <= this.holePlaneY - this.innerDepth;
            const belowEmergencyDepth = insideHoleRadius
                && this._itemPos.y <= this.holePlaneY - this.killDepth;

            if ((!insideOpening || !belowInnerZone) && !belowEmergencyDepth) {
                continue;
            }

            if (!item.beginSwallow(this.swallowDuration)) {
                continue;
            }

            this._vortex.splice(i, 1);
            this._swallowing.push(item);
            if (this._stackController) {
                this._stackController.onItemEnteredSwallow(item);
            }
            // Gameplay/VFX hook: the collider is already disabled at this point.
            gameEvents.emit(GameEvent.ITEM_SWALLOW_ENTERED, item.id, item.consumeValue, item);
        }
    }

    private updateSwallowingItems(dt: number): void {
        for (let i = this._swallowing.length - 1; i >= 0; i--) {
            const item = this._swallowing[i];
            if (!item.node.active || item.isConsumed) {
                this._swallowing.splice(i, 1);
                continue;
            }
            if (!item.tickIngestionVisual(dt, this.rimScaleSpeed)) {
                continue;
            }

            const id = item.id;
            const value = item.consumeValue;
            // Notify progression before pooling deactivates the item.
            this.holeSize!.recordItemEaten(value);
            this.registry!.markConsumed(item);
            gameEvents.emit(GameEvent.ITEM_CONSUMED, id, value, item);
            this._swallowing.splice(i, 1);
        }
    }

    private getOuterRadius(holeRadius: number, innerRadius: number): number {
        const minRadius = holeRadius
            * Math.min(1.4, Math.max(1.2, this.outerRadiusMultiplier));
        const paddedRadius = innerRadius + Math.max(0.05, this.outerPadding);
        return Math.min(holeRadius * 1.4, Math.max(minRadius, paddedRadius));
    }
}
