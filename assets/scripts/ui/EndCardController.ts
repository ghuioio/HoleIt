import { _decorator, Component, Node } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('EndCardController')
export class EndCardController extends Component {
    @property({ type: Node })
    public winRoot: Node | null = null;

    @property({ type: Node })
    public loseRoot: Node | null = null;

    public hideAll(): void {
        if (this.winRoot) {
            this.winRoot.active = false;
        }
        if (this.loseRoot) {
            this.loseRoot.active = false;
        }
    }

    public showWin(): void {
        this.hideAll();
        if (this.winRoot) {
            this.winRoot.active = true;
        }
    }

    public showLose(): void {
        this.hideAll();
        if (this.loseRoot) {
            this.loseRoot.active = true;
        }
    }
}
