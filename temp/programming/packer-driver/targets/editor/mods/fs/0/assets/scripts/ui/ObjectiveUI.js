System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, _decorator, Component, Label, Node, GameEvent, gameEvents, ObjectiveManager, _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _temp, _crd, ccclass, property, ObjectiveUI;

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

  function _reportPossibleCrUseOfObjectiveManager(extras) {
    _reporterNs.report("ObjectiveManager", "../gameplay/ObjectiveManager", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      Label = _cc.Label;
      Node = _cc.Node;
    }, function (_unresolved_2) {
      GameEvent = _unresolved_2.GameEvent;
      gameEvents = _unresolved_2.gameEvents;
    }, function (_unresolved_3) {
      ObjectiveManager = _unresolved_3.ObjectiveManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "f7c7c789LZB65ZYnCz5YMCc", "ObjectiveUI", undefined);

      ({
        ccclass,
        property
      } = _decorator);

      _export("ObjectiveUI", ObjectiveUI = (_dec = ccclass('ObjectiveUI'), _dec2 = property({
        type: _crd && ObjectiveManager === void 0 ? (_reportPossibleCrUseOfObjectiveManager({
          error: Error()
        }), ObjectiveManager) : ObjectiveManager
      }), _dec3 = property({
        type: [Label],
        tooltip: 'Count labels in the same order as ObjectiveManager targetIds.'
      }), _dec4 = property({
        type: [Node],
        tooltip: 'Tick nodes in the same order as ObjectiveManager targetIds.'
      }), _dec(_class = (_class2 = (_temp = class ObjectiveUI extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "objectives", _descriptor, this);

          _initializerDefineProperty(this, "countLabels", _descriptor2, this);

          _initializerDefineProperty(this, "tickNodes", _descriptor3, this);
        }

        onEnable() {
          (_crd && gameEvents === void 0 ? (_reportPossibleCrUseOfgameEvents({
            error: Error()
          }), gameEvents) : gameEvents).on((_crd && GameEvent === void 0 ? (_reportPossibleCrUseOfGameEvent({
            error: Error()
          }), GameEvent) : GameEvent).OBJECTIVE_CHANGED, this.onObjectiveChanged, this);
        }

        onDisable() {
          (_crd && gameEvents === void 0 ? (_reportPossibleCrUseOfgameEvents({
            error: Error()
          }), gameEvents) : gameEvents).off((_crd && GameEvent === void 0 ? (_reportPossibleCrUseOfGameEvent({
            error: Error()
          }), GameEvent) : GameEvent).OBJECTIVE_CHANGED, this.onObjectiveChanged, this);
        }

        start() {
          this.refreshAll();
        }

        refreshAll() {
          if (!this.objectives) {
            return;
          }

          for (let i = 0; i < this.objectives.objectiveCount; i++) {
            this.apply(i, this.objectives.getCurrent(i), this.objectives.getTarget(i), this.objectives.isComplete(i));
          }
        }

        onObjectiveChanged(index, _id, current, target, complete) {
          this.apply(index, current, target, complete);
        }

        apply(index, current, target, complete) {
          if (index < this.countLabels.length && this.countLabels[index]) {
            this.countLabels[index].string = `${current}/${target}`;
          }

          if (index < this.tickNodes.length && this.tickNodes[index]) {
            this.tickNodes[index].active = complete;
          }
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "objectives", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "countLabels", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "tickNodes", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=ObjectiveUI.js.map