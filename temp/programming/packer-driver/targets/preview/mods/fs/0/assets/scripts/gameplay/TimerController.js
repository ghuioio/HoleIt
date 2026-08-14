System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, _decorator, Component, GameEvent, gameEvents, _dec, _dec2, _class, _class2, _descriptor, _temp, _crd, ccclass, property, TimerController;

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
      Component = _cc.Component;
    }, function (_unresolved_2) {
      GameEvent = _unresolved_2.GameEvent;
      gameEvents = _unresolved_2.gameEvents;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "5faeaFEyrREMoQaXoXgg/k0", "TimerController", undefined);

      ({
        ccclass,
        property
      } = _decorator);

      _export("TimerController", TimerController = (_dec = ccclass('TimerController'), _dec2 = property({
        tooltip: 'Playable round duration in seconds.'
      }), _dec(_class = (_class2 = (_temp = class TimerController extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "duration", _descriptor, this);

          _defineProperty(this, "_remaining", 0);

          _defineProperty(this, "_running", false);
        }

        get remaining() {
          return this._remaining;
        }

        get normalizedRemaining() {
          return this.duration <= 0 ? 0 : Math.max(0, Math.min(1, this._remaining / this.duration));
        }

        start() {
          this.resetCountdown();
        }

        update(dt) {
          if (!this._running) {
            return;
          }

          this._remaining = Math.max(0, this._remaining - dt);
          (_crd && gameEvents === void 0 ? (_reportPossibleCrUseOfgameEvents({
            error: Error()
          }), gameEvents) : gameEvents).emit((_crd && GameEvent === void 0 ? (_reportPossibleCrUseOfGameEvent({
            error: Error()
          }), GameEvent) : GameEvent).TIMER_CHANGED, this._remaining, this.normalizedRemaining);

          if (this._remaining <= 0) {
            this._running = false;
            (_crd && gameEvents === void 0 ? (_reportPossibleCrUseOfgameEvents({
              error: Error()
            }), gameEvents) : gameEvents).emit((_crd && GameEvent === void 0 ? (_reportPossibleCrUseOfGameEvent({
              error: Error()
            }), GameEvent) : GameEvent).TIMER_EXPIRED);
          }
        }

        resetCountdown() {
          this._running = false;
          this._remaining = Math.max(0, this.duration);
          (_crd && gameEvents === void 0 ? (_reportPossibleCrUseOfgameEvents({
            error: Error()
          }), gameEvents) : gameEvents).emit((_crd && GameEvent === void 0 ? (_reportPossibleCrUseOfGameEvent({
            error: Error()
          }), GameEvent) : GameEvent).TIMER_CHANGED, this._remaining, this.normalizedRemaining);
        }

        startCountdown() {
          if (this._remaining <= 0) {
            this._remaining = Math.max(0, this.duration);
          }

          this._running = true;
          (_crd && gameEvents === void 0 ? (_reportPossibleCrUseOfgameEvents({
            error: Error()
          }), gameEvents) : gameEvents).emit((_crd && GameEvent === void 0 ? (_reportPossibleCrUseOfGameEvent({
            error: Error()
          }), GameEvent) : GameEvent).TIMER_CHANGED, this._remaining, this.normalizedRemaining);
        }

        stopCountdown() {
          this._running = false;
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "duration", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 45;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=TimerController.js.map