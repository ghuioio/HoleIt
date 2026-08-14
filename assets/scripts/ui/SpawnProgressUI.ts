import { _decorator, Component, Label, Node } from 'cc';
import { GameEvent, gameEvents } from '../core/GameEvents';

const { ccclass, property } = _decorator;

@ccclass('SpawnProgressUI')
export class SpawnProgressUI extends Component {
    @property({ type: Node })
    public root: Node | null = null;

    @property({ type: Label })
    public label: Label | null = null;

    protected onEnable(): void {
        gameEvents.on(GameEvent.LEVEL_SPAWN_PROGRESS, this.onProgress, this);
        gameEvents.on(GameEvent.LEVEL_SPAWN_COMPLETE, this.onComplete, this);
    }

    protected onDisable(): void {
        gameEvents.off(GameEvent.LEVEL_SPAWN_PROGRESS, this.onProgress, this);
        gameEvents.off(GameEvent.LEVEL_SPAWN_COMPLETE, this.onComplete, this);
    }

    protected start(): void {
        if (this.root) {
            this.root.active = true;
        }
    }

    private onProgress(current: number, total: number): void {
        if (this.label) {
            this.label.string = `Loading ${current}/${total}`;
        }
    }

    private onComplete(): void {
        if (this.root) {
            this.root.active = false;
        }
    }
}
