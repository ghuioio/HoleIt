System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, _decorator, Component, Vec3, ItemManager, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _temp, _crd, ccclass, property, HoleEater;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfItemCube(extras) {
    _reporterNs.report("ItemCube", "../items/ItemCube", _context.meta, extras);
  }

  function _reportPossibleCrUseOfItemManager(extras) {
    _reporterNs.report("ItemManager", "../items/ItemManager", _context.meta, extras);
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
      ItemManager = _unresolved_2.ItemManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "87648Je16NNEJsxqq/25acq", "HoleEater", undefined);

      ({
        ccclass,
        property
      } = _decorator);

      _export("HoleEater", HoleEater = (_dec = ccclass('HoleEater'), _dec2 = property({
        type: _crd && ItemManager === void 0 ? (_reportPossibleCrUseOfItemManager({
          error: Error()
        }), ItemManager) : ItemManager
      }), _dec3 = property({
        tooltip: 'Ban kinh an item theo mat phang XZ.'
      }), _dec4 = property({
        tooltip: 'Moi bao nhieu giay moi scan spatial grid mot lan.'
      }), _dec5 = property({
        tooltip: 'Gioi han so item bat dau roi trong moi lan scan.'
      }), _dec6 = property({
        tooltip: 'Thoi gian mot cube roi vao Hole.'
      }), _dec7 = property({
        tooltip: 'Cube o cao se bat dau roi tre hon de tao hieu ung sap thap.'
      }), _dec8 = property({
        tooltip: 'Y world cua diem ket thuc, nen nam duoi Ground.'
      }), _dec(_class = (_class2 = (_temp = class HoleEater extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "itemManager", _descriptor, this);

          _initializerDefineProperty(this, "eatRadius", _descriptor2, this);

          _initializerDefineProperty(this, "scanInterval", _descriptor3, this);

          _initializerDefineProperty(this, "maxEatPerScan", _descriptor4, this);

          _initializerDefineProperty(this, "eatDuration", _descriptor5, this);

          _initializerDefineProperty(this, "heightDelayFactor", _descriptor6, this);

          _initializerDefineProperty(this, "targetY", _descriptor7, this);

          _defineProperty(this, "_timer", 0);

          _defineProperty(this, "_holeWorldPos", new Vec3());

          _defineProperty(this, "_itemWorldPos", new Vec3());

          _defineProperty(this, "_eatTarget", new Vec3());

          _defineProperty(this, "_candidates", []);
        }

        update(deltaTime) {
          if (!this.itemManager) {
            return;
          }

          this._timer += deltaTime;

          if (this._timer < this.scanInterval) {
            return;
          }

          this._timer = 0;
          this.node.getWorldPosition(this._holeWorldPos);
          this.itemManager.queryNearby(this._holeWorldPos, this.eatRadius, this._candidates);
          const radiusSq = this.eatRadius * this.eatRadius;
          let started = 0;

          for (let i = 0; i < this._candidates.length; i++) {
            if (started >= this.maxEatPerScan) {
              break;
            }

            const item = this._candidates[i];

            if (!item.isIdle) {
              continue;
            }

            item.node.getWorldPosition(this._itemWorldPos);
            const dx = this._itemWorldPos.x - this._holeWorldPos.x;
            const dz = this._itemWorldPos.z - this._holeWorldPos.z;

            if (dx * dx + dz * dz > radiusSq) {
              continue;
            }

            this._eatTarget.set(this._holeWorldPos.x, this.targetY, this._holeWorldPos.z);

            const delay = Math.max(0, this._itemWorldPos.y) * this.heightDelayFactor + started % 4 * 0.008;

            if (this.itemManager.consumeItem(item, this._eatTarget, delay, this.eatDuration)) {
              started++;
            }
          }
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "itemManager", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "eatRadius", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1.15;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "scanInterval", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.035;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "maxEatPerScan", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 30;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "eatDuration", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.28;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "heightDelayFactor", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.025;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "targetY", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return -0.9;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=HoleEater.js.map