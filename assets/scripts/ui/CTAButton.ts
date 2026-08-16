import { _decorator, Component, Tween, tween, Vec3 } from 'cc';

const { ccclass, property } = _decorator;

declare const window: any;

@ccclass('CTAButton')
export class CTAButton extends Component {
    @property({ tooltip: 'Store/landing URL. Replace before final submission if HM specifies one.' })
    public url = 'https://www.google.com/';

    @property({ tooltip: 'Enable standalone pulsing when active if not managed by EndCardController.' })
    public autoPulse = false;

    @property({ tooltip: 'Min scale factor for button pulse.' })
    public minScale = 0.94;

    @property({ tooltip: 'Max scale factor for button pulse.' })
    public maxScale = 1.08;

    @property({ tooltip: 'Duration in seconds for one half-pulse cycle.' })
    public pulseDuration = 0.55;

    private readonly _baseScale = new Vec3(1, 1, 1);
    private _pulseTween: Tween<any> | null = null;

    protected onEnable(): void {
        this._baseScale.set(
            this.node.scale.x === 0 ? 1 : this.node.scale.x,
            this.node.scale.y === 0 ? 1 : this.node.scale.y,
            this.node.scale.z === 0 ? 1 : this.node.scale.z
        );

        if (this.autoPulse) {
            this.startPulse();
        }
    }

    protected onDisable(): void {
        this.stopPulse();
    }

    public startPulse(): void {
        this.stopPulse();
        const base = this._baseScale;
        const max = new Vec3(base.x * this.maxScale, base.y * this.maxScale, base.z);
        const min = new Vec3(base.x * this.minScale, base.y * this.minScale, base.z);

        this._pulseTween = tween(this.node)
            .to(this.pulseDuration, { scale: max }, { easing: 'sineInOut' })
            .to(this.pulseDuration, { scale: min }, { easing: 'sineInOut' })
            .union()
            .repeatForever()
            .start();
    }

    public stopPulse(): void {
        if (this._pulseTween) {
            this._pulseTween.stop();
            this._pulseTween = null;
        }
        Tween.stopAllByTarget(this.node);
    }

    /** Assign this method to Button -> Click Events. */
    public openStore(): void {
        const w = typeof window !== 'undefined' ? window : null;
        if (!w) {
            return;
        }

        try {
            if (w.mraid && typeof w.mraid.open === 'function') {
                w.mraid.open(this.url);
                return;
            }
            if (w.ExitApi && typeof w.ExitApi.exit === 'function') {
                w.ExitApi.exit();
                return;
            }
            w.open(this.url, '_blank');
        } catch (error) {
            console.warn('[CTAButton] Unable to open CTA URL.', error);
        }
    }
}
