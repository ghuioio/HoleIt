import {
    _decorator,
    Collider,
    Component,
    ERigidBodyType,
    PhysicsMaterial,
    RigidBody,
    Vec3,
} from 'cc';
import { PhysicsGroup } from '../physics/PhysicsGroups';

const { ccclass, property } = _decorator;
const FULL_LINEAR_FACTOR = new Vec3(1, 1, 1);
const VERTICAL_LINEAR_FACTOR = new Vec3(0, 1, 0);
const LOCKED_ANGULAR_FACTOR = new Vec3(0, 0, 0);
const ZERO_VELOCITY = new Vec3(0, 0, 0);

export enum ItemRuntimeState {
    Dormant = 0,
    Dynamic = 1,
    Vortex = 2,
    Swallowing = 3,
    Consumed = 4,
}

/**
 * Cached runtime state for one swallowable object.
 * Physics systems call these methods without doing GetComponent work in their
 * hot loops. The same component can be reset when its node is reused by a pool.
 */
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
    private _originalMaterials: Array<PhysicsMaterial | null> = [];
    private _state: ItemRuntimeState = ItemRuntimeState.Dormant;
    private _spawnId = '';
    private _spawnIndex = -1;
    private _poolKey = '';
    private _rimScale = 1;
    private _swallowElapsed = 0;
    private _swallowDuration = 0.15;
    private _baseScaleCaptured = false;
    private readonly _baseScale = new Vec3(1, 1, 1);
    private readonly _swallowStartScale = new Vec3(1, 1, 1);
    private readonly _workingScale = new Vec3();
    private readonly _velocity = new Vec3();
    private readonly _force = new Vec3();

    public get state(): ItemRuntimeState {
        return this._state;
    }

    public get id(): string {
        return this.itemId || this._spawnId || this.node.name;
    }

    public get spawnIndex(): number {
        return this._spawnIndex;
    }

    public get poolKey(): string {
        return this._poolKey;
    }

    public get isDormant(): boolean {
        return this._state === ItemRuntimeState.Dormant;
    }

    public get isDynamic(): boolean {
        return this._state === ItemRuntimeState.Dynamic;
    }

    public get isVortex(): boolean {
        return this._state === ItemRuntimeState.Vortex;
    }

    /** Backward-compatible name for the old one-stage ingestion state. */
    public get isFalling(): boolean {
        return this.isVortex;
    }

    public get isSwallowing(): boolean {
        return this._state === ItemRuntimeState.Swallowing;
    }

    public get isConsumed(): boolean {
        return this._state === ItemRuntimeState.Consumed;
    }

    protected onLoad(): void {
        this.cacheComponents();
        this.captureBaseScale();
    }

    public initialize(spawnId: string, spawnIndex: number, poolKey = ''): void {
        this.cacheComponents();
        this.captureBaseScale();

        this._spawnId = spawnId;
        this._spawnIndex = spawnIndex;
        this._poolKey = poolKey || spawnId;
        this._state = ItemRuntimeState.Dormant;
        this._rimScale = 1;
        this._swallowElapsed = 0;
        this.node.active = true;
        this.node.setScale(this._baseScale);
        this.restoreColliderMaterials();
        this.setDormantPhysics();
    }

    /** Dormant stack items render normally but cost no rigid-body simulation. */
    public setDormant(): void {
        if (this._state === ItemRuntimeState.Consumed
            || this._state === ItemRuntimeState.Swallowing
            || this._state === ItemRuntimeState.Vortex) {
            return;
        }

        this._state = ItemRuntimeState.Dormant;
        this._rimScale = 1;
        this.node.setScale(this._baseScale);
        this.restoreColliderMaterials();
        this.setDormantPhysics();
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
        this._body.linearFactor = FULL_LINEAR_FACTOR;
        this._body.angularFactor = FULL_LINEAR_FACTOR;
        this._body.setGroup(PhysicsGroup.ITEM);
        this._body.wakeUp();
        this._state = ItemRuntimeState.Dynamic;
        return true;
    }

    /**
     * Releases a tower piece with Unity FreezePositionX/Z + FreezeRotation
     * semantics. It remains in ITEM so it collides with and settles on GROUND.
     */
    public activateStackFall(): boolean {
        if (!this.activateDynamic() || !this._body) {
            return false;
        }

        this._body.useGravity = true;
        this._body.linearFactor = VERTICAL_LINEAR_FACTOR;
        this._body.angularFactor = LOCKED_ANGULAR_FACTOR;
        this._body.setLinearVelocity(ZERO_VELOCITY);
        this._body.wakeUp();
        return true;
    }

    /**
     * Commit the item to the outer vortex. FALLING_ITEM collides with neither
     * Ground nor other items, preventing rim bridges and tower traffic jams.
     */
    public beginVortex(rimScale: number, zeroFrictionMaterial: PhysicsMaterial): boolean {
        if (this._state === ItemRuntimeState.Consumed
            || this._state === ItemRuntimeState.Swallowing) {
            return false;
        }

        if (this._state === ItemRuntimeState.Dormant && !this.activateDynamic()) {
            return false;
        }
        if (!this._body) {
            return false;
        }

        this._state = ItemRuntimeState.Vortex;
        this._rimScale = Math.min(1, Math.max(0.5, rimScale));
        this._body.enabled = true;
        this._body.type = ERigidBodyType.DYNAMIC;
        this._body.useGravity = true;
        this._body.linearDamping = Math.max(this.linearDamping, 0.35);
        this._body.angularDamping = Math.max(this.angularDamping, 0.8);
        // Tower constraints end at vortex entry so the item can center itself.
        this._body.linearFactor = FULL_LINEAR_FACTOR;
        this._body.angularFactor = FULL_LINEAR_FACTOR;
        this._body.setGroup(PhysicsGroup.FALLING_ITEM);

        for (let i = 0; i < this._colliders.length; i++) {
            const collider = this._colliders[i];
            collider.enabled = true;
            collider.setGroup(PhysicsGroup.FALLING_ITEM);
            collider.sharedMaterial = zeroFrictionMaterial;
        }
        this._body.wakeUp();
        return true;
    }

    /** ForceMode.Acceleration equivalent: F = mass * desired acceleration. */
    public applyVortexAcceleration(
        directionX: number,
        directionZ: number,
        inwardAcceleration: number,
        downwardAcceleration: number,
    ): void {
        if (this._state !== ItemRuntimeState.Vortex || !this._body) {
            return;
        }

        const bodyMass = Math.max(0.01, this._body.mass);
        this._force.set(
            directionX * inwardAcceleration * bodyMass,
            -Math.abs(downwardAcceleration) * bodyMass,
            directionZ * inwardAcceleration * bodyMass,
        );
        this._body.applyForce(this._force);
        this._body.wakeUp();
    }

    public limitVortexVelocity(maxHorizontalSpeed: number, maxDownSpeed: number): void {
        if (this._state !== ItemRuntimeState.Vortex || !this._body) {
            return;
        }

        this._body.getLinearVelocity(this._velocity);
        const horizontalSq = this._velocity.x * this._velocity.x + this._velocity.z * this._velocity.z;
        const maxHorizontalSq = maxHorizontalSpeed * maxHorizontalSpeed;
        let changed = false;

        if (horizontalSq > maxHorizontalSq && horizontalSq > 0.000001) {
            const multiplier = maxHorizontalSpeed / Math.sqrt(horizontalSq);
            this._velocity.x *= multiplier;
            this._velocity.z *= multiplier;
            changed = true;
        }
        if (this._velocity.y < -maxDownSpeed) {
            this._velocity.y = -maxDownSpeed;
            changed = true;
        }
        if (changed) {
            this._body.setLinearVelocity(this._velocity);
        }
    }

    /** Inner swallow zone: immediately remove every blocking physics shape. */
    public beginSwallow(duration: number): boolean {
        if (this._state !== ItemRuntimeState.Vortex) {
            return false;
        }

        this._state = ItemRuntimeState.Swallowing;
        this._swallowElapsed = 0;
        this._swallowDuration = Math.max(0.01, duration);
        this.node.getScale(this._swallowStartScale);

        if (this._body) {
            this._body.clearVelocity();
            this._body.clearForces();
            this._body.enabled = false;
        }
        for (let i = 0; i < this._colliders.length; i++) {
            this._colliders[i].enabled = false;
        }
        return true;
    }

    /** Returns true once the scale-to-zero swallow animation has completed. */
    public tickIngestionVisual(dt: number, rimScaleSpeed: number): boolean {
        if (this._state === ItemRuntimeState.Vortex) {
            this.node.getScale(this._workingScale);
            const targetX = this._baseScale.x * this._rimScale;
            const targetY = this._baseScale.y * this._rimScale;
            const targetZ = this._baseScale.z * this._rimScale;
            const t = Math.min(1, Math.max(0, dt * rimScaleSpeed));
            this._workingScale.set(
                this._workingScale.x + (targetX - this._workingScale.x) * t,
                this._workingScale.y + (targetY - this._workingScale.y) * t,
                this._workingScale.z + (targetZ - this._workingScale.z) * t,
            );
            this.node.setScale(this._workingScale);
            return false;
        }

        if (this._state !== ItemRuntimeState.Swallowing) {
            return false;
        }

        this._swallowElapsed += dt;
        const progress = Math.min(1, this._swallowElapsed / this._swallowDuration);
        // Ease-in makes the last part disappear quickly without allocating a Tween.
        const scale = 1 - progress * progress;
        this._workingScale.set(
            this._swallowStartScale.x * scale,
            this._swallowStartScale.y * scale,
            this._swallowStartScale.z * scale,
        );
        this.node.setScale(this._workingScale);
        return progress >= 1;
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

    private cacheComponents(): void {
        if (!this._body) {
            this._body = this.getComponent(RigidBody);
        }
        if (this._colliders.length === 0) {
            this._colliders = this.getComponents(Collider);
            this._originalMaterials.length = this._colliders.length;
            for (let i = 0; i < this._colliders.length; i++) {
                this._originalMaterials[i] = this._colliders[i].sharedMaterial;
            }
        }
    }

    private captureBaseScale(): void {
        if (this._baseScaleCaptured) {
            return;
        }
        this.node.getScale(this._baseScale);
        this._baseScaleCaptured = true;
    }

    private restoreColliderMaterials(): void {
        for (let i = 0; i < this._colliders.length; i++) {
            this._colliders[i].sharedMaterial = this._originalMaterials[i] || null;
        }
    }

    private setDormantPhysics(): void {
        if (this._body) {
            this._body.type = ERigidBodyType.KINEMATIC;
            this._body.clearVelocity();
            this._body.clearForces();
            this._body.linearFactor = FULL_LINEAR_FACTOR;
            this._body.angularFactor = FULL_LINEAR_FACTOR;
            this._body.enabled = false;
        }
        for (let i = 0; i < this._colliders.length; i++) {
            this._colliders[i].enabled = false;
        }
    }
}
