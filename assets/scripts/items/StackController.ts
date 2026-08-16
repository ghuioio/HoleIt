import { _decorator, Component, Vec3 } from 'cc';
import { ItemRegistry } from './ItemRegistry';
import { ItemRuntime } from './ItemRuntime';

const { ccclass, property } = _decorator;

interface StackEntry {
    item: ItemRuntime;
    x: number;
    y: number;
    z: number;
}

interface TowerStack {
    /** Always ordered bottom-to-top; index 0 is the current base piece. */
    pieces: ItemRuntime[];
    collapsed: boolean;
    /** Pieces admitted to the rolling physics window for this tower. */
    released: Set<ItemRuntime>;
}

/**
 * Builds ordered vertical towers after level spawning. Towers stay dormant
 * until their base enters the Hole, then a bounded rolling window is released
 * with Y-only constrained physics.
 */
@ccclass('StackController')
export class StackController extends Component {
    @property({ tooltip: 'World-space X/Z tolerance used to identify one vertical column.' })
    public columnTolerance = 0.035;

    @property({ tooltip: 'Maximum live/settled collapse pieces retained per tower at once.' })
    public maxReleasedPiecesPerTower = 24;

    private _registry: ItemRegistry | null = null;
    private readonly _entries: StackEntry[] = [];
    private readonly _towerByItem = new Map<ItemRuntime, TowerStack>();
    private readonly _fallingPieces: ItemRuntime[] = [];
    private readonly _worldPos = new Vec3();
    private _claimedTower: TowerStack | null = null;
    private _ready = false;

    public get isReady(): boolean {
        return this._ready;
    }

    public configure(registry: ItemRegistry): void {
        this._registry = registry;
    }

    public resetStacks(): void {
        this._entries.length = 0;
        this._towerByItem.clear();
        this._fallingPieces.length = 0;
        this._claimedTower = null;
        this._ready = false;
    }

    public register(item: ItemRuntime): void {
        item.node.getWorldPosition(this._worldPos);
        this._entries.push({
            item,
            x: this._worldPos.x,
            y: this._worldPos.y,
            z: this._worldPos.z,
        });
    }

    public finalizeStacks(): void {
        const columns = new Map<string, StackEntry[]>();
        const tolerance = Math.max(0.005, this.columnTolerance);

        for (let i = 0; i < this._entries.length; i++) {
            const entry = this._entries[i];
            const key = `${Math.round(entry.x / tolerance)}|${Math.round(entry.z / tolerance)}`;
            let column = columns.get(key);
            if (!column) {
                column = [];
                columns.set(key, column);
            }
            column.push(entry);
        }

        columns.forEach((column) => {
            if (column.length < 2) {
                return;
            }

            column.sort((a, b) => a.y - b.y);
            const tower: TowerStack = {
                pieces: [],
                collapsed: false,
                released: new Set<ItemRuntime>(),
            };
            for (let i = 0; i < column.length; i++) {
                const piece = column[i].item;
                tower.pieces.push(piece);
                this._towerByItem.set(piece, tower);
            }
        });

        this._ready = true;
        this._entries.length = 0;
    }

    /**
     * Before collapse, only index 0 (the bottom piece) can activate. After
     * collapse, only pieces admitted to the rolling window may activate.
     */
    public canActivate(item: ItemRuntime): boolean {
        if (!this._ready) {
            return false;
        }

        const tower = this._towerByItem.get(item);
        if (!tower) {
            return true;
        }
        if (tower.collapsed) {
            return tower.released.has(item);
        }
        return (!this._claimedTower || this._claimedTower === tower)
            && tower.pieces[0] === item;
    }

    public isCollapsedTowerPiece(item: ItemRuntime): boolean {
        const tower = this._towerByItem.get(item);
        return !!tower && tower.collapsed && tower.released.has(item);
    }

    /** Activate an item while preserving collapsed-tower tracking. */
    public activateItem(item: ItemRuntime): boolean {
        const tower = this._towerByItem.get(item);
        let claimedNow = false;
        if (tower && !tower.collapsed) {
            if ((this._claimedTower && this._claimedTower !== tower)
                || tower.pieces[0] !== item) {
                return false;
            }
            if (!this._claimedTower) {
                this._claimedTower = tower;
                claimedNow = true;
            }
        }

        const collapsedPiece = this.isCollapsedTowerPiece(item);
        const activated = collapsedPiece
            ? item.activateStackFall()
            : item.activateDynamic();
        if (!activated && claimedNow) {
            this._claimedTower = null;
        }
        if (activated && collapsedPiece) {
            this.trackFallingPiece(item);
        }
        return activated;
    }

