System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, _decorator, Component, instantiate, Node, Quat, Vec3, GameEvent, gameEvents, ItemCatalog, LevelDataLoader, UnityTransformConverter, ItemRegistry, ItemRuntime, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _temp, _crd, ccclass, property, ItemSpawner;

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

  function _reportPossibleCrUseOfItemCatalog(extras) {
    _reporterNs.report("ItemCatalog", "../catalog/ItemCatalog", _context.meta, extras);
  }

  function _reportPossibleCrUseOfLevelDataLoader(extras) {
    _reporterNs.report("LevelDataLoader", "../data/LevelDataLoader", _context.meta, extras);
  }

  function _reportPossibleCrUseOfLevelVec3Data(extras) {
    _reporterNs.report("LevelVec3Data", "../data/LevelDataTypes", _context.meta, extras);
  }

  function _reportPossibleCrUseOfRuntimeSpawnRecord(extras) {
    _reporterNs.report("RuntimeSpawnRecord", "../data/LevelDataTypes", _context.meta, extras);
  }

  function _reportPossibleCrUseOfUnityTransformConverter(extras) {
    _reporterNs.report("UnityTransformConverter", "../data/UnityTransformConverter", _context.meta, extras);
  }

  function _reportPossibleCrUseOfItemRegistry(extras) {
    _reporterNs.report("ItemRegistry", "./ItemRegistry", _context.meta, extras);
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
      instantiate = _cc.instantiate;
      Node = _cc.Node;
      Quat = _cc.Quat;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      GameEvent = _unresolved_2.GameEvent;
      gameEvents = _unresolved_2.gameEvents;
    }, function (_unresolved_3) {
      ItemCatalog = _unresolved_3.ItemCatalog;
    }, function (_unresolved_4) {
      LevelDataLoader = _unresolved_4.LevelDataLoader;
    }, function (_unresolved_5) {
      UnityTransformConverter = _unresolved_5.UnityTransformConverter;
    }, function (_unresolved_6) {
      ItemRegistry = _unresolved_6.ItemRegistry;
    }, function (_unresolved_7) {
      ItemRuntime = _unresolved_7.ItemRuntime;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "99997V/SyFHB4KCvNi/MFUh", "ItemSpawner", undefined);

      ({
        ccclass,
        property
      } = _decorator);

      _export("ItemSpawner", ItemSpawner = (_dec = ccclass('ItemSpawner'), _dec2 = property({
        type: _crd && LevelDataLoader === void 0 ? (_reportPossibleCrUseOfLevelDataLoader({
          error: Error()
        }), LevelDataLoader) : LevelDataLoader
      }), _dec3 = property({
        type: _crd && UnityTransformConverter === void 0 ? (_reportPossibleCrUseOfUnityTransformConverter({
          error: Error()
        }), UnityTransformConverter) : UnityTransformConverter
      }), _dec4 = property({
        type: _crd && ItemCatalog === void 0 ? (_reportPossibleCrUseOfItemCatalog({
          error: Error()
        }), ItemCatalog) : ItemCatalog
      }), _dec5 = property({
        type: _crd && ItemRegistry === void 0 ? (_reportPossibleCrUseOfItemRegistry({
          error: Error()
        }), ItemRegistry) : ItemRegistry
      }), _dec6 = property({
        type: Node,
        tooltip: 'Parent for every runtime level item. Keep this node at identity transform.'
      }), _dec7 = property({
        tooltip: 'Chunk spawning prevents a multi-frame stall. 80-150 is a good mobile starting range.'
      }), _dec(_class = (_class2 = (_temp = class ItemSpawner extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "levelLoader", _descriptor, this);

          _initializerDefineProperty(this, "transformConverter", _descriptor2, this);

          _initializerDefineProperty(this, "catalog", _descriptor3, this);

          _initializerDefineProperty(this, "registry", _descriptor4, this);

          _initializerDefineProperty(this, "levelRoot", _descriptor5, this);

          _initializerDefineProperty(this, "spawnPerFrame", _descriptor6, this);

          _defineProperty(this, "_records", []);

          _defineProperty(this, "_spawnIndex", 0);

          _defineProperty(this, "_spawning", false);

          _defineProperty(this, "_missingIds", new Set());

          _defineProperty(this, "_srcPos", {
            x: 0,
            y: 0,
            z: 0
          });

          _defineProperty(this, "_srcRot", {
            x: 0,
            y: 0,
            z: 0
          });

          _defineProperty(this, "_position", new Vec3());

          _defineProperty(this, "_rotation", new Quat());
        }

        onEnable() {
          (_crd && gameEvents === void 0 ? (_reportPossibleCrUseOfgameEvents({
            error: Error()
          }), gameEvents) : gameEvents).on((_crd && GameEvent === void 0 ? (_reportPossibleCrUseOfGameEvent({
            error: Error()
          }), GameEvent) : GameEvent).LEVEL_DATA_READY, this.onLevelDataReady, this);
        }

        onDisable() {
          (_crd && gameEvents === void 0 ? (_reportPossibleCrUseOfgameEvents({
            error: Error()
          }), gameEvents) : gameEvents).off((_crd && GameEvent === void 0 ? (_reportPossibleCrUseOfGameEvent({
            error: Error()
          }), GameEvent) : GameEvent).LEVEL_DATA_READY, this.onLevelDataReady, this);
        }

        update() {
          if (!this._spawning) {
            return;
          }

          var end = Math.min(this._records.length, this._spawnIndex + Math.max(1, this.spawnPerFrame));

          while (this._spawnIndex < end) {
            this.spawnOne(this._records[this._spawnIndex], this._spawnIndex);
            this._spawnIndex++;
          }

          (_crd && gameEvents === void 0 ? (_reportPossibleCrUseOfgameEvents({
            error: Error()
          }), gameEvents) : gameEvents).emit((_crd && GameEvent === void 0 ? (_reportPossibleCrUseOfGameEvent({
            error: Error()
          }), GameEvent) : GameEvent).LEVEL_SPAWN_PROGRESS, this._spawnIndex, this._records.length);

          if (this._spawnIndex >= this._records.length) {
            this._spawning = false;
            this.registry.notifyCounts();
            (_crd && gameEvents === void 0 ? (_reportPossibleCrUseOfgameEvents({
              error: Error()
            }), gameEvents) : gameEvents).emit((_crd && GameEvent === void 0 ? (_reportPossibleCrUseOfGameEvent({
              error: Error()
            }), GameEvent) : GameEvent).LEVEL_SPAWN_COMPLETE, this._records.length);
          }
        }

        onLevelDataReady(loader) {
          if (this.levelLoader && loader !== this.levelLoader) {
            return;
          }

          if (!this.catalog || !this.registry || !this.transformConverter || !this.levelRoot) {
            console.error('[ItemSpawner] Missing Inspector references. Check README_SETUP.md.');
            return;
          }

          this.catalog.rebuild();
          this._records = loader.records;
          this._spawnIndex = 0;
          this._spawning = true;
        }

        spawnOne(record, spawnIndex) {
          var prefab = this.catalog.getPrefab(record.id);

          if (!prefab) {
            if (!this._missingIds.has(record.id)) {
              this._missingIds.add(record.id);

              console.warn("[ItemSpawner] No prefab/fallback for " + record.id + ". Skipping these instances.");
            }

            return;
          }

          if (!this.catalog.hasExactPrefab(record.id) && !this._missingIds.has(record.id)) {
            this._missingIds.add(record.id);

            console.warn("[ItemSpawner] " + record.id + " uses fallback/alias prefab.");
          }

          var node = instantiate(prefab);
          node.parent = this.levelRoot;
          this._srcPos.x = record.px;
          this._srcPos.y = record.py;
          this._srcPos.z = record.pz;
          this.transformConverter.convertPosition(this._srcPos, this._position);
          node.setPosition(this._position);
          this._srcRot.x = record.rx;
          this._srcRot.y = record.ry;
          this._srcRot.z = record.rz;
          this.transformConverter.convertRotation(this._srcRot, this._rotation);
          node.setRotation(this._rotation);
          var runtime = node.getComponent(_crd && ItemRuntime === void 0 ? (_reportPossibleCrUseOfItemRuntime({
            error: Error()
          }), ItemRuntime) : ItemRuntime);

          if (!runtime) {
            console.error("[ItemSpawner] Prefab " + prefab.name + " must have ItemRuntime on its root node.");
            node.destroy();
            return;
          }

          runtime.initialize(record.id, spawnIndex);
          this.registry.register(runtime);
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "levelLoader", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "transformConverter", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "catalog", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "registry", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "levelRoot", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "spawnPerFrame", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 100;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=ItemSpawner.js.map