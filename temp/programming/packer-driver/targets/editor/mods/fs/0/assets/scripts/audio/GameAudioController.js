System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, _decorator, AudioClip, AudioSource, Component, GameEvent, gameEvents, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _temp, _crd, ccclass, property, GameAudioController;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfGameEvent(extras) {
    _reporterNs.report("GameEvent", "../core/GameEvents", _context.meta, extras);
  }

  function _reportPossibleCrUseOfgameEvents(extras) {
    _reporterNs.report("gameEvents", "../core/GameEvents", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      _decorator = _cc._decorator;
      AudioClip = _cc.AudioClip;
      AudioSource = _cc.AudioSource;
      Component = _cc.Component;
    }, function (_unresolved_2) {
      GameEvent = _unresolved_2.GameEvent;
      gameEvents = _unresolved_2.gameEvents;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "c0f7a7jK5NLhLGDtCZs55KB", "GameAudioController", undefined);

      ({
        ccclass,
        property
      } = _decorator);

      _export("GameAudioController", GameAudioController = (_dec = ccclass('GameAudioController'), _dec2 = property({
        type: AudioSource
      }), _dec3 = property({
        type: AudioSource
      }), _dec4 = property({
        type: AudioClip
      }), _dec5 = property({
        type: AudioClip
      }), _dec6 = property({
        type: AudioClip
      }), _dec7 = property({
        type: AudioClip
      }), _dec8 = property({
        type: AudioClip
      }), _dec9 = property({
        type: AudioClip
      }), _dec10 = property({
        type: AudioClip
      }), _dec11 = property({
        tooltip: 'Avoid firing collect SFX for every cube when many are eaten together.'
      }), _dec(_class = (_class2 = (_temp = class GameAudioController extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "bgmSource", _descriptor, this);

          _initializerDefineProperty(this, "sfxSource", _descriptor2, this);

          _initializerDefineProperty(this, "bgmClip", _descriptor3, this);

          _initializerDefineProperty(this, "collectClip", _descriptor4, this);

          _initializerDefineProperty(this, "objectiveConsumeClip", _descriptor5, this);

          _initializerDefineProperty(this, "objectiveCompleteClip", _descriptor6, this);

          _initializerDefineProperty(this, "levelUpClip", _descriptor7, this);

          _initializerDefineProperty(this, "loseClip", _descriptor8, this);

          _initializerDefineProperty(this, "winClip", _descriptor9, this);

          _initializerDefineProperty(this, "collectMinInterval", _descriptor10, this);

          _defineProperty(this, "_collectCooldown", 0);

          _defineProperty(this, "_bgmStarted", false);
        }

        onEnable() {
          (_crd && gameEvents === void 0 ? (_reportPossibleCrUseOfgameEvents({
            error: Error()
          }), gameEvents) : gameEvents).on((_crd && GameEvent === void 0 ? (_reportPossibleCrUseOfGameEvent({
            error: Error()
          }), GameEvent) : GameEvent).FIRST_PLAYER_INPUT, this.onFirstInput, this);
          (_crd && gameEvents === void 0 ? (_reportPossibleCrUseOfgameEvents({
            error: Error()
          }), gameEvents) : gameEvents).on((_crd && GameEvent === void 0 ? (_reportPossibleCrUseOfGameEvent({
            error: Error()
          }), GameEvent) : GameEvent).ITEM_CONSUMED, this.onItemConsumed, this);
          (_crd && gameEvents === void 0 ? (_reportPossibleCrUseOfgameEvents({
            error: Error()
          }), gameEvents) : gameEvents).on((_crd && GameEvent === void 0 ? (_reportPossibleCrUseOfGameEvent({
            error: Error()
          }), GameEvent) : GameEvent).OBJECTIVE_COMPLETED, this.onObjectiveCompleted, this);
          (_crd && gameEvents === void 0 ? (_reportPossibleCrUseOfgameEvents({
            error: Error()
          }), gameEvents) : gameEvents).on((_crd && GameEvent === void 0 ? (_reportPossibleCrUseOfGameEvent({
            error: Error()
          }), GameEvent) : GameEvent).HOLE_LEVEL_UP, this.onHoleLevelUp, this);
          (_crd && gameEvents === void 0 ? (_reportPossibleCrUseOfgameEvents({
            error: Error()
          }), gameEvents) : gameEvents).on((_crd && GameEvent === void 0 ? (_reportPossibleCrUseOfGameEvent({
            error: Error()
          }), GameEvent) : GameEvent).GAME_WON, this.onGameWon, this);
          (_crd && gameEvents === void 0 ? (_reportPossibleCrUseOfgameEvents({
            error: Error()
          }), gameEvents) : gameEvents).on((_crd && GameEvent === void 0 ? (_reportPossibleCrUseOfGameEvent({
            error: Error()
          }), GameEvent) : GameEvent).GAME_LOST, this.onGameLost, this);
        }

        onDisable() {
          (_crd && gameEvents === void 0 ? (_reportPossibleCrUseOfgameEvents({
            error: Error()
          }), gameEvents) : gameEvents).off((_crd && GameEvent === void 0 ? (_reportPossibleCrUseOfGameEvent({
            error: Error()
          }), GameEvent) : GameEvent).FIRST_PLAYER_INPUT, this.onFirstInput, this);
          (_crd && gameEvents === void 0 ? (_reportPossibleCrUseOfgameEvents({
            error: Error()
          }), gameEvents) : gameEvents).off((_crd && GameEvent === void 0 ? (_reportPossibleCrUseOfGameEvent({
            error: Error()
          }), GameEvent) : GameEvent).ITEM_CONSUMED, this.onItemConsumed, this);
          (_crd && gameEvents === void 0 ? (_reportPossibleCrUseOfgameEvents({
            error: Error()
          }), gameEvents) : gameEvents).off((_crd && GameEvent === void 0 ? (_reportPossibleCrUseOfGameEvent({
            error: Error()
          }), GameEvent) : GameEvent).OBJECTIVE_COMPLETED, this.onObjectiveCompleted, this);
          (_crd && gameEvents === void 0 ? (_reportPossibleCrUseOfgameEvents({
            error: Error()
          }), gameEvents) : gameEvents).off((_crd && GameEvent === void 0 ? (_reportPossibleCrUseOfGameEvent({
            error: Error()
          }), GameEvent) : GameEvent).HOLE_LEVEL_UP, this.onHoleLevelUp, this);
          (_crd && gameEvents === void 0 ? (_reportPossibleCrUseOfgameEvents({
            error: Error()
          }), gameEvents) : gameEvents).off((_crd && GameEvent === void 0 ? (_reportPossibleCrUseOfGameEvent({
            error: Error()
          }), GameEvent) : GameEvent).GAME_WON, this.onGameWon, this);
          (_crd && gameEvents === void 0 ? (_reportPossibleCrUseOfgameEvents({
            error: Error()
          }), gameEvents) : gameEvents).off((_crd && GameEvent === void 0 ? (_reportPossibleCrUseOfGameEvent({
            error: Error()
          }), GameEvent) : GameEvent).GAME_LOST, this.onGameLost, this);
        }

        update(dt) {
          this._collectCooldown = Math.max(0, this._collectCooldown - dt);
        }

        onFirstInput() {
          // Web audio requires a user gesture. The first joystick drag is our unlock point.
          if (this._bgmStarted || !this.bgmSource || !this.bgmClip) {
            return;
          }

          this._bgmStarted = true;
          this.bgmSource.clip = this.bgmClip;
          this.bgmSource.loop = true;
          this.bgmSource.play();
        }

        onItemConsumed() {
          if (this._collectCooldown > 0) {
            return;
          }

          this._collectCooldown = Math.max(0, this.collectMinInterval);
          this.playSfx(this.collectClip, 0.7);
          this.playSfx(this.objectiveConsumeClip, 0.4);
        }

        onObjectiveCompleted() {
          this.playSfx(this.objectiveCompleteClip, 1);
        }

        onHoleLevelUp() {
          this.playSfx(this.levelUpClip, 1);
        }

        onGameWon() {
          this.playSfx(this.winClip, 1);
        }

        onGameLost() {
          this.playSfx(this.loseClip, 1);
        }

        playSfx(clip, volume) {
          if (!clip || !this.sfxSource) {
            return;
          }

          this.sfxSource.playOneShot(clip, volume);
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "bgmSource", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "sfxSource", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "bgmClip", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "collectClip", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "objectiveConsumeClip", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "objectiveCompleteClip", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "levelUpClip", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "loseClip", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "winClip", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "collectMinInterval", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.045;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=GameAudioController.js.map