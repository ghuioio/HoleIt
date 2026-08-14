System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6", "__unresolved_7"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, _decorator, Component, GameEvent, gameEvents, GameState, HoleMovement, TimerController, TutorialUI, EndCardController, JoystickInput, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _temp, _crd, ccclass, property, GameFlowController;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfGameEvent(extras) {
    _reporterNs.report("GameEvent", "./GameEvents", _context.meta, extras);
  }

  function _reportPossibleCrUseOfgameEvents(extras) {
    _reporterNs.report("gameEvents", "./GameEvents", _context.meta, extras);
  }

  function _reportPossibleCrUseOfGameState(extras) {
    _reporterNs.report("GameState", "./GameState", _context.meta, extras);
  }

  function _reportPossibleCrUseOfHoleMovement(extras) {
    _reporterNs.report("HoleMovement", "../player/HoleMovement", _context.meta, extras);
  }

  function _reportPossibleCrUseOfTimerController(extras) {
    _reporterNs.report("TimerController", "../gameplay/TimerController", _context.meta, extras);
  }

  function _reportPossibleCrUseOfTutorialUI(extras) {
    _reporterNs.report("TutorialUI", "../ui/TutorialUI", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEndCardController(extras) {
    _reporterNs.report("EndCardController", "../ui/EndCardController", _context.meta, extras);
  }

  function _reportPossibleCrUseOfJoystickInput(extras) {
    _reporterNs.report("JoystickInput", "../input/JoystickInput", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      _decorator = _cc._decorator;
      Component = _cc.Component;
    }, function (_unresolved_2) {
      GameEvent = _unresolved_2.GameEvent;
      gameEvents = _unresolved_2.gameEvents;
    }, function (_unresolved_3) {
      GameState = _unresolved_3.GameState;
    }, function (_unresolved_4) {
      HoleMovement = _unresolved_4.HoleMovement;
    }, function (_unresolved_5) {
      TimerController = _unresolved_5.TimerController;
    }, function (_unresolved_6) {
      TutorialUI = _unresolved_6.TutorialUI;
    }, function (_unresolved_7) {
      EndCardController = _unresolved_7.EndCardController;
    }, function (_unresolved_8) {
      JoystickInput = _unresolved_8.JoystickInput;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "f10c1Jc71JM+YJFrusENcpg", "GameFlowController", undefined);

      ({
        ccclass,
        property
      } = _decorator);

      _export("GameFlowController", GameFlowController = (_dec = ccclass('GameFlowController'), _dec2 = property({
        type: _crd && HoleMovement === void 0 ? (_reportPossibleCrUseOfHoleMovement({
          error: Error()
        }), HoleMovement) : HoleMovement
      }), _dec3 = property({
        type: _crd && JoystickInput === void 0 ? (_reportPossibleCrUseOfJoystickInput({
          error: Error()
        }), JoystickInput) : JoystickInput
      }), _dec4 = property({
        type: _crd && TimerController === void 0 ? (_reportPossibleCrUseOfTimerController({
          error: Error()
        }), TimerController) : TimerController
      }), _dec5 = property({
        type: _crd && TutorialUI === void 0 ? (_reportPossibleCrUseOfTutorialUI({
          error: Error()
        }), TutorialUI) : TutorialUI
      }), _dec6 = property({
        type: _crd && EndCardController === void 0 ? (_reportPossibleCrUseOfEndCardController({
          error: Error()
        }), EndCardController) : EndCardController
      }), _dec(_class = (_class2 = (_temp = class GameFlowController extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "holeMovement", _descriptor, this);

          _initializerDefineProperty(this, "joystickInput", _descriptor2, this);

          _initializerDefineProperty(this, "timer", _descriptor3, this);

          _initializerDefineProperty(this, "tutorialUI", _descriptor4, this);

          _initializerDefineProperty(this, "endCard", _descriptor5, this);

          _defineProperty(this, "_state", (_crd && GameState === void 0 ? (_reportPossibleCrUseOfGameState({
            error: Error()
          }), GameState) : GameState).Boot);
        }

        get state() {
          return this._state;
        }

        onEnable() {
          (_crd && gameEvents === void 0 ? (_reportPossibleCrUseOfgameEvents({
            error: Error()
          }), gameEvents) : gameEvents).on((_crd && GameEvent === void 0 ? (_reportPossibleCrUseOfGameEvent({
            error: Error()
          }), GameEvent) : GameEvent).LEVEL_SPAWN_COMPLETE, this.onLevelSpawnComplete, this);
          (_crd && gameEvents === void 0 ? (_reportPossibleCrUseOfgameEvents({
            error: Error()
          }), gameEvents) : gameEvents).on((_crd && GameEvent === void 0 ? (_reportPossibleCrUseOfGameEvent({
            error: Error()
          }), GameEvent) : GameEvent).FIRST_PLAYER_INPUT, this.onFirstPlayerInput, this);
          (_crd && gameEvents === void 0 ? (_reportPossibleCrUseOfgameEvents({
            error: Error()
          }), gameEvents) : gameEvents).on((_crd && GameEvent === void 0 ? (_reportPossibleCrUseOfGameEvent({
            error: Error()
          }), GameEvent) : GameEvent).ALL_OBJECTIVES_COMPLETED, this.onAllObjectivesCompleted, this);
          (_crd && gameEvents === void 0 ? (_reportPossibleCrUseOfgameEvents({
            error: Error()
          }), gameEvents) : gameEvents).on((_crd && GameEvent === void 0 ? (_reportPossibleCrUseOfGameEvent({
            error: Error()
          }), GameEvent) : GameEvent).TIMER_EXPIRED, this.onTimerExpired, this);
        }

        onDisable() {
          (_crd && gameEvents === void 0 ? (_reportPossibleCrUseOfgameEvents({
            error: Error()
          }), gameEvents) : gameEvents).off((_crd && GameEvent === void 0 ? (_reportPossibleCrUseOfGameEvent({
            error: Error()
          }), GameEvent) : GameEvent).LEVEL_SPAWN_COMPLETE, this.onLevelSpawnComplete, this);
          (_crd && gameEvents === void 0 ? (_reportPossibleCrUseOfgameEvents({
            error: Error()
          }), gameEvents) : gameEvents).off((_crd && GameEvent === void 0 ? (_reportPossibleCrUseOfGameEvent({
            error: Error()
          }), GameEvent) : GameEvent).FIRST_PLAYER_INPUT, this.onFirstPlayerInput, this);
          (_crd && gameEvents === void 0 ? (_reportPossibleCrUseOfgameEvents({
            error: Error()
          }), gameEvents) : gameEvents).off((_crd && GameEvent === void 0 ? (_reportPossibleCrUseOfGameEvent({
            error: Error()
          }), GameEvent) : GameEvent).ALL_OBJECTIVES_COMPLETED, this.onAllObjectivesCompleted, this);
          (_crd && gameEvents === void 0 ? (_reportPossibleCrUseOfgameEvents({
            error: Error()
          }), gameEvents) : gameEvents).off((_crd && GameEvent === void 0 ? (_reportPossibleCrUseOfGameEvent({
            error: Error()
          }), GameEvent) : GameEvent).TIMER_EXPIRED, this.onTimerExpired, this);
        }

        start() {
          this._state = (_crd && GameState === void 0 ? (_reportPossibleCrUseOfGameState({
            error: Error()
          }), GameState) : GameState).Boot;

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

        onLevelSpawnComplete() {
          if (this._state !== (_crd && GameState === void 0 ? (_reportPossibleCrUseOfGameState({
            error: Error()
          }), GameState) : GameState).Boot) {
            return;
          }

          this._state = (_crd && GameState === void 0 ? (_reportPossibleCrUseOfGameState({
            error: Error()
          }), GameState) : GameState).Tutorial;

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

        onFirstPlayerInput() {
          if (this._state !== (_crd && GameState === void 0 ? (_reportPossibleCrUseOfGameState({
            error: Error()
          }), GameState) : GameState).Tutorial) {
            return;
          }

          this._state = (_crd && GameState === void 0 ? (_reportPossibleCrUseOfGameState({
            error: Error()
          }), GameState) : GameState).Playing;

          if (this.tutorialUI) {
            this.tutorialUI.hide();
          }

          if (this.timer) {
            this.timer.startCountdown();
          }

          (_crd && gameEvents === void 0 ? (_reportPossibleCrUseOfgameEvents({
            error: Error()
          }), gameEvents) : gameEvents).emit((_crd && GameEvent === void 0 ? (_reportPossibleCrUseOfGameEvent({
            error: Error()
          }), GameEvent) : GameEvent).GAME_STARTED);
        }

        onAllObjectivesCompleted() {
          if (this._state !== (_crd && GameState === void 0 ? (_reportPossibleCrUseOfGameState({
            error: Error()
          }), GameState) : GameState).Playing) {
            return;
          }

          this.finishWin();
        }

        onTimerExpired() {
          if (this._state !== (_crd && GameState === void 0 ? (_reportPossibleCrUseOfGameState({
            error: Error()
          }), GameState) : GameState).Playing) {
            return;
          }

          this.finishLose();
        }

        finishWin() {
          this._state = (_crd && GameState === void 0 ? (_reportPossibleCrUseOfGameState({
            error: Error()
          }), GameState) : GameState).Win;

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

          (_crd && gameEvents === void 0 ? (_reportPossibleCrUseOfgameEvents({
            error: Error()
          }), gameEvents) : gameEvents).emit((_crd && GameEvent === void 0 ? (_reportPossibleCrUseOfGameEvent({
            error: Error()
          }), GameEvent) : GameEvent).GAME_WON);
        }

        finishLose() {
          this._state = (_crd && GameState === void 0 ? (_reportPossibleCrUseOfGameState({
            error: Error()
          }), GameState) : GameState).Lose;

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

          (_crd && gameEvents === void 0 ? (_reportPossibleCrUseOfgameEvents({
            error: Error()
          }), gameEvents) : gameEvents).emit((_crd && GameEvent === void 0 ? (_reportPossibleCrUseOfGameEvent({
            error: Error()
          }), GameEvent) : GameEvent).GAME_LOST);
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "holeMovement", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "joystickInput", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "timer", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "tutorialUI", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "endCard", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=GameFlowController.js.map