System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, _decorator, Component, Label, ItemManager, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _temp, _crd, ccclass, property, GameHUD;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

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
      Label = _cc.Label;
    }, function (_unresolved_2) {
      ItemManager = _unresolved_2.ItemManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "b3186QHHW1LI7iPO5aDXqck", "GameHUD", undefined);

      ({
        ccclass,
        property
      } = _decorator);

      _export("GameHUD", GameHUD = (_dec = ccclass('GameHUD'), _dec2 = property({
        type: _crd && ItemManager === void 0 ? (_reportPossibleCrUseOfItemManager({
          error: Error()
        }), ItemManager) : ItemManager
      }), _dec3 = property({
        type: Label
      }), _dec4 = property({
        type: Label
      }), _dec5 = property({
        type: Label
      }), _dec6 = property({
        tooltip: 'UI khong can cap nhat 60 lan/giay.'
      }), _dec(_class = (_class2 = (_temp = class GameHUD extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "itemManager", _descriptor, this);

          _initializerDefineProperty(this, "renderedLabel", _descriptor2, this);

          _initializerDefineProperty(this, "activeLabel", _descriptor3, this);

          _initializerDefineProperty(this, "eatenLabel", _descriptor4, this);

          _initializerDefineProperty(this, "refreshInterval", _descriptor5, this);

          _defineProperty(this, "_timer", 0);
        }

        update(deltaTime) {
          this._timer += deltaTime;

          if (this._timer < this.refreshInterval) {
            return;
          }

          this._timer = 0;

          if (!this.itemManager) {
            return;
          }

          if (this.renderedLabel) {
            this.renderedLabel.string = 'Items rendered: ' + this.itemManager.totalSpawned;
          }

          if (this.activeLabel) {
            this.activeLabel.string = 'Active: ' + this.itemManager.activeCount;
          }

          if (this.eatenLabel) {
            this.eatenLabel.string = 'Eaten: ' + this.itemManager.eatenCount;
          }
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "itemManager", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "renderedLabel", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "activeLabel", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "eatenLabel", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "refreshInterval", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.1;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=GameHUD.js.map