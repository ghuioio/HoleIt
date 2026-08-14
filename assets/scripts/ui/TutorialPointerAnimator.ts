import { _decorator, Component, Node, Vec3 } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('TutorialPointerAnimator')
export class TutorialPointerAnimator extends Component {
    @property({ type: Node })
    public pointer: Node | null = null;

    @property({ tooltip: 'Horizontal travel in UI pixels.' })
    public amplitude = 80;

    @property({ tooltip: 'Cycles per second.' })
    public frequency = 0.8;

    private _time = 0;
    private readonly _base = new Vec3();

    protected onEnable(): void {
        this._time = 0;
        if (this.pointer) {
            this._base.set(this.pointer.position);
        }
    }

    protected update(dt: number): void {
        if (!this.pointer) {
            return;
        }
        this._time += dt;
        const x = Math.sin(this._time * Math.PI * 2 * this.frequency) * this.amplitude;
        this.pointer.setPosition(this._base.x + x, this._base.y, this._base.z);
    }
}
