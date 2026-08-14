System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, _decorator, CCFloat, CCInteger, Component, GameEvent, gameEvents, HoleVisual, _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _temp, _crd, ccclass, property, HoleSizeController;

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

  function _reportPossibleCrUseOfHoleVisual(extras) {
    _reporterNs.report("HoleVisual", "./HoleVisual", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      _decorator = _cc._decorator;
      CCFloat = _cc.CCFloat;
      CCInteger = _cc.CCInteger;
      Component = _cc.Component;
    }, function (_unresolved_2) {
      GameEvent = _unresolved_2.GameEvent;
      gameEvents = _unresolved_2.gameEvents;
    }, function (_unresolved_3) {
      HoleVisual = _unresolved_3.HoleVisual;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "94e82yNrcRD56Mn5pTq3HPe", "HoleSizeController", undefined);

      ({
        ccclass,
        property
      } = _decorator);

      _export("HoleSizeController", HoleSizeController = (_dec = ccclass('HoleSizeController'), _dec2 = property({
        type: _crd && HoleVisual === void 0 ? (_reportPossibleCrUseOfHoleVisual({
          error: Error()
        }), HoleVisual) : HoleVisual
      }), _dec3 = property({
        type: [CCFloat],
        tooltip: 'Hole radius for Lv1, Lv2, ...'
      }), _dec4 = property({
        type: [CCInteger],
        tooltip: 'XP required to advance FROM each level. Last entry is ignored.'
      }), _dec(_class = (_class2 = (_temp = class HoleSizeController extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "visual", _descriptor, this);

          _initializerDefineProperty(this, "levelRadii", _descriptor2, this);

          _initializerDefineProperty(this, "xpToNextLevel", _descriptor3, this);

          _defineProperty(this, "_levelIndex", 0);

          _defineProperty(this, "_xpInLevel", 0);
        }

        get level() {
          return this._levelIndex + 1;
        }

        get radius() {
          if (this.levelRadii.length === 0) {
            return 1;
          }

          return this.levelRadii[Math.min(this._levelIndex, this.levelRadii.length - 1)];
        }

        get progress01() {
          if (this._levelIndex >= this.levelRadii.length - 1) {
            return 1;
          }

          var required = this.getRequiredXp();
          return required <= 0 ? 1 : Math.min(1, this._xpInLevel / required);
        }

        start() {
          this.applyLevelVisual();
          this.emitProgress();
        }

        addXp(amount) {
          if (amount <= 0 || this.levelRadii.length === 0) {
            return;
          }

          this._xpInLevel += amount;
          var leveledUp = false;

          while (this._levelIndex < this.levelRadii.length - 1) {
            var required = this.getRequiredXp();

            if (required <= 0 || this._xpInLevel < required) {
              break;
            }

            this._xpInLevel -= required;
            this._levelIndex++;
            leveledUp = true;
            this.applyLevelVisual();
            (_crd && gameEvents === void 0 ? (_reportPossibleCrUseOfgameEvents({
              error: Error()
            }), gameEvents) : gameEvents).emit((_crd && GameEvent === void 0 ? (_reportPossibleCrUseOfGameEvent({
              error: Error()
            }), GameEvent) : GameEvent).HOLE_LEVEL_UP, this.level, this.radius);
          }

          if (leveledUp && this._levelIndex >= this.levelRadii.length - 1) {
            this._xpInLevel = 0;
          }

          this.emitProgress();
        }

        getRequiredXp() {
          if (this._levelIndex >= this.xpToNextLevel.length) {
            return 0;
          }

          return Math.max(0, this.xpToNextLevel[this._levelIndex]);
        }

        applyLevelVisual() {
          if (this.visual) {
            this.visual.setRadius(this.radius);
          }
        }

        emitProgress() {
          (_crd && gameEvents === void 0 ? (_reportPossibleCrUseOfgameEvents({
            error: Error()
          }), gameEvents) : gameEvents).emit((_crd && GameEvent === void 0 ? (_reportPossibleCrUseOfGameEvent({
            error: Error()
          }), GameEvent) : GameEvent).HOLE_PROGRESS_CHANGED, this.level, this.progress01, this.radius);
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "visual", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "levelRadii", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [0.75, 0.95, 1.2, 1.5];
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "xpToNextLevel", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [25, 45, 70];
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=HoleSizeController.js.map