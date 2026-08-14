import { _decorator, Component, Label, Sprite } from 'cc';
import { GameEvent, gameEvents } from '../core/GameEvents';

const { ccclass, property } = _decorator;

@ccclass('HoleLevelUI')
export class HoleLevelUI extends Component {
    @property({ type: Label })
    public levelLabel: Label | null = null;

    @property({ type: Sprite, tooltip: 'Set Sprite Type=FILLED in Inspector.' })
    public fill: Sprite | null = null;

    protected onEnable(): void {
        gameEvents.on(GameEvent.HOLE_PROGRESS_CHANGED, this.onProgress, this);
    }

    protected onDisable(): void {
        gameEvents.off(GameEvent.HOLE_PROGRESS_CHANGED, this.onProgress, this);
    }

    private onProgress(level: number, progress: number): void {
        if (this.levelLabel) {
            this.levelLabel.string = `Lv.${level}`;
        }
        if (this.fill) {
            this.fill.fillRange = Math.max(0, Math.min(1, progress));
        }
    }
}
