System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, _decorator, CCInteger, CCString, Component, GameEvent, gameEvents, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _temp, _crd, ccclass, property, ObjectiveManager;

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
      CCInteger = _cc.CCInteger;
      CCString = _cc.CCString;
      Component = _cc.Component;
    }, function (_unresolved_2) {
      GameEvent = _unresolved_2.GameEvent;
      gameEvents = _unresolved_2.gameEvents;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "038bexjICJFb6OMSOtp2tDp", "ObjectiveManager", undefined);

      ({
        ccclass,
        property
      } = _decorator);

      _export("ObjectiveManager", ObjectiveManager = (_dec = ccclass('ObjectiveManager'), _dec2 = property({
        type: [CCString],
        tooltip: 'LevelData item IDs to collect, e.g. obj_9.'
      }), _dec3 = property({
        type: [CCInteger],
        tooltip: 'Required counts for targetIds at the same indexes.'
      }), _dec(_class = (_class2 = (_temp = class ObjectiveManager extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "targetIds", _descriptor, this);

          _initializerDefineProperty(this, "targetCounts", _descriptor2, this);

          _defineProperty(this, "_currentCounts", []);

          _defineProperty(this, "_completed", []);
        }

        get objectiveCount() {
          return Math.min(this.targetIds.length, this.targetCounts.length);
        }

        onEnable() {
          (_crd && gameEvents === void 0 ? (_reportPossibleCrUseOfgameEvents({
            error: Error()
          }), gameEvents) : gameEvents).on((_crd && GameEvent === void 0 ? (_reportPossibleCrUseOfGameEvent({
            error: Error()
          }), GameEvent) : GameEvent).ITEM_CONSUMED, this.onItemConsumed, this);
        }

        onDisable() {
          (_crd && gameEvents === void 0 ? (_reportPossibleCrUseOfgameEvents({
            error: Error()
          }), gameEvents) : gameEvents).off((_crd && GameEvent === void 0 ? (_reportPossibleCrUseOfGameEvent({
            error: Error()
          }), GameEvent) : GameEvent).ITEM_CONSUMED, this.onItemConsumed, this);
        }

        start() {
          this.resetObjectives();
        }

        resetObjectives() {
          var count = this.objectiveCount;
          this._currentCounts = new Array(count);
          this._completed = new Array(count);

          for (var i = 0; i < count; i++) {
            this._currentCounts[i] = 0;
            this._completed[i] = false;
            this.emitObjective(i);
          }
        }

        getId(index) {
          return index >= 0 && index < this.objectiveCount ? this.targetIds[index] : '';
        }

        getCurrent(index) {
          return index >= 0 && index < this._currentCounts.length ? this._currentCounts[index] : 0;
        }

        getTarget(index) {
          return index >= 0 && index < this.objectiveCount ? Math.max(0, this.targetCounts[index]) : 0;
        }

        isComplete(index) {
          return index >= 0 && index < this._completed.length && this._completed[index];
        }

        onItemConsumed(id) {
          var count = this.objectiveCount;

          for (var i = 0; i < count; i++) {
            if (this._completed[i] || this.targetIds[i] !== id) {
              continue;
            }

            this._currentCounts[i]++;
            var target = Math.max(0, this.targetCounts[i]);

            if (this._currentCounts[i] >= target) {
              this._currentCounts[i] = target;
              this._completed[i] = true;
              (_crd && gameEvents === void 0 ? (_reportPossibleCrUseOfgameEvents({
                error: Error()
              }), gameEvents) : gameEvents).emit((_crd && GameEvent === void 0 ? (_reportPossibleCrUseOfGameEvent({
                error: Error()
              }), GameEvent) : GameEvent).OBJECTIVE_COMPLETED, i, id);
            }

            this.emitObjective(i);
          }

          if (count > 0 && this._completed.every(value => value)) {
            (_crd && gameEvents === void 0 ? (_reportPossibleCrUseOfgameEvents({
              error: Error()
            }), gameEvents) : gameEvents).emit((_crd && GameEvent === void 0 ? (_reportPossibleCrUseOfGameEvent({
              error: Error()
            }), GameEvent) : GameEvent).ALL_OBJECTIVES_COMPLETED);
          }
        }

        emitObjective(index) {
          (_crd && gameEvents === void 0 ? (_reportPossibleCrUseOfgameEvents({
            error: Error()
          }), gameEvents) : gameEvents).emit((_crd && GameEvent === void 0 ? (_reportPossibleCrUseOfGameEvent({
            error: Error()
          }), GameEvent) : GameEvent).OBJECTIVE_CHANGED, index, this.getId(index), this.getCurrent(index), this.getTarget(index), this.isComplete(index));
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "targetIds", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return ['obj_9', 'obj_10', 'obj_488'];
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "targetCounts", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [12, 12, 10];
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=ObjectiveManager.js.map