import { _decorator, Component, Node } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('TutorialUI')
export class TutorialUI extends Component {
    @property({ type: Node, tooltip: 'Root containing Move Your Hole text + pointer.' })
    public root: Node | null = null;

    public show(): void {
        if (this.root) {
            this.root.active = true;
        }
    }

    public hide(): void {
        if (this.root) {
            this.root.active = false;
        }
    }

    public hideImmediate(): void {
        this.hide();
    }
}
