import { _decorator, Component } from 'cc';
import { GameEvent, gameEvents } from '../core/GameEvents';

const { ccclass, property } = _decorator;

@ccclass('TimerController')
export class TimerController extends Component {
    @property({ tooltip: 'Playable round duration in seconds.' })
    public duration = 45;

    private _remaining = 0;
    private _running = false;

    public get remaining(): number {
        return this._remaining;
    }

    public get normalizedRemaining(): number {
        return this.duration <= 0 ? 0 : Math.max(0, Math.min(1, this._remaining / this.duration));
    }

    protected start(): void {
        this.resetCountdown();
    }

    protected update(dt: number): void {
        if (!this._running) {
            return;
        }

        this._remaining = Math.max(0, this._remaining - dt);
        gameEvents.emit(GameEvent.TIMER_CHANGED, this._remaining, this.normalizedRemaining);

        if (this._remaining <= 0) {
            this._running = false;
            gameEvents.emit(GameEvent.TIMER_EXPIRED);
        }
    }

    public resetCountdown(): void {
        this._running = false;
        this._remaining = Math.max(0, this.duration);
        gameEvents.emit(GameEvent.TIMER_CHANGED, this._remaining, this.normalizedRemaining);
    }

    public startCountdown(): void {
        if (this._remaining <= 0) {
            this._remaining = Math.max(0, this.duration);
        }
        this._running = true;
        gameEvents.emit(GameEvent.TIMER_CHANGED, this._remaining, this.normalizedRemaining);
    }

    public stopCountdown(): void {
        this._running = false;
    }
}
