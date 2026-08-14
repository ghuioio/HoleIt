import { _decorator, Component, Node, Vec3 } from 'cc';
import { ItemRegistry } from '../items/ItemRegistry';
import { ItemRuntime } from '../items/ItemRuntime';

const { ccclass, property } = _decorator;

@ccclass('PhysicsActivationSystem')
export class PhysicsActivationSystem extends Component {
    @property({ type: ItemRegistry })
    public registry: ItemRegistry | null = null;

    @property({ type: Node })
    public hole: Node | null = null;

    @property({ tooltip: 'Dormant items inside this radius become real dynamic physics bodies.' })
    public activationRadius = 5.5;

    @property({ tooltip: 'Settled items farther than this radius are frozen back to cheap dormant state.' })
    public freezeRadius = 8.5;

    @property({ tooltip: 'How often spatial activation/freeze checks run.' })
    public scanInterval = 0.06;

    @property({ tooltip: 'Safety cap for simultaneously simulated bodies.' })
    public maxDynamicBodies = 260;

    @property({ tooltip: 'Maximum dormant objects activated in one scan.' })
    public maxActivationsPerScan = 80;

    @property({ tooltip: 'Dynamic item must be slower than this before it can be frozen.' })
    public freezeSpeedThreshold = 0.12;

    private _timer = 0;
    private readonly _holePos = new Vec3();
    private readonly _itemPos = new Vec3();
    private readonly _nearby: ItemRuntime[] = [];
    private readonly _dynamic: ItemRuntime[] = [];

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
        let activated = 0;

        for (let i = 0; i < this._nearby.length; i++) {
            if (activated >= this.maxActivationsPerScan || available <= 0) {
                break;
            }

            const item = this._nearby[i];
            if (!item.isDormant) {
                continue;
            }

            item.node.getWorldPosition(this._itemPos);
            const dx = this._itemPos.x - this._holePos.x;
            const dz = this._itemPos.z - this._holePos.z;
            if ((dx * dx + dz * dz) > radiusSq) {
                continue;
            }

            if (item.activateDynamic()) {
                this.registry!.markDynamic(item);
                activated++;
                available--;
            }
        }
    }
}
