import { _decorator, Component, Label, Sprite } from 'cc';
import { GameEvent, gameEvents } from '../core/GameEvents';

const { ccclass, property } = _decorator;

@ccclass('TimerUI')
export class TimerUI extends Component {
    @property({ type: Label })
    public label: Label | null = null;

    @property({ type: Sprite, tooltip: 'Set Sprite Type=FILLED and Fill Type=HORIZONTAL in Inspector.' })
    public fill: Sprite | null = null;

    protected onEnable(): void {
        gameEvents.on(GameEvent.TIMER_CHANGED, this.onTimerChanged, this);
    }

    protected onDisable(): void {
        gameEvents.off(GameEvent.TIMER_CHANGED, this.onTimerChanged, this);
    }

    private onTimerChanged(remaining: number, normalized: number): void {
        if (this.label) {
            this.label.string = `${Math.max(0, Math.ceil(remaining))}`;
        }
        if (this.fill) {
            this.fill.fillRange = Math.max(0, Math.min(1, normalized));
        }
    }
}
