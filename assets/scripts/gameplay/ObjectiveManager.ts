import { _decorator, CCInteger, CCString, Component } from 'cc';
import { GameEvent, gameEvents } from '../core/GameEvents';

const { ccclass, property } = _decorator;

@ccclass('ObjectiveManager')
export class ObjectiveManager extends Component {
    @property({ type: [CCString], tooltip: 'LevelData item IDs to collect, e.g. obj_9.' })
    public targetIds: string[] = ['obj_9', 'obj_10', 'obj_488'];

    @property({ type: [CCInteger], tooltip: 'Required counts for targetIds at the same indexes.' })
    public targetCounts: number[] = [12, 12, 10];

    private _currentCounts: number[] = [];
    private _completed: boolean[] = [];

    public get objectiveCount(): number {
        return Math.min(this.targetIds.length, this.targetCounts.length);
    }

    protected onEnable(): void {
        gameEvents.on(GameEvent.ITEM_CONSUMED, this.onItemConsumed, this);
    }

    protected onDisable(): void {
        gameEvents.off(GameEvent.ITEM_CONSUMED, this.onItemConsumed, this);
    }

    protected start(): void {
        this.resetObjectives();
    }

    public resetObjectives(): void {
        const count = this.objectiveCount;
        this._currentCounts = new Array<number>(count);
        this._completed = new Array<boolean>(count);
        for (let i = 0; i < count; i++) {
            this._currentCounts[i] = 0;
            this._completed[i] = false;
            this.emitObjective(i);
        }
    }

    public getId(index: number): string {
        return index >= 0 && index < this.objectiveCount ? this.targetIds[index] : '';
    }

    public getCurrent(index: number): number {
        return index >= 0 && index < this._currentCounts.length ? this._currentCounts[index] : 0;
    }

    public getTarget(index: number): number {
        return index >= 0 && index < this.objectiveCount ? Math.max(0, this.targetCounts[index]) : 0;
    }

    public isComplete(index: number): boolean {
        return index >= 0 && index < this._completed.length && this._completed[index];
    }

    private onItemConsumed(id: string): void {
        const count = this.objectiveCount;
        for (let i = 0; i < count; i++) {
            if (this._completed[i] || this.targetIds[i] !== id) {
                continue;
            }

            this._currentCounts[i]++;
            const target = Math.max(0, this.targetCounts[i]);
            if (this._currentCounts[i] >= target) {
                this._currentCounts[i] = target;
                this._completed[i] = true;
                gameEvents.emit(GameEvent.OBJECTIVE_COMPLETED, i, id);
            }
            this.emitObjective(i);
        }

        if (count > 0 && this._completed.every((value) => value)) {
            gameEvents.emit(GameEvent.ALL_OBJECTIVES_COMPLETED);
        }
    }

    private emitObjective(index: number): void {
        gameEvents.emit(
            GameEvent.OBJECTIVE_CHANGED,
            index,
            this.getId(index),
            this.getCurrent(index),
            this.getTarget(index),
            this.isComplete(index),
        );
    }
}
