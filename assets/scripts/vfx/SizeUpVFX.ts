import { _decorator, Component, Sprite, SpriteFrame } from 'cc';
import { GameEvent, gameEvents } from '../core/GameEvents';

const { ccclass, property } = _decorator;

@ccclass('SizeUpVFX')
export class SizeUpVFX extends Component {
    @property({ type: Sprite })
    public sprite: Sprite | null = null;

    @property({ type: [SpriteFrame], tooltip: 'Assign vfx_sizeup_00000 ... 00022 in order.' })
    public frames: SpriteFrame[] = [];

    @property({ tooltip: 'Frames per second.' })
    public fps = 24;

    private _playing = false;
    private _time = 0;
    private _frame = 0;

    protected onEnable(): void {
        gameEvents.on(GameEvent.HOLE_LEVEL_UP, this.play, this);
    }

    protected onDisable(): void {
        gameEvents.off(GameEvent.HOLE_LEVEL_UP, this.play, this);
    }

    protected start(): void {
        if (this.sprite) {
            this.sprite.node.active = false;
        }
    }

    protected update(dt: number): void {
        if (!this._playing || !this.sprite || this.frames.length === 0) {
            return;
        }

        this._time += dt;
        const frameDuration = 1 / Math.max(1, this.fps);
        while (this._time >= frameDuration) {
            this._time -= frameDuration;
            this._frame++;
            if (this._frame >= this.frames.length) {
                this._playing = false;
                this.sprite.node.active = false;
                return;
            }
            this.sprite.spriteFrame = this.frames[this._frame];
        }
    }

    public play(): void {
        if (!this.sprite || this.frames.length === 0) {
            return;
        }
        this._time = 0;
        this._frame = 0;
        this._playing = true;
        this.sprite.spriteFrame = this.frames[0];
        this.sprite.node.active = true;
    }
}
