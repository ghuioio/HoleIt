import { _decorator, Canvas, Component, EventTouch, Graphics, Node, UIOpacity, UITransform, Vec2, Vec3 } from 'cc';
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

    @property({ tooltip: 'Show the joystick at the position where the player starts touching.' })
    public dynamicJoystick = true;

    private readonly _direction = new Vec2();
    private readonly _uiPos = new Vec2();
    private readonly _uiWorld = new Vec3();
    private readonly _localPos = new Vec3();
    private _touchId = -1;
    private _sentFirstInput = false;
    private _inputNode: Node | null = null;
    private _visualOpacity: UIOpacity | null = null;
    private _isGameOver = false;

    public getDirection(out: Vec2): Vec2 {
        if (this._isGameOver || !this.enabled) {
            out.set(0, 0);
            return out;
        }
        out.set(this._direction.x, this._direction.y);
        return out;
    }

    protected onEnable(): void {
        this._isGameOver = false;

        // Listen on the Canvas rather than the small joystick graphic, so a drag can
        // begin anywhere on screen while the visual is hidden.
        this._inputNode = this.findInputNode();
        this._inputNode.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this._inputNode.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this._inputNode.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this._inputNode.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);

        gameEvents.on(GameEvent.GAME_WON, this.onGameOver, this);
        gameEvents.on(GameEvent.GAME_LOST, this.onGameOver, this);
        gameEvents.on(GameEvent.TIMER_EXPIRED, this.onGameOver, this);

        if (this.dynamicJoystick && this._touchId === -1) {
            this.setJoystickVisible(false);
        }
    }

    protected onDisable(): void {
        this._inputNode?.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this._inputNode?.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this._inputNode?.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this._inputNode?.off(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        this._inputNode = null;

        gameEvents.off(GameEvent.GAME_WON, this.onGameOver, this);
        gameEvents.off(GameEvent.GAME_LOST, this.onGameOver, this);
        gameEvents.off(GameEvent.TIMER_EXPIRED, this.onGameOver, this);

        this.resetJoystick();
    }

    public onGameOver(): void {
        this._isGameOver = true;
        this._touchId = -1;
        this.resetJoystick();
        if (this.dynamicJoystick) {
            this.setJoystickVisible(false);
        }
    }

    protected onLoad(): void {
        // This component's node is the visible joystick center. Moving a parent
        // wrapper would keep any authored child offset (such as Joystick's
        // original bottom-left position), so move and fade this node directly.
        this._visualOpacity = this.node.getComponent(UIOpacity) ?? this.node.addComponent(UIOpacity);
        if (this.dynamicJoystick) {
            this.setJoystickVisible(false);
        }
    }

    protected start(): void {
        if (this.dynamicJoystick && this._touchId === -1) {
            this.setJoystickVisible(false);
        }
    }

    private onTouchStart(event: EventTouch): void {
        if (this._isGameOver || !this.enabled || this._touchId !== -1) {
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
        if (this._isGameOver || !this.enabled) {
            return;
        }

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

    public setDynamic(enable: boolean): void {
        this.dynamicJoystick = enable;
        if (!enable) {
            this.setJoystickVisible(true);
        } else if (this._touchId === -1) {
            this.setJoystickVisible(false);
        }
    }

    public resetJoystick(): void {
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
        

        const parentTransform = this.node.parent?.getComponent(UITransform);
        if (!parentTransform) {
            return;
        }

        event.getUILocation(this._uiPos);
        this._uiWorld.set(this._uiPos.x, this._uiPos.y, 0);
        parentTransform.convertToNodeSpaceAR(this._uiWorld, this._localPos);
        this.node.setPosition(this._localPos);
    }

    public setJoystickVisible(visible: boolean): void {
        const show = !this.dynamicJoystick || visible;

        if (!this._visualOpacity) {
            this._visualOpacity = this.node.getComponent(UIOpacity) ?? this.node.addComponent(UIOpacity);
        }
        this._visualOpacity.opacity = show ? 255 : 0;

        // Cocos Creator Graphics ignores UIOpacity, so explicitly toggle Graphics components
        const graphics = this.getComponentsInChildren(Graphics);
        for (const g of graphics) {
            g.enabled = show;
        }

        const parentGraphics = this.node.parent?.getComponents(Graphics);
        if (parentGraphics) {
            for (const g of parentGraphics) {
                g.enabled = show;
            }
        }

        if (this.handle) {
            this.handle.active = show;
        }
    }
}
