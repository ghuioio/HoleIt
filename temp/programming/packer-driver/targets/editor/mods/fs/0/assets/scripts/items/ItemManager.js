System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, _decorator, Component, SpatialHashGrid, _dec, _dec2, _class, _class2, _descriptor, _temp, _crd, ccclass, property, ItemManager;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfItemCube(extras) {
    _reporterNs.report("ItemCube", "./ItemCube", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSpatialHashGrid(extras) {
    _reporterNs.report("SpatialHashGrid", "./SpatialHashGrid", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      _decorator = _cc._decorator;
      Component = _cc.Component;
    }, function (_unresolved_2) {
      SpatialHashGrid = _unresolved_2.SpatialHashGrid;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "a14e25T9RdK1rXlFGohFFLb", "ItemManager", undefined);

      ({
        ccclass,
        property
      } = _decorator);

      _export("ItemManager", ItemManager = (_dec = ccclass('ItemManager'), _dec2 = property({
        tooltip: 'Kich thuoc moi cell spatial grid. Nen lon hon duong kinh Hole mot chut.'
      }), _dec(_class = (_class2 = (_temp = class ItemManager extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "gridCellSize", _descriptor, this);

          _defineProperty(this, "_grid", null);

          _defineProperty(this, "_consuming", []);

          _defineProperty(this, "_totalSpawned", 0);

          _defineProperty(this, "_eatenCount", 0);
        }

        get totalSpawned() {
          return this._totalSpawned;
        }

        get eatenCount() {
          return this._eatenCount;
        }

        get activeCount() {
          return this._totalSpawned - this._eatenCount;
        }

        onLoad() {
          this._grid = new (_crd && SpatialHashGrid === void 0 ? (_reportPossibleCrUseOfSpatialHashGrid({
            error: Error()
          }), SpatialHashGrid) : SpatialHashGrid)(Math.max(0.5, this.gridCellSize));
        }

        registerItem(item) {
          if (!this._grid) {
            return;
          }

          item.prepareForUse();

          this._grid.add(item);

          this._totalSpawned++;
        }

        queryNearby(position, radius, out) {
          if (!this._grid) {
            out.length = 0;
            return out;
          }

          return this._grid.query(position.x, position.z, radius, out);
        }

        consumeItem(item, targetWorldPos, delay, duration) {
          if (!this._grid || !item.isIdle) {
            return false;
          } // Remove khoi grid ngay luc bat dau roi de lan scan tiep theo khong tim lai item nay.


          this._grid.remove(item);

          if (!item.beginConsume(targetWorldPos, delay, duration)) {
            return false;
          }

          this._consuming.push(item);

          return true;
        }

        update(deltaTime) {
          const dt = Math.min(deltaTime, 0.05);

          for (let i = this._consuming.length - 1; i >= 0; i--) {
            const item = this._consuming[i];

            if (!item.tickConsume(dt)) {
              continue;
            }

            this._consuming.splice(i, 1);

            this._eatenCount++;
          }
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "gridCellSize", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 2.5;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=ItemManager.js.map