    /**
     * Cocos update-loop equivalent of Unity FixedUpdate ground protection.
     * Only released tower pieces are visited, avoiding work on thousands of
     * dormant items. Once the Hole is no longer below a piece, constraints are
     * released and the real collider height is used for the hard floor clamp.
     */
    public updateFallingPieces(
        holePosition: Vec3,
        holeRadius: number,
        groundSurfaceY: number,
        safetyOffset: number,
    ): void {
        const radiusSq = holeRadius * holeRadius;

        for (let i = this._fallingPieces.length - 1; i >= 0; i--) {
            const piece = this._fallingPieces[i];
            if (!piece.node.active || piece.isConsumed || piece.isSwallowing) {
                this._fallingPieces.splice(i, 1);
                continue;
            }
            if (piece.isVortex) {
                // HoleConsumeSystem owns reversible ground-ignore while a
                // piece is committed to the vortex.
                continue;
            }
            if (!piece.isDynamic) {
                this._fallingPieces.splice(i, 1);
                continue;
            }

            piece.node.getWorldPosition(this._worldPos);
            const dx = this._worldPos.x - holePosition.x;
            const dz = this._worldPos.z - holePosition.z;
            const isDirectlyOverHole = dx * dx + dz * dz <= radiusSq;
            if (isDirectlyOverHole) {
                continue;
            }

            const minimumCenterY = piece.getGroundMinimumCenterY(
                groundSurfaceY,
                safetyOffset,
            );
            // Keep airborne pieces aligned with their source column. Unlock a
            // small amount of horizontal settling only after they land.
            if (this._worldPos.y > minimumCenterY + 0.04) {
                continue;
            }
            piece.ensureAboveGround(minimumCenterY);
            piece.releaseStackConstraints();
        }

        this.updateTowerClaim(holePosition, holeRadius);
    }

    /**
     * Remove an entering piece and advance the tower's rolling release window.
     * Released bodies stay in ITEM so they collide with the solid ground.
     */
    public onItemEnteredSwallow(item: ItemRuntime): void {
        if (!this._registry) {
            return;
        }

        const tower = this._towerByItem.get(item);
        if (!tower) {
            return;
        }

        const index = tower.pieces.indexOf(item);
        if (index < 0) {
            return;
        }

        tower.pieces.splice(index, 1);
        tower.released.delete(item);
        this._towerByItem.delete(item);
        this.untrackFallingPiece(item);
        if (!tower.collapsed && index !== 0) {
            return;
        }

        if (!tower.collapsed) {
            tower.collapsed = true;
        }
        this.refillReleasedPieces(tower);
        if (tower.pieces.length === 0 && this._claimedTower === tower) {
            this._claimedTower = null;
        }
    }

    /**
     * A collapsed tower advances through a small rolling window instead of
     * enabling hundreds of rigid bodies in the same frame. Every swallowed
     * piece opens one slot for the next-highest dormant piece.
     */
    private refillReleasedPieces(tower: TowerStack): void {
        const limit = Math.max(1, this.maxReleasedPiecesPerTower);
        let releasedCount = tower.released.size;

        for (let i = 0; i < tower.pieces.length; i++) {
            if (releasedCount >= limit) {
                break;
            }

            const piece = tower.pieces[i];
            if (tower.released.has(piece) || !piece.isDormant) {
                continue;
            }

            if (piece.activateStackFall()) {
                this._registry.markDynamic(piece);
                tower.released.add(piece);
                this.trackFallingPiece(piece);
                releasedCount++;
            }
        }
    }

    /** Allow a different tower once the Hole has clearly left this collapse. */
    private updateTowerClaim(holePosition: Vec3, holeRadius: number): void {
        const tower = this._claimedTower;
        if (!tower) {
            return;
        }

        if (!tower.collapsed) {
            const base = tower.pieces[0];
            if (!base || !base.node.active || base.isConsumed) {
                this._claimedTower = null;
                return;
            }
            if (base.isVortex) {
                return;
            }
            base.node.getWorldPosition(this._worldPos);
            const dx = this._worldPos.x - holePosition.x;
            const dz = this._worldPos.z - holePosition.z;
            const releaseRadius = holeRadius + 0.45;
            if (dx * dx + dz * dz > releaseRadius * releaseRadius) {
                this._claimedTower = null;
            }
            return;
        }

        const releaseRadius = holeRadius + 0.3;
        const releaseRadiusSq = releaseRadius * releaseRadius;
        for (const piece of tower.released) {
            if (!piece.node.active || piece.isConsumed) {
                continue;
            }
            piece.node.getWorldPosition(this._worldPos);
            const dx = this._worldPos.x - holePosition.x;
            const dz = this._worldPos.z - holePosition.z;
            if (dx * dx + dz * dz <= releaseRadiusSq) {
                return;
            }
        }
        this._claimedTower = null;
    }

    private trackFallingPiece(item: ItemRuntime): void {
        if (this._fallingPieces.indexOf(item) < 0) {
            this._fallingPieces.push(item);
        }
    }

    private untrackFallingPiece(item: ItemRuntime): void {
        const index = this._fallingPieces.indexOf(item);
        if (index >= 0) {
            this._fallingPieces.splice(index, 1);
        }
    }
}
