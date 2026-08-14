import { _decorator, CCFloat, CCInteger, Component } from 'cc';
import { GameEvent, gameEvents } from '../core/GameEvents';
import { HoleVisual } from './HoleVisual';

const { ccclass, property } = _decorator;

@ccclass('HoleSizeController')
export class HoleSizeController extends Component {
    @property({ type: HoleVisual })
    public visual: HoleVisual | null = null;

    @property({ type: [CCFloat], tooltip: 'Hole radius for Lv1, Lv2, ...' })
    public levelRadii: number[] = [0.75, 0.95, 1.2, 1.5];

    @property({ type: [CCInteger], tooltip: 'XP required to advance FROM each level. Last entry is ignored.' })
    public xpToNextLevel: number[] = [25, 45, 70];

    private _levelIndex = 0;
    private _xpInLevel = 0;

    public get level(): number {
        return this._levelIndex + 1;
    }

    public get radius(): number {
        if (this.levelRadii.length === 0) {
            return 1;
        }
        return this.levelRadii[Math.min(this._levelIndex, this.levelRadii.length - 1)];
    }

    public get progress01(): number {
        if (this._levelIndex >= this.levelRadii.length - 1) {
            return 1;
        }
        const required = this.getRequiredXp();
        return required <= 0 ? 1 : Math.min(1, this._xpInLevel / required);
    }

    protected start(): void {
        this.applyLevelVisual();
        this.emitProgress();
    }

    public addXp(amount: number): void {
        if (amount <= 0 || this.levelRadii.length === 0) {
            return;
        }

        this._xpInLevel += amount;
        let leveledUp = false;

        while (this._levelIndex < this.levelRadii.length - 1) {
            const required = this.getRequiredXp();
            if (required <= 0 || this._xpInLevel < required) {
                break;
            }

            this._xpInLevel -= required;
            this._levelIndex++;
            leveledUp = true;
            this.applyLevelVisual();
            gameEvents.emit(GameEvent.HOLE_LEVEL_UP, this.level, this.radius);
        }

        if (leveledUp && this._levelIndex >= this.levelRadii.length - 1) {
            this._xpInLevel = 0;
        }
        this.emitProgress();
    }

    private getRequiredXp(): number {
        if (this._levelIndex >= this.xpToNextLevel.length) {
            return 0;
        }
        return Math.max(0, this.xpToNextLevel[this._levelIndex]);
    }

    private applyLevelVisual(): void {
        if (this.visual) {
            this.visual.setRadius(this.radius);
        }
    }

    private emitProgress(): void {
        gameEvents.emit(
            GameEvent.HOLE_PROGRESS_CHANGED,
            this.level,
            this.progress01,
            this.radius,
        );
    }
}
