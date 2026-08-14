import { _decorator, AudioClip, AudioSource, Component } from 'cc';
import { GameEvent, gameEvents } from '../core/GameEvents';

const { ccclass, property } = _decorator;

@ccclass('GameAudioController')
export class GameAudioController extends Component {
    @property({ type: AudioSource })
    public bgmSource: AudioSource | null = null;

    @property({ type: AudioSource })
    public sfxSource: AudioSource | null = null;

    @property({ type: AudioClip })
    public bgmClip: AudioClip | null = null;

    @property({ type: AudioClip })
    public collectClip: AudioClip | null = null;

    @property({ type: AudioClip })
    public objectiveConsumeClip: AudioClip | null = null;

    @property({ type: AudioClip })
    public objectiveCompleteClip: AudioClip | null = null;

    @property({ type: AudioClip })
    public levelUpClip: AudioClip | null = null;

    @property({ type: AudioClip })
    public loseClip: AudioClip | null = null;

    @property({ type: AudioClip })
    public winClip: AudioClip | null = null;

    @property({ tooltip: 'Avoid firing collect SFX for every cube when many are eaten together.' })
    public collectMinInterval = 0.045;

    private _collectCooldown = 0;
    private _bgmStarted = false;

    protected onEnable(): void {
        gameEvents.on(GameEvent.FIRST_PLAYER_INPUT, this.onFirstInput, this);
        gameEvents.on(GameEvent.ITEM_CONSUMED, this.onItemConsumed, this);
        gameEvents.on(GameEvent.OBJECTIVE_COMPLETED, this.onObjectiveCompleted, this);
        gameEvents.on(GameEvent.HOLE_LEVEL_UP, this.onHoleLevelUp, this);
        gameEvents.on(GameEvent.GAME_WON, this.onGameWon, this);
        gameEvents.on(GameEvent.GAME_LOST, this.onGameLost, this);
    }

    protected onDisable(): void {
        gameEvents.off(GameEvent.FIRST_PLAYER_INPUT, this.onFirstInput, this);
        gameEvents.off(GameEvent.ITEM_CONSUMED, this.onItemConsumed, this);
        gameEvents.off(GameEvent.OBJECTIVE_COMPLETED, this.onObjectiveCompleted, this);
        gameEvents.off(GameEvent.HOLE_LEVEL_UP, this.onHoleLevelUp, this);
        gameEvents.off(GameEvent.GAME_WON, this.onGameWon, this);
        gameEvents.off(GameEvent.GAME_LOST, this.onGameLost, this);
    }

    protected update(dt: number): void {
        this._collectCooldown = Math.max(0, this._collectCooldown - dt);
    }

    private onFirstInput(): void {
        // Web audio requires a user gesture. The first joystick drag is our unlock point.
        if (this._bgmStarted || !this.bgmSource || !this.bgmClip) {
            return;
        }
        this._bgmStarted = true;
        this.bgmSource.clip = this.bgmClip;
        this.bgmSource.loop = true;
        this.bgmSource.play();
    }

    private onItemConsumed(): void {
        if (this._collectCooldown > 0) {
            return;
        }
        this._collectCooldown = Math.max(0, this.collectMinInterval);
        this.playSfx(this.collectClip, 0.7);
        this.playSfx(this.objectiveConsumeClip, 0.4);
    }

    private onObjectiveCompleted(): void {
        this.playSfx(this.objectiveCompleteClip, 1);
    }

    private onHoleLevelUp(): void {
        this.playSfx(this.levelUpClip, 1);
    }

    private onGameWon(): void {
        this.playSfx(this.winClip, 1);
    }

    private onGameLost(): void {
        this.playSfx(this.loseClip, 1);
    }

    private playSfx(clip: AudioClip | null, volume: number): void {
        if (!clip || !this.sfxSource) {
            return;
        }
        this.sfxSource.playOneShot(clip, volume);
    }
}
