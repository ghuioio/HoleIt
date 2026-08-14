System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, _decorator, Component, Label, GameEvent, gameEvents, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _temp, _crd, ccclass, property, DebugHUD;

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
      Label = _cc.Label;
    }, function (_unresolved_2) {
      GameEvent = _unresolved_2.GameEvent;
      gameEvents = _unresolved_2.gameEvents;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "6f2f3viR91GQrpkV5FGbgl9", "DebugHUD", undefined);

      ({
        ccclass,
        property
      } = _decorator);

      _export("DebugHUD", DebugHUD = (_dec = ccclass('DebugHUD'), _dec2 = property({
        type: Label
      }), _dec3 = property({
        type: Label
      }), _dec(_class = (_class2 = (_temp = class DebugHUD extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "itemLabel", _descriptor, this);

          _initializerDefineProperty(this, "fpsLabel", _descriptor2, this);

          _defineProperty(this, "_time", 0);

          _defineProperty(this, "_frames", 0);
        }

        onEnable() {
          (_crd && gameEvents === void 0 ? (_reportPossibleCrUseOfgameEvents({
            error: Error()
          }), gameEvents) : gameEvents).on((_crd && GameEvent === void 0 ? (_reportPossibleCrUseOfGameEvent({
            error: Error()
          }), GameEvent) : GameEvent).ITEM_COUNTS_CHANGED, this.onCountsChanged, this);
        }

        onDisable() {
          (_crd && gameEvents === void 0 ? (_reportPossibleCrUseOfgameEvents({
            error: Error()
          }), gameEvents) : gameEvents).off((_crd && GameEvent === void 0 ? (_reportPossibleCrUseOfGameEvent({
            error: Error()
          }), GameEvent) : GameEvent).ITEM_COUNTS_CHANGED, this.onCountsChanged, this);
        }

        update(dt) {
          this._time += dt;
          this._frames++;

          if (this._time >= 0.5) {
            if (this.fpsLabel) {
              this.fpsLabel.string = "FPS " + Math.round(this._frames / this._time);
            }

            this._time = 0;
            this._frames = 0;
          }
        }

        onCountsChanged(total, remaining, consumed, dynamic) {
          if (this.itemLabel) {
            this.itemLabel.string = "Items " + total + "  Left " + remaining + "  Eaten " + consumed + "  Physics " + dynamic;
          }
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "itemLabel", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "fpsLabel", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=DebugHUD.js.map