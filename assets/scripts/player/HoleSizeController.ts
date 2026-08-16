import { _decorator, CCFloat, CCInteger, Component } from 'cc';
import { GameEvent, gameEvents } from '../core/GameEvents';
import { HoleVisual } from './HoleVisual';

const { ccclass, property } = _decorator;

/** Item-count progression with a radius shared by visuals and gameplay. */
@ccclass('HoleSizeController')
export class HoleSizeController extends Component {
    @property({ type: HoleVisual })
    public visual: HoleVisual | null = null;

    @property({ type: [CCFloat], tooltip: 'Hole radius for Lv1, Lv2, ...' })
    public levelRadii: number[] = [0.32, 0.4, 0.5, 0.62];

    @property({
        type: [CCInteger],
        tooltip: 'Items required to advance FROM each level. Last entry is ignored.',
    })
    public xpToNextLevel: number[] = [25, 45, 70];

    @property({ tooltip: 'Seconds used to ease the visual and gameplay radius to its new size.' })
    public growthDuration = 0.25;

    private _levelIndex = 0;
    private _itemsInLevel = 0;
    private _totalItemsEaten = 0;
    private _currentRadius = 1;
    private _growthFrom = 1;
    private _growthTo = 1;
    private _growthElapsed = 0;
    private _isGrowing = false;

    public get level(): number {
        return this._levelIndex + 1;
    }

    /** Animated radius used by suction, ingestion, and ground fallback. */
    public get radius(): number {
        return this._currentRadius;
    }

    public get totalItemsEaten(): number {
        return this._totalItemsEaten;
    }

    public get progress01(): number {
        if (this._levelIndex >= this.levelRadii.length - 1) {
            return 1;
        }
        const required = this.getRequiredItems();
        return required <= 0 ? 1 : Math.min(1, this._itemsInLevel / required);
    }

    protected start(): void {
        this._currentRadius = this.getLevelRadius(this._levelIndex);
        this._growthFrom = this._currentRadius;
        this._growthTo = this._currentRadius;
        this.applyRadius();
        this.emitProgress();
    }

    protected update(dt: number): void {
        if (!this._isGrowing) {
            return;
        }

        this._growthElapsed += Math.max(0, dt);
        const duration = Math.max(0.01, this.growthDuration);
        const t = Math.min(1, this._growthElapsed / duration);
        const inverse = 1 - t;
        const easeOutCubic = 1 - inverse * inverse * inverse;
        this._currentRadius = this._growthFrom
            + (this._growthTo - this._growthFrom) * easeOutCubic;
        this.applyRadius();
        this.emitProgress();

        if (t >= 1) {
            this._currentRadius = this._growthTo;
            this._isGrowing = false;
            this.applyRadius();
        }
    }

    /** Called exactly once for each item that finishes the inner swallow stage. */
    public recordItemEaten(_consumeValue = 1): void {
        if (this.levelRadii.length === 0) {
            return;
        }

        this._totalItemsEaten++;
        this._itemsInLevel++;

        while (this._levelIndex < this.levelRadii.length - 1) {
            const required = this.getRequiredItems();
            if (required <= 0 || this._itemsInLevel < required) {
                break;
            }

            this._itemsInLevel -= required;
            this._levelIndex++;
            this.beginGrowth(this.getLevelRadius(this._levelIndex));
            gameEvents.emit(GameEvent.HOLE_LEVEL_UP, this.level, this._growthTo);
        }

        if (this._levelIndex >= this.levelRadii.length - 1) {
            this._itemsInLevel = 0;
        }
        this.emitProgress();
    }

    /** Backward-compatible API for existing callers. Progress is item-count based. */
    public addXp(consumeValue: number): void {
        this.recordItemEaten(consumeValue);
    }

    private beginGrowth(targetRadius: number): void {
        this._growthFrom = this._currentRadius;
        this._growthTo = Math.max(0.01, targetRadius);
        this._growthElapsed = 0;
        this._isGrowing = true;
    }

    private getRequiredItems(): number {
        if (this._levelIndex >= this.xpToNextLevel.length) {
            return 0;
        }
        return Math.max(0, Math.floor(this.xpToNextLevel[this._levelIndex]));
    }

    private getLevelRadius(index: number): number {
        if (this.levelRadii.length === 0) {
            return 1;
        }
        return Math.max(0.01, this.levelRadii[Math.min(index, this.levelRadii.length - 1)]);
    }

    private applyRadius(): void {
        this.visual?.setRadius(this._currentRadius);
    }

    private emitProgress(): void {
        gameEvents.emit(
            GameEvent.HOLE_PROGRESS_CHANGED,
            this.level,
            this.progress01,
            this._currentRadius,
        );
    }
}
