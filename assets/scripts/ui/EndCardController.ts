import { _decorator, Component, Node, Tween, tween, UIOpacity, Vec3 } from 'cc';
import { GameEvent, gameEvents } from '../core/GameEvents';

const { ccclass, property } = _decorator;

interface PopContentItem {
    node: Node;
    baseScale: Vec3;
}

@ccclass('EndCardController')
export class EndCardController extends Component {
    @property({ type: Node, tooltip: 'Win endcard root node' })
    public winRoot: Node | null = null;

    @property({ type: Node, tooltip: 'Lose endcard root node' })
    public loseRoot: Node | null = null;

    @property({ type: Node, tooltip: 'Optional explicit Black overlay node. If unset, automatically searches inside active root.' })
    public blackNode: Node | null = null;

    @property({ type: Node, tooltip: 'Optional explicit Icon node. If unset, automatically searches inside active root.' })
    public iconNode: Node | null = null;

    @property({ type: Node, tooltip: 'Optional explicit BtnCTA node. If unset, automatically searches inside active root.' })
    public btnCtaNode: Node | null = null;

    @property({ tooltip: 'Duration in seconds for black overlay fade-in.' })
    public blackFadeDuration = 0.45;

    @property({ tooltip: 'Target opacity for black background (0 - 255).' })
    public blackTargetOpacity = 220;

    @property({ tooltip: 'Duration in seconds for icon and CTA button pop-in.' })
    public contentPopDuration = 0.4;

    @property({ tooltip: 'Min scale factor for CTA button pulse loop.' })
    public ctaMinScale = 0.94;

    @property({ tooltip: 'Max scale factor for CTA button pulse loop.' })
    public ctaMaxScale = 1.08;

    @property({ tooltip: 'Duration in seconds for one half-pulse cycle.' })
    public ctaPulseDuration = 0.55;

    @property({ tooltip: 'Automatically trigger EndCard on game events (GAME_WON, GAME_LOST, TIMER_EXPIRED).' })
    public autoListenEvents = true;

    private _activeRoot: Node | null = null;
    private _activeBlack: Node | null = null;
    private _activeCta: Node | null = null;
    private _popItems: PopContentItem[] = [];

    private readonly _ctaBaseScale = new Vec3(1, 1, 1);

    private _blackTween: Tween<UIOpacity> | null = null;
    private _popTweens: Tween<Node>[] = [];
    private _ctaLoopTween: Tween<Node> | null = null;

    protected onEnable(): void {
        if (this.autoListenEvents) {
            gameEvents.on(GameEvent.GAME_WON, this.showWin, this);
            gameEvents.on(GameEvent.GAME_LOST, this.showLose, this);
            gameEvents.on(GameEvent.TIMER_EXPIRED, this.showLose, this);
        }
    }

    protected onDisable(): void {
        if (this.autoListenEvents) {
            gameEvents.off(GameEvent.GAME_WON, this.showWin, this);
            gameEvents.off(GameEvent.GAME_LOST, this.showLose, this);
            gameEvents.off(GameEvent.TIMER_EXPIRED, this.showLose, this);
        }
        this.stopAllTweens();
    }

    public hideAll(): void {
        this.stopAllTweens();
        if (this.winRoot) {
            this.winRoot.active = false;
        }
        if (this.loseRoot) {
            this.loseRoot.active = false;
        }
    }

    public showWin(): void {
        const root = this.winRoot || this.node;
        this.playEndCardSequence(root, this.loseRoot);
    }

    public showLose(): void {
        const root = this.loseRoot || this.node;
        this.playEndCardSequence(root, this.winRoot);
    }

