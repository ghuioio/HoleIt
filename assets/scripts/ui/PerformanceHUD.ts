import { _decorator, Component, Label } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('PerformanceHUD')
export class PerformanceHUD extends Component {
    @property({ type: Label })
    public fpsLabel: Label | null = null;

    @property
    public refreshInterval = 0.5;

    private _timer = 0;
    private _frameCount = 0;

    protected update(deltaTime: number): void {
        this._timer += deltaTime;
        this._frameCount++;

        if (this._timer < this.refreshInterval) {
            return;
        }

        if (this.fpsLabel && this._timer > 0) {
            const fps = Math.round(this._frameCount / this._timer);
            this.fpsLabel.string = 'FPS: ' + fps;
        }

        this._timer = 0;
        this._frameCount = 0;
    }
}
