import {
    _decorator,
    Collider,
    Component,
    ERigidBodyType,
    MeshRenderer,
    PhysicsMaterial,
    RigidBody,
    Vec3,
} from 'cc';
import { PhysicsGroup } from '../physics/PhysicsGroups';

const { ccclass, property } = _decorator;
const FULL_LINEAR_FACTOR = new Vec3(1, 1, 1);
const VERTICAL_LINEAR_FACTOR = new Vec3(0, 1, 0);
const SETTLING_LINEAR_FACTOR = new Vec3(0.18, 1, 0.18);
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
    private _renderers: MeshRenderer[] = [];
    private _originalMaterials: Array<PhysicsMaterial | null> = [];
    private _state: ItemRuntimeState = ItemRuntimeState.Dormant;
    private _spawnId = '';
    private _spawnIndex = -1;
    private _poolKey = '';
    private _rimScale = 1;
    private _groundIgnored = false;
    private _groundRecoveryApplied = false;
    private _stackConstrained = false;
    private _vortexMaterial: PhysicsMaterial | null = null;
    private _swallowElapsed = 0;
    private _swallowDuration = 0.15;
    private _baseScaleCaptured = false;
    private readonly _baseScale = new Vec3(1, 1, 1);
    private readonly _swallowStartScale = new Vec3(1, 1, 1);
    private readonly _workingScale = new Vec3();
    private readonly _velocity = new Vec3();
    private readonly _force = new Vec3();
    private readonly _worldPosition = new Vec3();

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

    public get isStackConstrained(): boolean {
        return this._stackConstrained;
    }

    protected onLoad(): void {
        this.cacheComponents();
        this.captureBaseScale();
    }

    public initialize(spawnId: string, spawnIndex: number, poolKey = ''): void {
        this.cacheComponents();
        this.cacheRenderers();
        this.captureBaseScale();

        this._spawnId = spawnId;
        this._spawnIndex = spawnIndex;
        this._poolKey = poolKey || spawnId;
        this._state = ItemRuntimeState.Dormant;
        this._rimScale = 1;
        this._groundIgnored = false;
        this._groundRecoveryApplied = false;
        this._stackConstrained = false;
        this._vortexMaterial = null;
        this._swallowElapsed = 0;
        this.node.active = true;
        this.node.setScale(this._baseScale);
        this.restoreColliderMaterials();
        this.setDormantPhysics();
        // PhysicsActivationSystem reveals only camera-nearby dormant items.
        // Starting hidden prevents the full level from drawing during spawn.
        this.setRenderVisible(false);
    }

    /** Dormant items cost no rigid-body simulation; visibility is managed separately. */
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

        this.setRenderVisible(true);

        for (let i = 0; i < this._colliders.length; i++) {
            this._colliders[i].enabled = true;
            this._colliders[i].setGroup(PhysicsGroup.ITEM);
        }

        this._body.enabled = true;
        this._body.type = ERigidBodyType.DYNAMIC;
        this._body.mass = Math.max(0.01, this.mass);
        this._body.useGravity = true;
        // Cannon/PhysX CCD prevents fast cascade pieces tunnelling through the
        // ground between simulation steps.
        this._body.useCCD = true;
        this._body.allowSleep = true;
        this._body.linearDamping = this.linearDamping;
        this._body.angularDamping = this.angularDamping;
        this._body.sleepThreshold = 0.1;
        this._body.linearFactor = FULL_LINEAR_FACTOR;
        this._body.angularFactor = FULL_LINEAR_FACTOR;
        this._body.setGroup(PhysicsGroup.ITEM);
        this._body.wakeUp();
        this._state = ItemRuntimeState.Dynamic;
        this._groundRecoveryApplied = false;
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
        this._body.sleepThreshold = 0.35;
        this._body.linearFactor = VERTICAL_LINEAR_FACTOR;
        this._body.angularFactor = LOCKED_ANGULAR_FACTOR;
        this._body.setLinearVelocity(ZERO_VELOCITY);
        this._body.wakeUp();
        this._stackConstrained = true;
        return true;
    }

    /**
     * Enter the outer vortex. Ground collision remains active until
     * HoleConsumeSystem confirms this piece is horizontally over the Hole.
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
        this._vortexMaterial = zeroFrictionMaterial;
        this._groundIgnored = false;
        this._groundRecoveryApplied = false;
        this._stackConstrained = false;
        // Tower constraints end at vortex entry so the item can center/tumble.
        this._body.linearFactor = FULL_LINEAR_FACTOR;
        this._body.angularFactor = FULL_LINEAR_FACTOR;
        this._body.setGroup(PhysicsGroup.ITEM);

        for (let i = 0; i < this._colliders.length; i++) {
            const collider = this._colliders[i];
            collider.enabled = true;
            collider.setGroup(PhysicsGroup.ITEM);
        }
        this.restoreColliderMaterials();
        this._body.wakeUp();
        return true;
    }

    /**
     * Cocos collision-group equivalent of per-piece Physics.IgnoreCollision.
     * Only a piece currently over the Hole is moved to FALLING_ITEM.
     */
    public setGroundCollisionIgnored(ignore: boolean): void {
        if (this._state !== ItemRuntimeState.Vortex || !this._body
            || this._groundIgnored === ignore) {
            return;
        }

        this._groundIgnored = ignore;
        const group = ignore ? PhysicsGroup.FALLING_ITEM : PhysicsGroup.ITEM;
        this._body.setGroup(group);
        // Cocos 3.4 Cannon CCD raycasts with the shape's original filter rather
        // than the runtime body group. Leaving CCD enabled over the opening
        // therefore still detects the ground and pins every item on the rim.
        // Disable it only for the short, ground-ignored part of the vortex;
        // restore it immediately when the Hole moves away.
        this._body.useCCD = !ignore;
        this._body.linearFactor = FULL_LINEAR_FACTOR;
        this._body.angularFactor = FULL_LINEAR_FACTOR;

        for (let i = 0; i < this._colliders.length; i++) {
            const collider = this._colliders[i];
            collider.setGroup(group);
            collider.sharedMaterial = ignore && this._vortexMaterial
                ? this._vortexMaterial
                : this._originalMaterials[i] || null;
        }
        this._body.wakeUp();
    }

    /** Restore normal ground physics when the moving Hole leaves this piece. */
    public exitVortexToGround(minimumCenterY: number): void {
        if (this._state !== ItemRuntimeState.Vortex || !this._body) {
            return;
        }

        this.setGroundCollisionIgnored(false);
        this._state = ItemRuntimeState.Dynamic;
        this._rimScale = 1;
        this._vortexMaterial = null;
        this._stackConstrained = false;
        this.node.setScale(this._baseScale);
        this._body.linearDamping = Math.max(this.linearDamping, 0.65);
        this._body.angularDamping = Math.max(this.angularDamping, 0.7);
        this._body.linearFactor = FULL_LINEAR_FACTOR;
        this._body.angularFactor = FULL_LINEAR_FACTOR;
        this.dampenHorizontalVelocity(0.12);
        this.ensureAboveGround(minimumCenterY);
        this._body.wakeUp();
    }

    /** Let a landed collapsed piece settle locally on the solid ground. */
    public releaseStackConstraints(): void {
        if (this._state !== ItemRuntimeState.Dynamic || !this._body
            || !this._stackConstrained) {
            return;
        }

        this._stackConstrained = false;
        // Let landed pieces form a compact pile without the solver launching
        // the whole column sideways as overlapping bodies settle.
        this._body.linearDamping = Math.max(this.linearDamping, 0.72);
        this._body.angularDamping = Math.max(this.angularDamping, 0.78);
        this._body.linearFactor = SETTLING_LINEAR_FACTOR;
        this._body.angularFactor = FULL_LINEAR_FACTOR;
        this.dampenHorizontalVelocity(0.08);
        this._body.wakeUp();
    }

    private dampenHorizontalVelocity(multiplier: number): void {
        if (!this._body) {
            return;
        }
        this._body.getLinearVelocity(this._velocity);
        this._velocity.x *= multiplier;
        this._velocity.z *= multiplier;
        this._body.setLinearVelocity(this._velocity);
    }

    /**
     * Computes the item-center Y that places the lowest enabled collider just
     * above the ground. worldBounds supports both BoxCollider and
     * SphereCollider and also accounts for prefab scale/collider center.
     */
    public getGroundMinimumCenterY(groundSurfaceY: number, safetyOffset: number): number {
        this.node.getWorldPosition(this._worldPosition);
        let centerClearance = Math.max(0.01, this.consumeRadius);

        for (let i = 0; i < this._colliders.length; i++) {
            const collider = this._colliders[i];
            if (!collider.enabled) {
                continue;
            }

            const bounds = collider.worldBounds;
            const colliderBottom = bounds.center.y - bounds.halfExtents.y;
            centerClearance = Math.max(centerClearance, this._worldPosition.y - colliderBottom);
        }

        return groundSurfaceY + centerClearance + Math.max(0, safetyOffset);
    }

    /** Last-resort recovery for a body that crossed the ground before regrouping. */
    public ensureAboveGround(minimumCenterY: number): void {
        if (this._state !== ItemRuntimeState.Dynamic || !this._body) {
            return;
        }

        this.node.getWorldPosition(this._worldPosition);
        if (this._worldPosition.y >= minimumCenterY) {
            this._groundRecoveryApplied = false;
            return;
        }

        // This is intentionally repeatable. A solver step may push a body
        // below the surface again, so a one-shot recovery flag is unsafe.
        this._groundRecoveryApplied = true;
        this._worldPosition.y = minimumCenterY;
        this.node.setWorldPosition(this._worldPosition);
        this._body.getLinearVelocity(this._velocity);
        if (this._velocity.y < 0) {
            this._velocity.y = 0;
            this._body.setLinearVelocity(this._velocity);
        }
        this._body.setGroup(PhysicsGroup.ITEM);
        for (let i = 0; i < this._colliders.length; i++) {
            this._colliders[i].enabled = true;
            this._colliders[i].setGroup(PhysicsGroup.ITEM);
        }
        this.restoreColliderMaterials();
        this._body.wakeUp();
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
        this._groundIgnored = true;
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

    /** Toggle visuals without removing the item from gameplay or spatial data. */
    public setRenderVisible(visible: boolean): void {
        this.cacheRenderers();
        for (let i = 0; i < this._renderers.length; i++) {
            if (this._renderers[i].enabled !== visible) {
                this._renderers[i].enabled = visible;
            }
        }
    }

    public markConsumed(): void {
        if (this._state === ItemRuntimeState.Consumed) {
            return;
        }
        this._state = ItemRuntimeState.Consumed;
        this._groundIgnored = false;
        this._groundRecoveryApplied = false;
        this._stackConstrained = false;

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

    private cacheRenderers(): void {
        if (this._renderers.length === 0) {
            this._renderers = this.node.getComponentsInChildren(MeshRenderer);
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
        this._groundIgnored = false;
        this._groundRecoveryApplied = false;
        this._stackConstrained = false;
        for (let i = 0; i < this._colliders.length; i++) {
            this._colliders[i].enabled = false;
        }
    }
}
