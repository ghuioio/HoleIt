import { _decorator, Component, Vec2, Vec3 } from 'cc';
import { GameEvent, gameEvents } from '../core/GameEvents';
import { JoystickInput } from '../input/JoystickInput';

const { ccclass, property } = _decorator;

@ccclass('HoleMovement')
export class HoleMovement extends Component {
    @property({ type: JoystickInput })
    public joystick: JoystickInput | null = null;

    @property({ tooltip: 'Maximum Hole speed in world units/second.' })
    public moveSpeed = 3.2;

    @property({ tooltip: 'Acceleration while the joystick is held.' })
    public acceleration = 11;

    @property({ tooltip: 'Deceleration after releasing the joystick.' })
    public deceleration = 16;

    @property({ tooltip: 'Enable when joystick-up visually moves the Hole down-screen.' })
    public invertZ = true;

    @property
    public minX = -8;

    @property
    public maxX = 8;

    @property
    public minZ = -8;

    @property
    public maxZ = 10;

    public inputEnabled = true;

    private readonly _input = new Vec2();
    private readonly _velocity = new Vec3();
    private readonly _position = new Vec3();

    protected onEnable(): void {
        gameEvents.on(GameEvent.GAME_WON, this.onGameEnd, this);
        gameEvents.on(GameEvent.GAME_LOST, this.onGameEnd, this);
        gameEvents.on(GameEvent.TIMER_EXPIRED, this.onGameEnd, this);
    }

    protected onDisable(): void {
        gameEvents.off(GameEvent.GAME_WON, this.onGameEnd, this);
        gameEvents.off(GameEvent.GAME_LOST, this.onGameEnd, this);
        gameEvents.off(GameEvent.TIMER_EXPIRED, this.onGameEnd, this);
    }

    public onGameEnd(): void {
        this.inputEnabled = false;
        this.stopImmediately();
    }

    public stopImmediately(): void {
        this._velocity.set(0, 0, 0);
        this._input.set(0, 0);
    }

    protected update(deltaTime: number): void {
        const dt = Math.min(deltaTime, 0.05);

        if (!this.joystick || !this.inputEnabled) {
            this._input.set(0, 0);
            this.stopImmediately();
            return;
        } else {
            this.joystick.getDirection(this._input);
        }

        const targetVX = this._input.x * this.moveSpeed;
        const zSign = this.invertZ ? -1 : 1;
        const targetVZ = this._input.y * this.moveSpeed * zSign;
        const hasInput = this._input.lengthSqr() > 0.000001;
        const maxDelta = (hasInput ? this.acceleration : this.deceleration) * dt;

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
