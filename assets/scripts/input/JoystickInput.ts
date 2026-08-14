import { _decorator, Component, EventTouch, Node, UITransform, Vec2, Vec3 } from 'cc';
import { GameEvent, gameEvents } from '../core/GameEvents';

const { ccclass, property } = _decorator;

@ccclass('JoystickInput')
export class JoystickInput extends Component {
    @property({ type: Node, tooltip: 'Joystick handle child node.' })
    public handle: Node | null = null;

    @property({ tooltip: 'Maximum handle radius in UI pixels.' })
    public radius = 85;

    @property({ tooltip: 'Ignore tiny movement around the center.' })
    public deadZone = 0.08;

    private readonly _direction = new Vec2();
    private readonly _uiPos = new Vec2();
    private readonly _uiWorld = new Vec3();
    private readonly _localPos = new Vec3();
    private _touchId = -1;
    private _sentFirstInput = false;

    public getDirection(out: Vec2): Vec2 {
        out.set(this._direction.x, this._direction.y);
        return out;
    }

    protected onEnable(): void {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    protected onDisable(): void {
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        this.resetJoystick();
    }

    private onTouchStart(event: EventTouch): void {
        if (this._touchId !== -1) {
            return;
        }

        const id = event.getID();
        this._touchId = id === null ? 0 : id;
        this.updateFromTouch(event);
        this.trySendFirstInput();
        event.propagationStopped = true;
    }

    private onTouchMove(event: EventTouch): void {
        const id = event.getID();
        const currentId = id === null ? 0 : id;
        if (currentId !== this._touchId) {
            return;
        }

        this.updateFromTouch(event);
        this.trySendFirstInput();
        event.propagationStopped = true;
    }

    private onTouchEnd(event: EventTouch): void {
        const id = event.getID();
        const currentId = id === null ? 0 : id;
        if (currentId !== this._touchId) {
            return;
        }

        this._touchId = -1;
        this.resetJoystick();
        event.propagationStopped = true;
    }

    private updateFromTouch(event: EventTouch): void {
        const uiTransform = this.getComponent(UITransform);
        if (!uiTransform) {
            return;
        }

        event.getUILocation(this._uiPos);
        this._uiWorld.set(this._uiPos.x, this._uiPos.y, 0);
        uiTransform.convertToNodeSpaceAR(this._uiWorld, this._localPos);

        let x = this._localPos.x;
        let y = this._localPos.y;
        const length = Math.sqrt(x * x + y * y);

        if (length > this.radius && length > 0.0001) {
            const scale = this.radius / length;
            x *= scale;
            y *= scale;
        }

        if (this.handle) {
            this.handle.setPosition(x, y, 0);
        }

        const normalizedX = this.radius > 0 ? x / this.radius : 0;
        const normalizedY = this.radius > 0 ? y / this.radius : 0;
        const normalizedLength = Math.sqrt(normalizedX * normalizedX + normalizedY * normalizedY);

        if (normalizedLength < this.deadZone) {
            this._direction.set(0, 0);
            return;
        }

        const invLength = normalizedLength > 1 ? 1 / normalizedLength : 1;
        this._direction.set(normalizedX * invLength, normalizedY * invLength);
    }

    private trySendFirstInput(): void {
        if (this._sentFirstInput) {
            return;
        }
        if (this._direction.lengthSqr() <= this.deadZone * this.deadZone) {
            return;
        }
        this._sentFirstInput = true;
        gameEvents.emit(GameEvent.FIRST_PLAYER_INPUT);
    }

    private resetJoystick(): void {
        this._direction.set(0, 0);
        if (this.handle) {
            this.handle.setPosition(0, 0, 0);
        }
    }
}
