import { _decorator, Color, Component, Graphics } from 'cc';
import { JoystickInput } from './JoystickInput';

const { ccclass, property } = _decorator;

@ccclass('JoystickVisual')
export class JoystickVisual extends Component {
    @property({ type: Graphics })
    public background: Graphics | null = null;

    @property({ type: Graphics })
    public handleGraphics: Graphics | null = null;

    @property
    public backgroundRadius = 90;

    @property
    public handleRadius = 38;

    protected start(): void {
        this.redraw();
        const joystickInput = this.getComponent(JoystickInput) ?? this.node.getComponentInChildren(JoystickInput);
        if (joystickInput && joystickInput.dynamicJoystick) {
            this.setVisible(false);
        }
    }

    public redraw(): void {
        if (this.background) {
            this.background.clear();
            this.background.fillColor = new Color(255, 255, 255, 55);
            this.background.circle(0, 0, this.backgroundRadius);
            this.background.fill();
        }

        if (this.handleGraphics) {
            this.handleGraphics.clear();
            this.handleGraphics.fillColor = new Color(255, 255, 255, 150);
            this.handleGraphics.circle(0, 0, this.handleRadius);
            this.handleGraphics.fill();
        }
    }

    public setVisible(visible: boolean): void {
        if (this.background) {
            this.background.enabled = visible;
        }
        if (this.handleGraphics) {
            this.handleGraphics.enabled = visible;
        }
    }
}
