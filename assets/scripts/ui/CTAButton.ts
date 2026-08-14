import { _decorator, Component } from 'cc';

const { ccclass, property } = _decorator;

declare const window: any;

@ccclass('CTAButton')
export class CTAButton extends Component {
    @property({ tooltip: 'Store/landing URL. Replace before final submission if HM specifies one.' })
    public url = 'https://www.google.com/';

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
