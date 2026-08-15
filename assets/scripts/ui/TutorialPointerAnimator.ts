import { _decorator, Component, Node, Vec2, Vec3 } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('TutorialPointerAnimator')
export class TutorialPointerAnimator extends Component {
    @property({ type: Node, tooltip: 'Pointer/hand node to animate.' })
    public pointer: Node | null = null;

    @property({ type: [Vec2], tooltip: 'List of points (waypoints) for hand movement loop. If empty, infinity shape points are auto-generated.' })
    public points: Vec2[] = [];

    @property({ tooltip: 'Infinity shape horizontal radius (width).' })
    public radiusX = 100;

    @property({ tooltip: 'Infinity shape vertical radius (height).' })
    public radiusY = 50;

    @property({ tooltip: 'Number of generated points for infinity loop when points list is empty.' })
    public pointsCount = 36;

    @property({ tooltip: 'Loop duration in seconds.' })
    public duration = 2.0;

    private _time = 0;
    private readonly _base = new Vec3();
    private _runtimePoints: Vec2[] = [];

    protected onEnable(): void {
        this._time = 0;
        const target = this.pointer || this.node;
        this._base.set(target.position);

        this._runtimePoints = [];
        if (this.points && this.points.length > 0) {
            for (let i = 0; i < this.points.length; i++) {
                this._runtimePoints.push(new Vec2(this.points[i].x, this.points[i].y));
            }
        } else {
            const count = Math.max(8, this.pointsCount);
            for (let i = 0; i < count; i++) {
                const t = (i / count) * Math.PI * 2;
                const x = this.radiusX * Math.sin(t);
                const y = this.radiusY * Math.sin(2 * t);
                this._runtimePoints.push(new Vec2(x, y));
            }
        }
    }

    protected update(dt: number): void {
        const target = this.pointer || this.node;
        if (!target || this._runtimePoints.length === 0) {
            return;
        }

        this._time += dt;
        const progress = (this._time / Math.max(0.1, this.duration)) % 1.0;
        const count = this._runtimePoints.length;
        const exactIndex = progress * count;
        const idxA = Math.floor(exactIndex) % count;
        const idxB = (idxA + 1) % count;
        const tFrac = exactIndex - Math.floor(exactIndex);

        const pA = this._runtimePoints[idxA];
        const pB = this._runtimePoints[idxB];

        const lerpX = pA.x + (pB.x - pA.x) * tFrac;
        const lerpY = pA.y + (pB.y - pA.y) * tFrac;

        target.setPosition(this._base.x + lerpX, this._base.y + lerpY, this._base.z);
    }
}

