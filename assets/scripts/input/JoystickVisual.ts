import { _decorator, Color, Component, Graphics } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('JoystickVisual')
export class JoystickVisual extends Component {
    @property({ type: Graphics, tooltip: 'Graphics tren node JoystickRoot.' })
    public backgroundGraphics: Graphics | null = null;

    @property({ type: Graphics, tooltip: 'Graphics tren node Handle.' })
    public handleGraphics: Graphics | null = null;

    @property
    public backgroundRadius = 100;

    @property
    public handleRadius = 42;

    protected start(): void {
        this.redraw();
    }

    public redraw(): void {
        if (this.backgroundGraphics) {
            this.backgroundGraphics.clear();
            this.backgroundGraphics.fillColor = new Color(20, 20, 20, 75);
            this.backgroundGraphics.circle(0, 0, this.backgroundRadius);
            this.backgroundGraphics.fill();
        }

        if (this.handleGraphics) {
            this.handleGraphics.clear();
            this.handleGraphics.fillColor = new Color(255, 255, 255, 150);
            this.handleGraphics.circle(0, 0, this.handleRadius);
            this.handleGraphics.fill();
        }
    }
}
