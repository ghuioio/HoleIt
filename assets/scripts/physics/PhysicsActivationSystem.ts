import { _decorator, Collider, Component, Node, Vec3 } from 'cc';
import { ItemRegistry } from '../items/ItemRegistry';
import { ItemRuntime } from '../items/ItemRuntime';
import { StackController } from '../items/StackController';
import { PhysicsGroup } from './PhysicsGroups';

const { ccclass, property } = _decorator;

@ccclass('PhysicsActivationSystem')
export class PhysicsActivationSystem extends Component {
    @property({ type: ItemRegistry })
    public registry: ItemRegistry | null = null;

    @property({ type: Node })
    public hole: Node | null = null;

    @property({ type: Collider, tooltip: 'Static playfield collider. Assigned to the GROUND physics group at runtime.' })
    public groundCollider: Collider | null = null;

    @property({ tooltip: 'Dormant items inside this radius become real dynamic physics bodies.' })
    public activationRadius = 2.4;

    @property({ tooltip: 'Settled items farther than this radius are frozen back to cheap dormant state.' })
    public freezeRadius = 3.2;

    @property({ tooltip: 'How often spatial activation/freeze checks run.' })
    public scanInterval = 0.06;

    @property({ tooltip: 'Safety cap for simultaneously simulated bodies.' })
    public maxDynamicBodies = 180;

    @property({ tooltip: 'Maximum dormant objects activated in one scan.' })
    public maxActivationsPerScan = 60;

    @property({ tooltip: 'Dynamic item must be slower than this before it can be frozen.' })
    public freezeSpeedThreshold = 0.12;

    private _timer = 0;
    private readonly _holePos = new Vec3();
    private readonly _itemPos = new Vec3();
    private readonly _nearby: ItemRuntime[] = [];
    private readonly _dynamic: ItemRuntime[] = [];
    private readonly _candidateDistance = new Map<ItemRuntime, number>();
    private readonly _candidateHeight = new Map<ItemRuntime, number>();
    private _stackController: StackController | null = null;

    protected onLoad(): void {
        if (!this.groundCollider) {
            console.error('[PhysicsActivationSystem] Ground collider is not assigned. Dynamic items may fall through the map.');
            return;
        }

        this.groundCollider.setGroup(PhysicsGroup.GROUND);
    }

    protected update(dt: number): void {
        if (!this.registry || !this.hole) {
            return;
        }

        this._timer -= dt;
        if (this._timer > 0) {
            return;
        }
        this._timer = Math.max(0.01, this.scanInterval);
        this.scan();
    }

    private scan(): void {
        this.hole!.getWorldPosition(this._holePos);
        if (!this._stackController) {
            this._stackController = this.getComponent(StackController);
        }

        this.registry!.copyDynamicTo(this._dynamic);
        const freezeRadiusSq = this.freezeRadius * this.freezeRadius;
        for (let i = 0; i < this._dynamic.length; i++) {
            const item = this._dynamic[i];
            if (!item.isDynamic) {
                continue;
            }

            item.node.getWorldPosition(this._itemPos);
            const dx = this._itemPos.x - this._holePos.x;
            const dz = this._itemPos.z - this._holePos.z;
            if ((dx * dx + dz * dz) < freezeRadiusSq) {
                continue;
            }
            if (!item.canFreeze(this.freezeSpeedThreshold)) {
                continue;
            }

            item.setDormant();
            this.registry!.markDormant(item);
        }

        let available = Math.max(0, this.maxDynamicBodies - this.registry!.dynamicCount);
        if (available <= 0) {
            return;
        }

        this.registry!.queryDormant(this._holePos, this.activationRadius, this._nearby);
        const radiusSq = this.activationRadius * this.activationRadius;
        this.sortNearbyCandidates(radiusSq);
        let activated = 0;

        for (let i = 0; i < this._nearby.length; i++) {
            if (activated >= this.maxActivationsPerScan || available <= 0) {
                break;
            }

            const item = this._nearby[i];
            if (!item.isDormant) {
                continue;
            }

            if (this._stackController && !this._stackController.canActivate(item)) {
                continue;
            }

            if (item.activateDynamic()) {
                this.registry!.markDynamic(item);
                activated++;
                available--;
            }
        }
    }

    /** Keep the physics budget on the tower under the Hole, starting at its base. */
    private sortNearbyCandidates(radiusSq: number): void {
        this._candidateDistance.clear();
        this._candidateHeight.clear();

        let writeIndex = 0;
        for (let i = 0; i < this._nearby.length; i++) {
            const item = this._nearby[i];
            if (!item.isDormant) {
                continue;
            }

            item.node.getWorldPosition(this._itemPos);
            const dx = this._itemPos.x - this._holePos.x;
            const dz = this._itemPos.z - this._holePos.z;
            const distanceSq = dx * dx + dz * dz;
            if (distanceSq > radiusSq) {
                continue;
            }

            this._candidateDistance.set(item, distanceSq);
            this._candidateHeight.set(item, this._itemPos.y);
            this._nearby[writeIndex++] = item;
        }
        this._nearby.length = writeIndex;

        this._nearby.sort((a, b) => {
            const distanceDelta = this._candidateDistance.get(a)! - this._candidateDistance.get(b)!;
            if (Math.abs(distanceDelta) > 0.0001) {
                return distanceDelta;
            }
            return this._candidateHeight.get(a)! - this._candidateHeight.get(b)!;
        });
    }
}
