System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, _decorator, Component, Node, Vec3, ItemRegistry, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _temp, _crd, ccclass, property, PhysicsActivationSystem;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfItemRegistry(extras) {
    _reporterNs.report("ItemRegistry", "../items/ItemRegistry", _context.meta, extras);
  }

  function _reportPossibleCrUseOfItemRuntime(extras) {
    _reporterNs.report("ItemRuntime", "../items/ItemRuntime", _context.meta, extras);
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
      ItemRegistry = _unresolved_2.ItemRegistry;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "8ece35zhaVKQ68gzqtTMXXi", "PhysicsActivationSystem", undefined);

      ({
        ccclass,
        property
      } = _decorator);

      _export("PhysicsActivationSystem", PhysicsActivationSystem = (_dec = ccclass('PhysicsActivationSystem'), _dec2 = property({
        type: _crd && ItemRegistry === void 0 ? (_reportPossibleCrUseOfItemRegistry({
          error: Error()
        }), ItemRegistry) : ItemRegistry
      }), _dec3 = property({
        type: Node
      }), _dec4 = property({
        tooltip: 'Dormant items inside this radius become real dynamic physics bodies.'
      }), _dec5 = property({
        tooltip: 'Settled items farther than this radius are frozen back to cheap dormant state.'
      }), _dec6 = property({
        tooltip: 'How often spatial activation/freeze checks run.'
      }), _dec7 = property({
        tooltip: 'Safety cap for simultaneously simulated bodies.'
      }), _dec8 = property({
        tooltip: 'Maximum dormant objects activated in one scan.'
      }), _dec9 = property({
        tooltip: 'Dynamic item must be slower than this before it can be frozen.'
      }), _dec(_class = (_class2 = (_temp = class PhysicsActivationSystem extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "registry", _descriptor, this);

          _initializerDefineProperty(this, "hole", _descriptor2, this);

          _initializerDefineProperty(this, "activationRadius", _descriptor3, this);

          _initializerDefineProperty(this, "freezeRadius", _descriptor4, this);

          _initializerDefineProperty(this, "scanInterval", _descriptor5, this);

          _initializerDefineProperty(this, "maxDynamicBodies", _descriptor6, this);

          _initializerDefineProperty(this, "maxActivationsPerScan", _descriptor7, this);

          _initializerDefineProperty(this, "freezeSpeedThreshold", _descriptor8, this);

          _defineProperty(this, "_timer", 0);

          _defineProperty(this, "_holePos", new Vec3());

          _defineProperty(this, "_itemPos", new Vec3());

          _defineProperty(this, "_nearby", []);

          _defineProperty(this, "_dynamic", []);
        }

        update(dt) {
          if (!this.registry || !this.hole) {
            return;
          }

          this._timer -= dt;

          if (this._timer > 0) {
            return;
          }

          this._timer = Math.max(0.01, this.scanInterval);
          this.scan();
        }

        scan() {
          this.hole.getWorldPosition(this._holePos);
          this.registry.copyDynamicTo(this._dynamic);
          var freezeRadiusSq = this.freezeRadius * this.freezeRadius;

          for (var i = 0; i < this._dynamic.length; i++) {
            var item = this._dynamic[i];

            if (!item.isDynamic) {
              continue;
            }

            item.node.getWorldPosition(this._itemPos);
            var dx = this._itemPos.x - this._holePos.x;
            var dz = this._itemPos.z - this._holePos.z;

            if (dx * dx + dz * dz < freezeRadiusSq) {
              continue;
            }

            if (!item.canFreeze(this.freezeSpeedThreshold)) {
              continue;
            }

            item.setDormant();
            this.registry.markDormant(item);
          }

          var available = Math.max(0, this.maxDynamicBodies - this.registry.dynamicCount);

          if (available <= 0) {
            return;
          }

          this.registry.queryDormant(this._holePos, this.activationRadius, this._nearby);
          var radiusSq = this.activationRadius * this.activationRadius;
          var activated = 0;

          for (var _i = 0; _i < this._nearby.length; _i++) {
            if (activated >= this.maxActivationsPerScan || available <= 0) {
              break;
            }

            var _item = this._nearby[_i];

            if (!_item.isDormant) {
              continue;
            }

            _item.node.getWorldPosition(this._itemPos);

            var _dx = this._itemPos.x - this._holePos.x;

            var _dz = this._itemPos.z - this._holePos.z;

            if (_dx * _dx + _dz * _dz > radiusSq) {
              continue;
            }

            if (_item.activateDynamic()) {
              this.registry.markDynamic(_item);
              activated++;
              available--;
            }
          }
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "registry", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "hole", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "activationRadius", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 5.5;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "freezeRadius", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 8.5;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "scanInterval", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.06;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "maxDynamicBodies", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 260;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "maxActivationsPerScan", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 80;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "freezeSpeedThreshold", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.12;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=PhysicsActivationSystem.js.map