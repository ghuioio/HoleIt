import { _decorator, Component, Vec2, Vec3 } from 'cc';
import { JoystickInput } from '../input/JoystickInput';

const { ccclass, property } = _decorator;

@ccclass('HoleMovement')
export class HoleMovement extends Component {
    @property({ type: JoystickInput })
    public joystick: JoystickInput | null = null;

    @property({ tooltip: 'Toc do toi da cua Hole, world units/second.' })
    public moveSpeed = 7;

    @property({ tooltip: 'Gia toc khi nguoi choi day joystick.' })
    public acceleration = 22;

    @property({ tooltip: 'Do giam toc khi tha joystick.' })
    public deceleration = 28;

    @property({ tooltip: 'Bat neu day joystick len tren ma Hole di xuong man hinh.' })
    public invertZ = true;

    @property
    public minX = -13;

    @property
    public maxX = 13;

    @property
    public minZ = -10;

    @property
    public maxZ = 10;

    private readonly _input = new Vec2();
    private readonly _velocity = new Vec3();
    private readonly _position = new Vec3();

    protected update(deltaTime: number): void {
        if (!this.joystick) {
            return;
        }

        // Tranh Hole nhay xa neu tab/browser bi tre trong mot khoang dai.
        const dt = Math.min(deltaTime, 0.05);
        this.joystick.getDirection(this._input);

        const targetVX = this._input.x * this.moveSpeed;
        const zSign = this.invertZ ? -1 : 1;
        const targetVZ = this._input.y * this.moveSpeed * zSign;

        const hasInput = Math.abs(this._input.x) > 0.001 || Math.abs(this._input.y) > 0.001;
        const changeSpeed = hasInput ? this.acceleration : this.deceleration;
        const maxDelta = changeSpeed * dt;

        this._velocity.x = this.moveTowards(this._velocity.x, targetVX, maxDelta);
        this._velocity.z = this.moveTowards(this._velocity.z, targetVZ, maxDelta);

        this._position.set(this.node.position);
        this._position.x += this._velocity.x * dt;
        this._position.z += this._velocity.z * dt;

        this._position.x = this.clamp(this._position.x, this.minX, this.maxX);
        this._position.z = this.clamp(this._position.z, this.minZ, this.maxZ);
        this.node.setPosition(this._position);
    }

    private moveTowards(current: number, target: number, maxDelta: number): number {
        const delta = target - current;
        if (Math.abs(delta) <= maxDelta) {
            return target;
        }
        return current + (delta > 0 ? maxDelta : -maxDelta);
    }

    private clamp(value: number, min: number, max: number): number {
        return Math.max(min, Math.min(max, value));
    }
}
