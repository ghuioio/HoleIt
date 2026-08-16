import { _decorator, Component, find, Node } from 'cc';
import { JoystickInput } from './JoystickInput';

const { ccclass, property } = _decorator;

/**
 * DynamicJoystickController
 * Attach this script to any GameObject (UI panel, trigger button, game manager, etc.)
 * to activate/deactivate the joystick and control dynamic hide/show behavior.
 */
@ccclass('DynamicJoystickController')
export class DynamicJoystickController extends Component {
    @property({ type: JoystickInput, tooltip: 'Target JoystickInput component to control.' })
    public joystickInput: JoystickInput | null = null;

    @property({ type: Node, tooltip: 'Target joystick Node for active/inactive state. If omitted, joystickInput.node is used.' })
    public joystickNode: Node | null = null;

    @property({ tooltip: 'Enable dynamic joystick mode (spawns at touch position and hides when released).' })
    public dynamicJoystick = true;

    @property({ tooltip: 'Whether the joystick GameObject should be active on start.' })
    public activeOnStart = true;

    @property({ tooltip: 'Whether input handling should be enabled on start.' })
    public enableOnStart = true;

    protected onLoad(): void {
        this.resolveReferences();
    }

    protected start(): void {
        this.resolveReferences();
        this.setActive(this.activeOnStart);
        this.setInputEnabled(this.enableOnStart);
        this.setDynamic(this.dynamicJoystick);
        if (this.dynamicJoystick) {
            this.hide();
        }
    }

    private resolveReferences(): void {
        if (!this.joystickInput && this.joystickNode) {
            this.joystickInput = this.joystickNode.getComponent(JoystickInput) ?? this.joystickNode.getComponentInChildren(JoystickInput);
        }
        if (this.joystickInput && !this.joystickNode) {
            this.joystickNode = this.joystickInput.node;
        }
        if (!this.joystickInput && !this.joystickNode) {
            const found = find('Canvas/Joystick') || find('Canvas/JoystickRoot/Joystick') || find('Canvas/JoystickRoot') || find('JoystickRoot') || find('Joystick');
            if (found) {
                this.joystickInput = found.getComponent(JoystickInput) ?? found.getComponentInChildren(JoystickInput);
                this.joystickNode = this.joystickInput ? this.joystickInput.node : found;
            }
        }
    }

    /**
     * Set the active state of the joystick GameObject.
     * @param active true to activate, false to deactivate.
     */
    public setActive(active: boolean): void {
        this.resolveReferences();
        if (this.joystickNode) {
            this.joystickNode.active = active;
        }
        if (!active && this.joystickInput) {
            this.joystickInput.resetJoystick();
        }
    }

    /**
     * Activate the joystick GameObject.
     */
    public activate(): void {
        this.setActive(true);
    }

    /**
     * Deactivate the joystick GameObject.
     */
    public deactivate(): void {
        this.setActive(false);
    }

    /**
     * Toggle the active state of the joystick GameObject.
     */
    public toggleActive(): void {
        const current = this.joystickNode ? this.joystickNode.active : false;
        this.setActive(!current);
    }

    /**
     * Enable or disable the JoystickInput component.
     */
    public setInputEnabled(enabled: boolean): void {
        this.resolveReferences();
        if (this.joystickInput) {
            this.joystickInput.enabled = enabled;
        }
    }

    /**
     * Enable or disable dynamic joystick behavior.
     * When true: Joystick appears at touch position and hides when released.
     * When false: Joystick stays fixed at its authored position.
     */
    public setDynamic(dynamic: boolean): void {
        this.dynamicJoystick = dynamic;
        this.resolveReferences();
        if (this.joystickInput) {
            this.joystickInput.setDynamic(dynamic);
        }
    }

    /**
     * Toggle dynamic joystick mode.
     */
    public toggleDynamic(): void {
        this.setDynamic(!this.dynamicJoystick);
    }

    /**
     * Explicitly show the joystick visual.
     */
    public show(): void {
        this.resolveReferences();
        if (this.joystickInput) {
            this.joystickInput.setJoystickVisible(true);
        }
    }

    /**
     * Explicitly hide the joystick visual.
     */
    public hide(): void {
        this.resolveReferences();
        if (this.joystickInput) {
            this.joystickInput.setJoystickVisible(false);
        }
    }

    /**
     * Reset the joystick handle to center and reset input state.
     */
    public resetJoystick(): void {
        this.resolveReferences();
        if (this.joystickInput) {
            this.joystickInput.resetJoystick();
        }
    }
}
