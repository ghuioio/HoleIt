import { _decorator, Component } from 'cc';
import { GameEvent, gameEvents } from './GameEvents';
import { GameState } from './GameState';
import { HoleMovement } from '../player/HoleMovement';
import { TimerController } from '../gameplay/TimerController';
import { TutorialUI } from '../ui/TutorialUI';
import { EndCardController } from '../ui/EndCardController';
import { JoystickInput } from '../input/JoystickInput';

const { ccclass, property } = _decorator;

@ccclass('GameFlowController')
export class GameFlowController extends Component {
    @property({ type: HoleMovement })
    public holeMovement: HoleMovement | null = null;

    @property({ type: JoystickInput })
    public joystickInput: JoystickInput | null = null;

    @property({ type: TimerController })
    public timer: TimerController | null = null;

    @property({ type: TutorialUI })
    public tutorialUI: TutorialUI | null = null;

    @property({ type: EndCardController })
    public endCard: EndCardController | null = null;

    private _state: GameState = GameState.Boot;

    public get state(): GameState {
        return this._state;
    }

    protected onEnable(): void {
        gameEvents.on(GameEvent.LEVEL_SPAWN_COMPLETE, this.onLevelSpawnComplete, this);
        gameEvents.on(GameEvent.FIRST_PLAYER_INPUT, this.onFirstPlayerInput, this);
        gameEvents.on(GameEvent.ALL_OBJECTIVES_COMPLETED, this.onAllObjectivesCompleted, this);
        gameEvents.on(GameEvent.TIMER_EXPIRED, this.onTimerExpired, this);
    }

    protected onDisable(): void {
        gameEvents.off(GameEvent.LEVEL_SPAWN_COMPLETE, this.onLevelSpawnComplete, this);
        gameEvents.off(GameEvent.FIRST_PLAYER_INPUT, this.onFirstPlayerInput, this);
        gameEvents.off(GameEvent.ALL_OBJECTIVES_COMPLETED, this.onAllObjectivesCompleted, this);
        gameEvents.off(GameEvent.TIMER_EXPIRED, this.onTimerExpired, this);
    }

    protected start(): void {
        this._state = GameState.Boot;
        if (this.holeMovement) {
            this.holeMovement.inputEnabled = false;
        }
        if (this.joystickInput) {
            this.joystickInput.enabled = false;
        }
        if (this.tutorialUI) {
            this.tutorialUI.hideImmediate();
        }
        if (this.endCard) {
            this.endCard.hideAll();
        }
    }

    private onLevelSpawnComplete(): void {
        if (this._state !== GameState.Boot) {
            return;
        }

        this._state = GameState.Tutorial;
        if (this.holeMovement) {
            this.holeMovement.inputEnabled = true;
        }
        if (this.joystickInput) {
            this.joystickInput.enabled = true;
        }
        if (this.tutorialUI) {
            this.tutorialUI.show();
        }
    }

    private onFirstPlayerInput(): void {
        if (this._state !== GameState.Tutorial) {
            return;
        }

        this._state = GameState.Playing;
        if (this.tutorialUI) {
            this.tutorialUI.hide();
        }
        if (this.timer) {
            this.timer.startCountdown();
        }
        gameEvents.emit(GameEvent.GAME_STARTED);
    }

    private onAllObjectivesCompleted(): void {
        if (this._state !== GameState.Playing) {
            return;
        }
        this.finishWin();
    }

    private onTimerExpired(): void {
        if (this._state !== GameState.Playing) {
            return;
        }
        this.finishLose();
    }

    private finishWin(): void {
        this._state = GameState.Win;
        if (this.timer) {
            this.timer.stopCountdown();
        }
        if (this.holeMovement) {
            this.holeMovement.inputEnabled = false;
            this.holeMovement.stopImmediately();
        }
        if (this.joystickInput) {
            this.joystickInput.enabled = false;
        }
        if (this.endCard) {
            this.endCard.showWin();
        }
        gameEvents.emit(GameEvent.GAME_WON);
    }

    private finishLose(): void {
        this._state = GameState.Lose;
        if (this.timer) {
            this.timer.stopCountdown();
        }
        if (this.holeMovement) {
            this.holeMovement.inputEnabled = false;
            this.holeMovement.stopImmediately();
        }
        if (this.joystickInput) {
            this.joystickInput.enabled = false;
        }
        if (this.endCard) {
            this.endCard.showLose();
        }
        gameEvents.emit(GameEvent.GAME_LOST);
    }
}
