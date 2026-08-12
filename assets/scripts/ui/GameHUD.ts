import { _decorator, Component, Label } from 'cc';
import { ItemManager } from '../items/ItemManager';

const { ccclass, property } = _decorator;

@ccclass('GameHUD')
export class GameHUD extends Component {
    @property({ type: ItemManager })
    public itemManager: ItemManager | null = null;

    @property({ type: Label })
    public renderedLabel: Label | null = null;

    @property({ type: Label })
    public activeLabel: Label | null = null;

    @property({ type: Label })
    public eatenLabel: Label | null = null;

    @property({ tooltip: 'UI khong can cap nhat 60 lan/giay.' })
    public refreshInterval = 0.1;

    private _timer = 0;

    protected update(deltaTime: number): void {
        this._timer += deltaTime;
        if (this._timer < this.refreshInterval) {
            return;
        }
        this._timer = 0;

        if (!this.itemManager) {
            return;
        }

        if (this.renderedLabel) {
            this.renderedLabel.string = 'Items rendered: ' + this.itemManager.totalSpawned;
        }

        if (this.activeLabel) {
            this.activeLabel.string = 'Active: ' + this.itemManager.activeCount;
        }

        if (this.eatenLabel) {
            this.eatenLabel.string = 'Eaten: ' + this.itemManager.eatenCount;
        }
    }
}
