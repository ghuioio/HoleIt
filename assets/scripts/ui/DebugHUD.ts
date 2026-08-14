import { _decorator, Component, Label } from 'cc';
import { GameEvent, gameEvents } from '../core/GameEvents';

const { ccclass, property } = _decorator;

@ccclass('DebugHUD')
export class DebugHUD extends Component {
    @property({ type: Label })
    public itemLabel: Label | null = null;

    @property({ type: Label })
    public fpsLabel: Label | null = null;

    private _time = 0;
    private _frames = 0;

    protected onEnable(): void {
        gameEvents.on(GameEvent.ITEM_COUNTS_CHANGED, this.onCountsChanged, this);
    }

    protected onDisable(): void {
        gameEvents.off(GameEvent.ITEM_COUNTS_CHANGED, this.onCountsChanged, this);
    }

    protected update(dt: number): void {
        this._time += dt;
        this._frames++;
        if (this._time >= 0.5) {
            if (this.fpsLabel) {
                this.fpsLabel.string = `FPS ${Math.round(this._frames / this._time)}`;
            }
            this._time = 0;
            this._frames = 0;
        }
    }

    private onCountsChanged(total: number, remaining: number, consumed: number, dynamic: number): void {
        if (this.itemLabel) {
            this.itemLabel.string = `Items ${total}  Left ${remaining}  Eaten ${consumed}  Physics ${dynamic}`;
        }
    }
}
