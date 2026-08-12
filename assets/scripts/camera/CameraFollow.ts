import { _decorator, Component, Node, Vec3 } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('CameraFollow')
export class CameraFollow extends Component {
    @property({ type: Node })
    public target: Node | null = null;

    @property({ type: Vec3, tooltip: 'Offset camera so voi Hole.' })
    public offset = new Vec3(0, 13, 10);

    @property({ tooltip: 'Do muot khi camera follow. 0 = dung yen.' })
    public followSharpness = 8;

    @property({ tooltip: 'Camera nhin cao hon Hole mot chut.' })
    public lookHeight = 0.2;

    private readonly _targetPos = new Vec3();
    private readonly _desiredPos = new Vec3();
    private readonly _cameraPos = new Vec3();
    private readonly _lookPos = new Vec3();

    protected lateUpdate(deltaTime: number): void {
        if (!this.target) {
            return;
        }

        this.target.getWorldPosition(this._targetPos);
        Vec3.add(this._desiredPos, this._targetPos, this.offset);
        this.node.getWorldPosition(this._cameraPos);

        const t = this.followSharpness <= 0
            ? 1
            : 1 - Math.exp(-this.followSharpness * Math.min(deltaTime, 0.05));

        Vec3.lerp(this._cameraPos, this._cameraPos, this._desiredPos, t);
        this.node.setWorldPosition(this._cameraPos);

        this._lookPos.set(this._targetPos.x, this._targetPos.y + this.lookHeight, this._targetPos.z);
        this.node.lookAt(this._lookPos);
    }
}
