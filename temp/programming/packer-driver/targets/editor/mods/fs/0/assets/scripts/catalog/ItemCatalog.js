System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, _decorator, CCString, Component, Prefab, _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _temp, _crd, ccclass, property, ItemCatalog;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      _decorator = _cc._decorator;
      CCString = _cc.CCString;
      Component = _cc.Component;
      Prefab = _cc.Prefab;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "48eb4UnxrVMMbIfFyKdNnVV", "ItemCatalog", undefined);

      ({
        ccclass,
        property
      } = _decorator);

      _export("ItemCatalog", ItemCatalog = (_dec = ccclass('ItemCatalog'), _dec2 = property({
        type: [Prefab],
        tooltip: 'Drag all item prefabs here. Prefab asset name must match LevelData id, e.g. obj_9.'
      }), _dec3 = property({
        type: Prefab,
        tooltip: 'Fallback visual used for IDs that have no supplied FBX.'
      }), _dec4 = property({
        type: [CCString],
        tooltip: 'Optional alias ID list. Must have same length as aliasPrefabs.'
      }), _dec5 = property({
        type: [Prefab],
        tooltip: 'Prefab mapped to the ID at the same index in aliasIds.'
      }), _dec(_class = (_class2 = (_temp = class ItemCatalog extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "itemPrefabs", _descriptor, this);

          _initializerDefineProperty(this, "fallbackPrefab", _descriptor2, this);

          _initializerDefineProperty(this, "aliasIds", _descriptor3, this);

          _initializerDefineProperty(this, "aliasPrefabs", _descriptor4, this);

          _defineProperty(this, "_map", new Map());
        }

        onLoad() {
          this.rebuild();
        }

        rebuild() {
          this._map.clear();

          for (let i = 0; i < this.itemPrefabs.length; i++) {
            const prefab = this.itemPrefabs[i];

            if (!prefab) {
              continue;
            }

            this._map.set(prefab.name, prefab);
          }

          const count = Math.min(this.aliasIds.length, this.aliasPrefabs.length);

          for (let i = 0; i < count; i++) {
            const id = this.aliasIds[i];
            const prefab = this.aliasPrefabs[i];

            if (id && prefab) {
              this._map.set(id, prefab);
            }
          }
        }

        getPrefab(id) {
          return this._map.get(id) || this.fallbackPrefab;
        }

        hasExactPrefab(id) {
          return this._map.has(id);
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "itemPrefabs", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "fallbackPrefab", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "aliasIds", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "aliasPrefabs", [_dec5], {
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
//# sourceMappingURL=ItemCatalog.js.map