System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, _decorator, Component, Node, Vec3, GameEvent, gameEvents, ItemRegistry, HoleSizeController, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _temp, _crd, ccclass, property, HoleConsumeSystem;

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

  function _reportPossibleCrUseOfItemRegistry(extras) {
    _reporterNs.report("ItemRegistry", "../items/ItemRegistry", _context.meta, extras);
  }

  function _reportPossibleCrUseOfItemRuntime(extras) {
    _reporterNs.report("ItemRuntime", "../items/ItemRuntime", _context.meta, extras);
  }

  function _reportPossibleCrUseOfHoleSizeController(extras) {
    _reporterNs.report("HoleSizeController", "./HoleSizeController", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      Node = _cc.Node;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      GameEvent = _unresolved_2.GameEvent;
      gameEvents = _unresolved_2.gameEvents;
    }, function (_unresolved_3) {
      ItemRegistry = _unresolved_3.ItemRegistry;
    }, function (_unresolved_4) {
      HoleSizeController = _unresolved_4.HoleSizeController;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "cf084UD61JCyr82PbGGV3hf", "HoleConsumeSystem", undefined);

      ({
        ccclass,
        property
      } = _decorator);

      _export("HoleConsumeSystem", HoleConsumeSystem = (_dec = ccclass('HoleConsumeSystem'), _dec2 = property({
        type: _crd && ItemRegistry === void 0 ? (_reportPossibleCrUseOfItemRegistry({
          error: Error()
        }), ItemRegistry) : ItemRegistry
      }), _dec3 = property({
        type: Node
      }), _dec4 = property({
        type: _crd && HoleSizeController === void 0 ? (_reportPossibleCrUseOfHoleSizeController({
          error: Error()
        }), HoleSizeController) : HoleSizeController
      }), _dec5 = property({
        tooltip: 'Y coordinate of the visible hole surface.'
      }), _dec6 = property({
        tooltip: 'Item center must fall below holePlaneY + this value before capture.'
      }), _dec7 = property({
        tooltip: 'Extra safety margin so large objects do not clip through the rim.'
      }), _dec8 = property({
        tooltip: 'Horizontal pull speed while an item is falling through the Hole.'
      }), _dec9 = property({
        tooltip: 'Downward velocity while an item is in the Hole.'
      }), _dec10 = property({
        tooltip: 'Disable an item after it reaches holePlaneY - killDepth.'
      }), _dec11 = property({
        tooltip: 'How often dynamic items are tested for capture.'
      }), _dec(_class = (_class2 = (_temp = class HoleConsumeSystem extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "registry", _descriptor, this);

          _initializerDefineProperty(this, "hole", _descriptor2, this);

          _initializerDefineProperty(this, "holeSize", _descriptor3, this);

          _initializerDefineProperty(this, "holePlaneY", _descriptor4, this);

          _initializerDefineProperty(this, "captureHeight", _descriptor5, this);

          _initializerDefineProperty(this, "rimPadding", _descriptor6, this);

          _initializerDefineProperty(this, "pullSpeed", _descriptor7, this);

          _initializerDefineProperty(this, "downSpeed", _descriptor8, this);

          _initializerDefineProperty(this, "killDepth", _descriptor9, this);

          _initializerDefineProperty(this, "captureScanInterval", _descriptor10, this);

          _defineProperty(this, "_captureTimer", 0);

          _defineProperty(this, "_dynamic", []);

          _defineProperty(this, "_falling", []);

          _defineProperty(this, "_holePos", new Vec3());

          _defineProperty(this, "_itemPos", new Vec3());

          _defineProperty(this, "_velocity", new Vec3());
        }

        update(dt) {
          if (!this.registry || !this.hole || !this.holeSize) {
            return;
          }

          this.hole.getWorldPosition(this._holePos);
          this._captureTimer -= dt;

          if (this._captureTimer <= 0) {
            this._captureTimer = Math.max(0.01, this.captureScanInterval);
            this.captureNearbyDynamicItems();
          }

          this.updateFallingItems();
        }

        captureNearbyDynamicItems() {
          this.registry.copyDynamicTo(this._dynamic);
          const holeRadius = this.holeSize.radius;
          const holeLevel = this.holeSize.level;

          for (let i = 0; i < this._dynamic.length; i++) {
            const item = this._dynamic[i];

            if (!item.isDynamic || item.requiredHoleLevel > holeLevel) {
              continue;
            }

            item.node.getWorldPosition(this._itemPos);

            if (this._itemPos.y > this.holePlaneY + this.captureHeight) {
              continue;
            }

            const allowedRadius = Math.max(0.02, holeRadius - item.consumeRadius - this.rimPadding);
            const dx = this._itemPos.x - this._holePos.x;
            const dz = this._itemPos.z - this._holePos.z;

            if (dx * dx + dz * dz > allowedRadius * allowedRadius) {
              continue;
            }

            this.buildPullVelocity(this._itemPos, this._velocity);
            item.beginFalling(this._velocity);

            if (item.isFalling) {
              this._falling.push(item);

              (_crd && gameEvents === void 0 ? (_reportPossibleCrUseOfgameEvents({
                error: Error()
              }), gameEvents) : gameEvents).emit((_crd && GameEvent === void 0 ? (_reportPossibleCrUseOfGameEvent({
                error: Error()
              }), GameEvent) : GameEvent).ITEM_CONSUME_STARTED, item.id, item);
            }
          }
        }

        updateFallingItems() {
          for (let i = this._falling.length - 1; i >= 0; i--) {
            const item = this._falling[i];

            if (!item.node.active || !item.isFalling) {
              this._falling.splice(i, 1);

              continue;
            }

            item.node.getWorldPosition(this._itemPos);

            if (this._itemPos.y <= this.holePlaneY - this.killDepth) {
              const id = item.id;
              const value = item.consumeValue;
              this.registry.markConsumed(item);
              this.holeSize.addXp(value);
              (_crd && gameEvents === void 0 ? (_reportPossibleCrUseOfgameEvents({
                error: Error()
              }), gameEvents) : gameEvents).emit((_crd && GameEvent === void 0 ? (_reportPossibleCrUseOfGameEvent({
                error: Error()
              }), GameEvent) : GameEvent).ITEM_CONSUMED, id, value, item);

              this._falling.splice(i, 1);

              continue;
            }

            this.buildPullVelocity(this._itemPos, this._velocity);
            item.setFallingVelocity(this._velocity);
          }
        }

        buildPullVelocity(itemPosition, out) {
          let dx = this._holePos.x - itemPosition.x;
          let dz = this._holePos.z - itemPosition.z;
          const len = Math.sqrt(dx * dx + dz * dz);

          if (len > 0.0001) {
            dx /= len;
            dz /= len;
          }

          out.set(dx * this.pullSpeed, -Math.abs(this.downSpeed), dz * this.pullSpeed);
          return out;
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "registry", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "hole", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "holeSize", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "holePlaneY", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.03;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "captureHeight", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.45;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "rimPadding", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.04;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "pullSpeed", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 3.5;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "downSpeed", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 5.5;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "killDepth", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1.8;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "captureScanInterval", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.025;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=HoleConsumeSystem.js.map