import { _decorator, Canvas, Component, EventTouch, Node, UITransform, Vec2, Vec3 } from 'cc';
import { GameEvent, gameEvents } from '../core/GameEvents';

const { ccclass, property } = _decorator;

@ccclass('JoystickInput')
export class JoystickInput extends Component {
    @property({ type: Node, tooltip: 'Root to move and show for a dynamic joystick. Leave empty to use this node.' })
    public visualRoot: Node | null = null;

    @property({ type: Node, tooltip: 'Joystick handle child node.' })
    public handle: Node | null = null;

    @property({ tooltip: 'Maximum handle radius in UI pixels.' })
    public radius = 85;

    @property({ tooltip: 'Ignore tiny movement around the center.' })
    public deadZone = 0.08;

    @property({ tooltip: 'Show the joystick at the position where the player starts touching.' })
    public dynamicJoystick = true;

    private readonly _direction = new Vec2();
    private readonly _uiPos = new Vec2();
    private readonly _uiWorld = new Vec3();
    private readonly _localPos = new Vec3();
    private _touchId = -1;
    private _sentFirstInput = false;
    private _inputNode: Node | null = null;

    public getDirection(out: Vec2): Vec2 {
        out.set(this._direction.x, this._direction.y);
        return out;
    }

    protected onEnable(): void {
        // Listen on the Canvas rather than the small joystick graphic, so a drag can
        // begin anywhere on screen while the visual is hidden.
        this._inputNode = this.findInputNode();
        this._inputNode.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this._inputNode.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this._inputNode.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this._inputNode.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    protected onDisable(): void {
        this._inputNode?.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this._inputNode?.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this._inputNode?.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this._inputNode?.off(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        this._inputNode = null;
        this.resetJoystick();
    }

    protected onLoad(): void {
        this.setJoystickVisible(false);
    }

    private onTouchStart(event: EventTouch): void {
        if (this._touchId !== -1) {
            return;
        }

        const id = event.getID();
        this._touchId = id === null ? 0 : id;
        this.moveJoystickToTouch(event);
        this.setJoystickVisible(true);
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
        this.setJoystickVisible(false);
    }

    private findInputNode(): Node {
        let current: Node | null = this.node;
        while (current) {
            if (current.getComponent(Canvas)) {
                return current;
            }
            current = current.parent;
        }
        return this.node;
    }

    private moveJoystickToTouch(event: EventTouch): void {
        if (!this.dynamicJoystick) {
            return;
        }

        const root = this.visualRoot ?? this.node;
        const parentTransform = root.parent?.getComponent(UITransform);
        if (!parentTransform) {
            return;
        }

        event.getUILocation(this._uiPos);
        this._uiWorld.set(this._uiPos.x, this._uiPos.y, 0);
        parentTransform.convertToNodeSpaceAR(this._uiWorld, this._localPos);
        root.setPosition(this._localPos);
    }

    private setJoystickVisible(visible: boolean): void {
        const root = this.visualRoot ?? this.node;
        root.active = this.dynamicJoystick ? visible : true;
    }
}
