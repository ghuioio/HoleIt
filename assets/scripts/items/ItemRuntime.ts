import {
    _decorator,
    Collider,
    Component,
    ERigidBodyType,
    RigidBody,
    Vec3,
} from 'cc';
import { PhysicsGroup } from '../physics/PhysicsGroups';

const { ccclass, property } = _decorator;

export enum ItemRuntimeState {
    Dormant = 0,
    Dynamic = 1,
    Falling = 2,
    Consumed = 3,
}

@ccclass('ItemRuntime')
export class ItemRuntime extends Component {
    @property({ tooltip: 'Optional override. If empty, ItemSpawner uses LevelData id.' })
    public itemId = '';

    @property({ tooltip: 'Minimum Hole level required to swallow this item.' })
    public requiredHoleLevel = 1;

    @property({ tooltip: 'XP/progress granted when this item is fully consumed.' })
    public consumeValue = 1;

    @property({ tooltip: 'Approximate horizontal radius used by HoleConsumeSystem. Tune per prefab.' })
    public consumeRadius = 0.18;

    @property({ tooltip: 'Runtime physics mass when activated.' })
    public mass = 0.7;

    @property({ tooltip: 'Linear damping while dynamic.' })
    public linearDamping = 0.12;

    @property({ tooltip: 'Angular damping while dynamic.' })
    public angularDamping = 0.08;

    private _body: RigidBody | null = null;
    private _colliders: Collider[] = [];
    private _state: ItemRuntimeState = ItemRuntimeState.Dormant;
    private _spawnId = '';
    private _spawnIndex = -1;
    private readonly _velocity = new Vec3();

    public get state(): ItemRuntimeState {
        return this._state;
    }

    public get id(): string {
        return this.itemId || this._spawnId || this.node.name;
    }

    public get spawnIndex(): number {
        return this._spawnIndex;
    }

    public get isDormant(): boolean {
        return this._state === ItemRuntimeState.Dormant;
    }

    public get isDynamic(): boolean {
        return this._state === ItemRuntimeState.Dynamic;
    }

    public get isFalling(): boolean {
        return this._state === ItemRuntimeState.Falling;
    }

    protected onLoad(): void {
        this._body = this.getComponent(RigidBody);
        this._colliders = this.getComponents(Collider);
    }

    public initialize(spawnId: string, spawnIndex: number): void {
        this._spawnId = spawnId;
        this._spawnIndex = spawnIndex;
        this.setDormant();
    }

    /**
     * Dormant items are rendered, but their physics components are disabled.
     * This is the main optimization that keeps thousands of level items cheap.
     */
    public setDormant(): void {
        if (this._state === ItemRuntimeState.Consumed) {
            return;
        }

        this._state = ItemRuntimeState.Dormant;
        if (this._body) {
            this._body.type = ERigidBodyType.KINEMATIC;
            this._body.clearVelocity();
            this._body.clearForces();
            this._body.enabled = false;
        }
        for (let i = 0; i < this._colliders.length; i++) {
            this._colliders[i].enabled = false;
        }
    }

    public activateDynamic(): boolean {
        if (this._state !== ItemRuntimeState.Dormant) {
            return false;
        }
        if (!this._body || this._colliders.length === 0) {
            return false;
        }

        for (let i = 0; i < this._colliders.length; i++) {
            this._colliders[i].enabled = true;
            this._colliders[i].setGroup(PhysicsGroup.ITEM);
        }

        this._body.enabled = true;
        this._body.type = ERigidBodyType.DYNAMIC;
        this._body.mass = Math.max(0.01, this.mass);
        this._body.useGravity = true;
        this._body.allowSleep = true;
        this._body.linearDamping = this.linearDamping;
        this._body.angularDamping = this.angularDamping;
        this._body.setGroup(PhysicsGroup.ITEM);
        this._body.wakeUp();
        this._state = ItemRuntimeState.Dynamic;
        return true;
    }

    /** Ignore Ground/Item collision while falling through the visual hole. */
    public beginFalling(initialVelocity: Vec3): void {
        if (this._state === ItemRuntimeState.Consumed) {
            return;
        }

        if (this._state === ItemRuntimeState.Dormant) {
            this.activateDynamic();
        }
        if (!this._body) {
            return;
        }

        this._state = ItemRuntimeState.Falling;
        this._body.enabled = true;
        this._body.type = ERigidBodyType.DYNAMIC;
        this._body.setGroup(PhysicsGroup.FALLING_ITEM);
        for (let i = 0; i < this._colliders.length; i++) {
            this._colliders[i].setGroup(PhysicsGroup.FALLING_ITEM);
        }
        this._body.setLinearVelocity(initialVelocity);
        this._body.wakeUp();
    }

    public setFallingVelocity(value: Vec3): void {
        if (this._state !== ItemRuntimeState.Falling || !this._body) {
            return;
        }
        this._body.setLinearVelocity(value);
    }

    public getLinearVelocity(out: Vec3): Vec3 {
        if (!this._body || !this._body.enabled) {
            out.set(0, 0, 0);
            return out;
        }
        this._body.getLinearVelocity(out);
        return out;
    }

    public markConsumed(): void {
        if (this._state === ItemRuntimeState.Consumed) {
            return;
        }
        this._state = ItemRuntimeState.Consumed;

        if (this._body) {
            this._body.clearVelocity();
            this._body.clearForces();
            this._body.enabled = false;
        }
        for (let i = 0; i < this._colliders.length; i++) {
            this._colliders[i].enabled = false;
        }
        this.node.active = false;
    }

    public canFreeze(speedThreshold: number): boolean {
        if (this._state !== ItemRuntimeState.Dynamic || !this._body) {
            return false;
        }
        this.getLinearVelocity(this._velocity);
        return this._velocity.lengthSqr() <= speedThreshold * speedThreshold;
    }
}
