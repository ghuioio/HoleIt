import { _decorator, Component, Vec3 } from 'cc';

const { ccclass } = _decorator;

export enum ItemCubeState {
    Idle,
    Consuming,
    Consumed,
}

@ccclass('ItemCube')
export class ItemCube extends Component {
    private _state = ItemCubeState.Idle;
    private _delay = 0;
    private _elapsed = 0;
    private _duration = 0.3;

    private readonly _startWorldPos = new Vec3();
    private readonly _targetWorldPos = new Vec3();
    private readonly _currentWorldPos = new Vec3();
    private readonly _startScale = new Vec3(1, 1, 1);
    private readonly _currentScale = new Vec3(1, 1, 1);

    public get state(): ItemCubeState {
        return this._state;
    }

    public get isIdle(): boolean {
        return this._state === ItemCubeState.Idle;
    }

    public prepareForUse(): void {
        this._state = ItemCubeState.Idle;
        this._delay = 0;
        this._elapsed = 0;
        this.node.active = true;
    }

    public beginConsume(targetWorldPos: Vec3, delay: number, duration: number): boolean {
        if (this._state !== ItemCubeState.Idle) {
            return false;
        }

        this._state = ItemCubeState.Consuming;
        this._delay = Math.max(0, delay);
        this._elapsed = 0;
        this._duration = Math.max(0.05, duration);

        this.node.getWorldPosition(this._startWorldPos);
        this._targetWorldPos.set(targetWorldPos);
        this._startScale.set(this.node.scale);
        return true;
    }

    /**
     * Return true khi animation an item da ket thuc.
     * Ham nay duoc ItemManager goi tap trung, khong dung update() tren 1000 ItemCube.
     */
    public tickConsume(deltaTime: number): boolean {
        if (this._state !== ItemCubeState.Consuming) {
            return false;
        }

        if (this._delay > 0) {
            this._delay -= deltaTime;
            return false;
        }

        this._elapsed += deltaTime;
        const t = Math.min(1, this._elapsed / this._duration);

        // Roi nhanh dan vao tam Hole.
        const eased = t * t * t;
        Vec3.lerp(this._currentWorldPos, this._startWorldPos, this._targetWorldPos, eased);
        this.node.setWorldPosition(this._currentWorldPos);

        // Nho lai o nua sau animation de cam giac bi hut xuong lo.
        const shrinkT = Math.max(0, (t - 0.5) / 0.5);
        const scaleFactor = 1 - shrinkT * 0.8;
        this._currentScale.set(
            this._startScale.x * scaleFactor,
            this._startScale.y * scaleFactor,
            this._startScale.z * scaleFactor,
        );
        this.node.setScale(this._currentScale);

        if (t < 1) {
            return false;
        }

        this._state = ItemCubeState.Consumed;
        this.node.active = false;
        return true;
    }
}
