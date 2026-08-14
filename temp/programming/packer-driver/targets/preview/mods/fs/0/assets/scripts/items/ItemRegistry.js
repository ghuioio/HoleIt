System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, _decorator, Component, Vec3, GameEvent, gameEvents, SpatialHashGrid, _dec, _dec2, _class, _class2, _descriptor, _temp, _crd, ccclass, property, ItemRegistry;

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

  function _reportPossibleCrUseOfSpatialHashGrid(extras) {
    _reporterNs.report("SpatialHashGrid", "../spatial/SpatialHashGrid", _context.meta, extras);
  }

  function _reportPossibleCrUseOfItemRuntime(extras) {
    _reporterNs.report("ItemRuntime", "./ItemRuntime", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      GameEvent = _unresolved_2.GameEvent;
      gameEvents = _unresolved_2.gameEvents;
    }, function (_unresolved_3) {
      SpatialHashGrid = _unresolved_3.SpatialHashGrid;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "d9d9827hwVImbPMb1HYJ5Q+", "ItemRegistry", undefined);

      ({
        ccclass,
        property
      } = _decorator);

      _export("ItemRegistry", ItemRegistry = (_dec = ccclass('ItemRegistry'), _dec2 = property({
        tooltip: 'Spatial hash cell size in world units.'
      }), _dec(_class = (_class2 = (_temp = class ItemRegistry extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "cellSize", _descriptor, this);

          _defineProperty(this, "_grid", null);

          _defineProperty(this, "_all", new Set());

          _defineProperty(this, "_dynamic", new Set());

          _defineProperty(this, "_consumedCount", 0);

          _defineProperty(this, "_worldPos", new Vec3());
        }

        get totalCount() {
          return this._all.size;
        }

        get dynamicCount() {
          return this._dynamic.size;
        }

        get consumedCount() {
          return this._consumedCount;
        }

        get remainingCount() {
          return Math.max(0, this._all.size - this._consumedCount);
        }

        onLoad() {
          this._grid = new (_crd && SpatialHashGrid === void 0 ? (_reportPossibleCrUseOfSpatialHashGrid({
            error: Error()
          }), SpatialHashGrid) : SpatialHashGrid)(Math.max(0.5, this.cellSize));
        }

        register(item) {
          if (this._all.has(item)) {
            return;
          }

          this._all.add(item);

          item.node.getWorldPosition(this._worldPos);

          this._grid.insert(item, this._worldPos);

          if (this._all.size % 100 === 0) {
            this.emitCounts();
          }
        }

        unregister(item) {
          this._grid.remove(item);

          this._dynamic.delete(item);

          this._all.delete(item);

          this.emitCounts();
        }

        markDynamic(item) {
          this._grid.remove(item);

          this._dynamic.add(item);
        }

        markDormant(item) {
          this._dynamic.delete(item);

          item.node.getWorldPosition(this._worldPos);

          this._grid.insert(item, this._worldPos);
        }

        markConsumed(item) {
          this._grid.remove(item);

          this._dynamic.delete(item);

          this._consumedCount++;
          item.markConsumed();
          this.emitCounts();
        }

        queryDormant(position, radius, out) {
          this._grid.query(position, radius, out);
        }

        notifyCounts() {
          this.emitCounts();
        }

        copyDynamicTo(out) {
          out.length = 0;

          this._dynamic.forEach(item => out.push(item));
        }

        emitCounts() {
          (_crd && gameEvents === void 0 ? (_reportPossibleCrUseOfgameEvents({
            error: Error()
          }), gameEvents) : gameEvents).emit((_crd && GameEvent === void 0 ? (_reportPossibleCrUseOfGameEvent({
            error: Error()
          }), GameEvent) : GameEvent).ITEM_COUNTS_CHANGED, this.totalCount, this.remainingCount, this.consumedCount, this.dynamicCount);
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "cellSize", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 2.5;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=ItemRegistry.js.map