    public playEndCardSequence(targetRoot: Node, otherRoot?: Node | null): void {
        if (!targetRoot) {
            return;
        }

        this.stopAllTweens();

        if (otherRoot) {
            otherRoot.active = false;
        }

        this.node.active = true;
        targetRoot.active = true;
        this._activeRoot = targetRoot;

        // 1. Resolve Black overlay (searches targetRoot, manual blackNode, or parent EndCard)
        this._activeBlack =
            this.blackNode ||
            this.findDescendant(targetRoot, 'Black', 'black', 'Bg', 'bg', 'overlay', 'dark', 'mask') ||
            (this.node !== targetRoot ? this.findDescendant(this.node, 'Black', 'black', 'Bg', 'bg', 'overlay') : null);

        // 2. Resolve CTA Button
        this._activeCta =
            this.btnCtaNode ||
            this.findDescendant(targetRoot, 'BtnCTA', 'btnCTA', 'BtnCta', 'btn_cta', 'CTA', 'PlayNow', 'play_now', 'Button', 'btn');

        if (this._activeCta) {
            this._ctaBaseScale.set(
                this._activeCta.scale.x === 0 ? 1 : this._activeCta.scale.x,
                this._activeCta.scale.y === 0 ? 1 : this._activeCta.scale.y,
                this._activeCta.scale.z === 0 ? 1 : this._activeCta.scale.z
            );
        }

        // 3. Resolve Content Pop Items (Icon, Logo, Win/Lose visuals, CTA)
        this._popItems = [];
        const contentNodes: Node[] = [];

        if (this.iconNode) {
            contentNodes.push(this.iconNode);
        } else {
            // Find all direct/meaningful content children under targetRoot (excluding black)
            for (const child of targetRoot.children) {
                if (child !== this._activeBlack) {
                    contentNodes.push(child);
                }
            }
        }

        // Ensure CTA is included if not already in contentNodes
        if (this._activeCta && !contentNodes.includes(this._activeCta)) {
            contentNodes.push(this._activeCta);
        }

        // Initialize scales to 0 and record base scales
        for (const node of contentNodes) {
            if (node === this._activeBlack) {
                continue;
            }
            const baseScale = new Vec3(
                node.scale.x === 0 ? 1 : node.scale.x,
                node.scale.y === 0 ? 1 : node.scale.y,
                node.scale.z === 0 ? 1 : node.scale.z
            );
            this._popItems.push({ node, baseScale });
            node.setScale(0, 0, 0);
            node.active = false;
        }

        // Step 1: Fade in Black overlay
        if (this._activeBlack) {
            this._activeBlack.active = true;
            let opacityComp = this._activeBlack.getComponent(UIOpacity);
            if (!opacityComp) {
                opacityComp = this._activeBlack.addComponent(UIOpacity);
            }
            opacityComp.opacity = 0;

            this._blackTween = tween(opacityComp)
                .to(this.blackFadeDuration, { opacity: this.blackTargetOpacity }, { easing: 'quadOut' })
                .call(() => {
                    this.showContentAndPulse();
                })
                .start();
        } else {
            this.showContentAndPulse();
        }
    }

    /**
     * Step 2 & 3: Pop in all content elements with bounce animation, then start loop scale in/out on BtnCTA.
     */
    private showContentAndPulse(): void {
        for (const item of this._popItems) {
            item.node.active = true;
            item.node.setScale(0, 0, 0);

            const isCta = item.node === this._activeCta;
            const popTween = tween(item.node)
                .to(this.contentPopDuration, { scale: item.baseScale }, { easing: 'backOut' })
                .call(() => {
                    if (isCta) {
                        this.startCtaLoopPulse();
                    }
                })
                .start();

            this._popTweens.push(popTween);
        }

        // If CTA wasn't in pop items for any reason, ensure it still pulses
        if (this._activeCta && this._popItems.every((it) => it.node !== this._activeCta)) {
            this._activeCta.active = true;
            this.startCtaLoopPulse();
        }
    }

    private startCtaLoopPulse(): void {
        if (!this._activeCta || !this._activeCta.isValid) {
            return;
        }

        const base = this._ctaBaseScale;
        const maxScale = new Vec3(base.x * this.ctaMaxScale, base.y * this.ctaMaxScale, base.z);
        const minScale = new Vec3(base.x * this.ctaMinScale, base.y * this.ctaMinScale, base.z);

        this._ctaLoopTween = tween(this._activeCta)
            .to(this.ctaPulseDuration, { scale: maxScale }, { easing: 'sineInOut' })
            .to(this.ctaPulseDuration, { scale: minScale }, { easing: 'sineInOut' })
            .union()
            .repeatForever()
            .start();
    }

    private stopAllTweens(): void {
        if (this._blackTween) {
            this._blackTween.stop();
            this._blackTween = null;
        }

        for (const t of this._popTweens) {
            t.stop();
        }
        this._popTweens = [];

        if (this._ctaLoopTween) {
            this._ctaLoopTween.stop();
            this._ctaLoopTween = null;
        }

        if (this._activeBlack) {
            Tween.stopAllByTarget(this._activeBlack);
            const op = this._activeBlack.getComponent(UIOpacity);
            if (op) {
                Tween.stopAllByTarget(op);
            }
        }

        for (const item of this._popItems) {
            if (item.node && item.node.isValid) {
                Tween.stopAllByTarget(item.node);
            }
        }

        if (this._activeCta && this._activeCta.isValid) {
            Tween.stopAllByTarget(this._activeCta);
        }
    }

    private findDescendant(root: Node | null, ...names: string[]): Node | null {
        if (!root) {
            return null;
        }
        for (const name of names) {
            const child = root.getChildByName(name);
            if (child) {
                return child;
            }
        }
        const lowerNames = names.map((n) => n.toLowerCase());
        for (const child of root.children) {
            if (lowerNames.includes(child.name.toLowerCase())) {
                return child;
            }
            const deepFound = this.findDescendant(child, ...names);
            if (deepFound) {
                return deepFound;
            }
        }
        return null;
    }
}

