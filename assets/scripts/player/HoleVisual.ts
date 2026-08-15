import { _decorator, Component, Node, Vec3 } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('HoleVisual')
export class HoleVisual extends Component {
    @property({ type: Node, tooltip: 'Child root containing the rim/black cylinder visual. Do not assign the movement root itself.' })
    public scaleRoot: Node | null = null;

    @property({ tooltip: 'Radius represented by scaleRoot scale = 1.' })
    public baseRadius = 0.5;

    private readonly _baseScale = new Vec3(1, 1, 1);

    protected onLoad(): void {
        if (this.scaleRoot) {
            this._baseScale.set(this.scaleRoot.scale);
        }
    }

    public setRadius(radius: number): void {
        if (!this.scaleRoot || this.baseRadius <= 0) {
            return;
        }
        const scale = radius / this.baseRadius;
        this.scaleRoot.setScale(
            this._baseScale.x * scale,
            this._baseScale.y,
            this._baseScale.z * scale,
        );
    }
}
