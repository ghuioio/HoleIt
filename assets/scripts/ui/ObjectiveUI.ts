import { _decorator, Component, Label, Node } from 'cc';
import { GameEvent, gameEvents } from '../core/GameEvents';
import { ObjectiveManager } from '../gameplay/ObjectiveManager';

const { ccclass, property } = _decorator;

@ccclass('ObjectiveUI')
export class ObjectiveUI extends Component {
    @property({ type: ObjectiveManager })
    public objectives: ObjectiveManager | null = null;

    @property({ type: [Label], tooltip: 'Count labels in the same order as ObjectiveManager targetIds.' })
    public countLabels: Label[] = [];

    @property({ type: [Node], tooltip: 'Tick nodes in the same order as ObjectiveManager targetIds.' })
    public tickNodes: Node[] = [];

    protected onEnable(): void {
        gameEvents.on(GameEvent.OBJECTIVE_CHANGED, this.onObjectiveChanged, this);
    }

    protected onDisable(): void {
        gameEvents.off(GameEvent.OBJECTIVE_CHANGED, this.onObjectiveChanged, this);
    }

    protected start(): void {
        this.refreshAll();
    }

    private refreshAll(): void {
        if (!this.objectives) {
            return;
        }
        for (let i = 0; i < this.objectives.objectiveCount; i++) {
            this.apply(
                i,
                this.objectives.getCurrent(i),
                this.objectives.getTarget(i),
                this.objectives.isComplete(i),
            );
        }
    }

    private onObjectiveChanged(
        index: number,
        _id: string,
        current: number,
        target: number,
        complete: boolean,
    ): void {
        this.apply(index, current, target, complete);
    }

    private apply(index: number, current: number, target: number, complete: boolean): void {
        if (index < this.countLabels.length && this.countLabels[index]) {
            this.countLabels[index].string = `${current}/${target}`;
        }
        if (index < this.tickNodes.length && this.tickNodes[index]) {
            this.tickNodes[index].active = complete;
        }
    }
}
