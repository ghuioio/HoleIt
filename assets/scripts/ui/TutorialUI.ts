import { _decorator, Component, Node, Vec2, Vec3 } from 'cc';
import { GameEvent, gameEvents } from '../core/GameEvents';

const { ccclass, property } = _decorator;

@ccclass('TutorialUI')
export class TutorialUI extends Component {
    @property({ type: Node, tooltip: 'Root containing Move Your Hole text + pointer.' })
    public root: Node | null = null;

    @property({ type: Node, tooltip: 'Hand or pointer node to animate in infinity loop.' })
    public pointer: Node | null = null;

    @property({ type: Node, tooltip: 'Text node (e.g. Move Your Hole) to scale in and out in a loop.' })
    public textNode: Node | null = null;

    @property({ type: [Vec2], tooltip: 'List of points (waypoints) for hand movement loop. If empty, infinity shape points are auto-generated.' })
    public points: Vec2[] = [];

    @property({ tooltip: 'Infinity shape horizontal radius (width).' })
    public radiusX = 100;

    @property({ tooltip: 'Infinity shape vertical radius (height).' })
    public radiusY = 50;

    @property({ tooltip: 'Number of points to generate for infinity loop when points list is empty.' })
    public pointsCount = 36;

    @property({ tooltip: 'Loop duration in seconds for hand movement.' })
    public duration = 2.0;

    @property({ tooltip: 'Min scale factor for text pulse.' })
    public textMinScale = 0.92;

    @property({ tooltip: 'Max scale factor for text pulse.' })
    public textMaxScale = 1.08;

    @property({ tooltip: 'Pulse speed for text scale in / scale out animation loop.' })
    public textPulseSpeed = 3.0;

    private _time = 0;
    private readonly _basePos = new Vec3();
    private readonly _baseTextScale = new Vec3(1, 1, 1);
    private _runtimePoints: Vec2[] = [];

    protected onEnable(): void {
        this._time = 0;
        this.initPointerAndPoints();
        this.initTextNode();
        gameEvents.on(GameEvent.FIRST_PLAYER_INPUT, this.hide, this);
        gameEvents.on(GameEvent.GAME_STARTED, this.hide, this);
    }

    protected onDisable(): void {
        gameEvents.off(GameEvent.FIRST_PLAYER_INPUT, this.hide, this);
        gameEvents.off(GameEvent.GAME_STARTED, this.hide, this);
    }

    public initPointerAndPoints(): void {
        if (this.pointer) {
            this._basePos.set(this.pointer.position);
        }

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

    private initTextNode(): void {
        if (!this.textNode && this.root) {
            const possibleNames = ['Text', 'MoveText', 'Title', 'Label', 'tut_text', 'text'];
            for (const name of possibleNames) {
                const found = this.root.getChildByName(name);
                if (found) {
                    this.textNode = found;
                    break;
                }
            }
            if (!this.textNode && this.root.children.length > 0) {
                for (const child of this.root.children) {
                    if (child !== this.pointer) {
                        this.textNode = child;
                        break;
                    }
                }
            }
        }

        if (this.textNode) {
            this._baseTextScale.set(this.textNode.scale);
        }
    }

    protected update(dt: number): void {
        if (!this.node.active || (this.root && !this.root.active)) {
            return;
        }

        this._time += dt;

        if (this.textNode) {
            const sineVal = (Math.sin(this._time * this.textPulseSpeed) + 1) * 0.5;
            const scaleFactor = this.textMinScale + (this.textMaxScale - this.textMinScale) * sineVal;
            this.textNode.setScale(
                this._baseTextScale.x * scaleFactor,
                this._baseTextScale.y * scaleFactor,
                this._baseTextScale.z * scaleFactor
            );
        }

        if (this.pointer && this._runtimePoints.length > 0) {
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

            this.pointer.setPosition(this._basePos.x + lerpX, this._basePos.y + lerpY, this._basePos.z);
        }
    }

    public show(): void {
        if (this.root) {
            this.root.active = true;
        }
        this.node.active = true;
        this._time = 0;
        if (this.pointer) {
            this._basePos.set(this.pointer.position);
        }
        if (this.textNode) {
            this._baseTextScale.set(this.textNode.scale);
        }
    }

    public hide(): void {
        if (this.root) {
            this.root.active = false;
        } else {
            this.node.active = false;
        }
    }

    public hideImmediate(): void {
        this.hide();
    }
}


