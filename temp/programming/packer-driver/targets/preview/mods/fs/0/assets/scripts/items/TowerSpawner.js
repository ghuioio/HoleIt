System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, _decorator, Component, instantiate, Prefab, Vec3, ItemCube, ItemManager, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _temp, _crd, ccclass, property, TowerSpawner;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfItemCube(extras) {
    _reporterNs.report("ItemCube", "./ItemCube", _context.meta, extras);
  }

  function _reportPossibleCrUseOfItemManager(extras) {
    _reporterNs.report("ItemManager", "./ItemManager", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      instantiate = _cc.instantiate;
      Prefab = _cc.Prefab;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      ItemCube = _unresolved_2.ItemCube;
    }, function (_unresolved_3) {
      ItemManager = _unresolved_3.ItemManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "e1621tJN7pNwqhuRPeYfepx", "TowerSpawner", undefined);

      ({
        ccclass,
        property
      } = _decorator);

      _export("TowerSpawner", TowerSpawner = (_dec = ccclass('TowerSpawner'), _dec2 = property({
        type: Prefab,
        tooltip: 'Prefab Cube co ItemCube component.'
      }), _dec3 = property({
        type: _crd && ItemManager === void 0 ? (_reportPossibleCrUseOfItemManager({
          error: Error()
        }), ItemManager) : ItemManager
      }), _dec4 = property({
        tooltip: 'So tower theo truc X.'
      }), _dec5 = property({
        tooltip: 'So tower theo truc Z.'
      }), _dec6 = property({
        tooltip: 'So cube moi canh cua 1 layer. 5 => 25 cube/layer.'
      }), _dec7 = property({
        tooltip: 'So layer cua moi tower.'
      }), _dec8 = property({
        tooltip: 'Khoang cach giua tam cac tower.'
      }), _dec9 = property({
        tooltip: 'Scale dong deu cua cube prefab.'
      }), _dec10 = property({
        tooltip: 'Khoang trong nho giua cac cube.'
      }), _dec11 = property({
        tooltip: 'So cube instantiate moi frame de tranh spike luc khoi tao.'
      }), _dec(_class = (_class2 = (_temp = class TowerSpawner extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "cubePrefab", _descriptor, this);

          _initializerDefineProperty(this, "itemManager", _descriptor2, this);

          _initializerDefineProperty(this, "towerCountX", _descriptor3, this);

          _initializerDefineProperty(this, "towerCountZ", _descriptor4, this);

          _initializerDefineProperty(this, "baseSize", _descriptor5, this);

          _initializerDefineProperty(this, "layerCount", _descriptor6, this);

          _initializerDefineProperty(this, "towerSpacing", _descriptor7, this);

          _initializerDefineProperty(this, "cubeScale", _descriptor8, this);

          _initializerDefineProperty(this, "cubeGap", _descriptor9, this);

          _initializerDefineProperty(this, "spawnPerFrame", _descriptor10, this);

          _defineProperty(this, "_spawnPositions", []);

          _defineProperty(this, "_spawnIndex", 0);

          _defineProperty(this, "_isReady", false);
        }

        get plannedCount() {
          return this._spawnPositions.length;
        }

        get isFinished() {
          return this._isReady && this._spawnIndex >= this._spawnPositions.length;
        }

        start() {
          if (!this.cubePrefab) {
            console.error('[TowerSpawner] cubePrefab is missing.');
            return;
          }

          if (!this.itemManager) {
            console.error('[TowerSpawner] itemManager is missing.');
            return;
          }

          this.buildSpawnPositions();
          this._isReady = true;
        }

        update() {
          if (!this._isReady || this.isFinished || !this.cubePrefab || !this.itemManager) {
            return;
          }

          var countThisFrame = Math.max(1, Math.floor(this.spawnPerFrame));
          var end = Math.min(this._spawnIndex + countThisFrame, this._spawnPositions.length);

          while (this._spawnIndex < end) {
            var cubeNode = instantiate(this.cubePrefab);
            this.node.addChild(cubeNode);
            cubeNode.setPosition(this._spawnPositions[this._spawnIndex]);
            cubeNode.setScale(this.cubeScale, this.cubeScale, this.cubeScale);
            var itemCube = cubeNode.getComponent(_crd && ItemCube === void 0 ? (_reportPossibleCrUseOfItemCube({
              error: Error()
            }), ItemCube) : ItemCube);

            if (!itemCube) {
              console.error('[TowerSpawner] Cube prefab must contain ItemCube component.');
              cubeNode.destroy();
              this._spawnIndex++;
              continue;
            }

            this.itemManager.registerItem(itemCube);
            this._spawnIndex++;
          }
        }

        buildSpawnPositions() {
          this._spawnPositions.length = 0;
          this._spawnIndex = 0;
          var countX = Math.max(1, Math.floor(this.towerCountX));
          var countZ = Math.max(1, Math.floor(this.towerCountZ));
          var size = Math.max(1, Math.floor(this.baseSize));
          var layers = Math.max(1, Math.floor(this.layerCount));
          var cubeStep = this.cubeScale + this.cubeGap;
          var towerOffsetX = (countX - 1) * 0.5;
          var towerOffsetZ = (countZ - 1) * 0.5;
          var cubeOffset = (size - 1) * 0.5;

          for (var towerX = 0; towerX < countX; towerX++) {
            for (var towerZ = 0; towerZ < countZ; towerZ++) {
              var centerX = (towerX - towerOffsetX) * this.towerSpacing;
              var centerZ = (towerZ - towerOffsetZ) * this.towerSpacing;

              for (var layer = 0; layer < layers; layer++) {
                for (var x = 0; x < size; x++) {
                  for (var z = 0; z < size; z++) {
                    var px = centerX + (x - cubeOffset) * cubeStep;
                    var py = this.cubeScale * 0.5 + layer * cubeStep;
                    var pz = centerZ + (z - cubeOffset) * cubeStep;

                    this._spawnPositions.push(new Vec3(px, py, pz));
                  }
                }
              }
            }
          }

          console.log('[TowerSpawner] Planned item count:', this._spawnPositions.length);
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "cubePrefab", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "itemManager", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "towerCountX", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 4;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "towerCountZ", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 3;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "baseSize", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 5;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "layerCount", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 4;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "towerSpacing", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 6;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "cubeScale", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.45;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "cubeGap", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.04;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "spawnPerFrame", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 120;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=TowerSpawner.js.map