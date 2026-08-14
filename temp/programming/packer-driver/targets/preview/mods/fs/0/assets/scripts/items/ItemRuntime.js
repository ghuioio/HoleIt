System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, _decorator, Collider, Component, ERigidBodyType, RigidBody, Vec3, PhysicsGroup, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _temp, _crd, ccclass, property, ItemRuntimeState, ItemRuntime;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfPhysicsGroup(extras) {
    _reporterNs.report("PhysicsGroup", "../physics/PhysicsGroups", _context.meta, extras);
  }

  _export("ItemRuntimeState", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      _decorator = _cc._decorator;
      Collider = _cc.Collider;
      Component = _cc.Component;
      ERigidBodyType = _cc.ERigidBodyType;
      RigidBody = _cc.RigidBody;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      PhysicsGroup = _unresolved_2.PhysicsGroup;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "28eb2AGfrRPxou82v3vpoZ3", "ItemRuntime", undefined);

      ({
        ccclass,
        property
      } = _decorator);

      (function (ItemRuntimeState) {
        ItemRuntimeState[ItemRuntimeState["Dormant"] = 0] = "Dormant";
        ItemRuntimeState[ItemRuntimeState["Dynamic"] = 1] = "Dynamic";
        ItemRuntimeState[ItemRuntimeState["Falling"] = 2] = "Falling";
        ItemRuntimeState[ItemRuntimeState["Consumed"] = 3] = "Consumed";
      })(ItemRuntimeState || _export("ItemRuntimeState", ItemRuntimeState = {}));

      _export("ItemRuntime", ItemRuntime = (_dec = ccclass('ItemRuntime'), _dec2 = property({
        tooltip: 'Optional override. If empty, ItemSpawner uses LevelData id.'
      }), _dec3 = property({
        tooltip: 'Minimum Hole level required to swallow this item.'
      }), _dec4 = property({
        tooltip: 'XP/progress granted when this item is fully consumed.'
      }), _dec5 = property({
        tooltip: 'Approximate horizontal radius used by HoleConsumeSystem. Tune per prefab.'
      }), _dec6 = property({
        tooltip: 'Runtime physics mass when activated.'
      }), _dec7 = property({
        tooltip: 'Linear damping while dynamic.'
      }), _dec8 = property({
        tooltip: 'Angular damping while dynamic.'
      }), _dec(_class = (_class2 = (_temp = class ItemRuntime extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "itemId", _descriptor, this);

          _initializerDefineProperty(this, "requiredHoleLevel", _descriptor2, this);

          _initializerDefineProperty(this, "consumeValue", _descriptor3, this);

          _initializerDefineProperty(this, "consumeRadius", _descriptor4, this);

          _initializerDefineProperty(this, "mass", _descriptor5, this);

          _initializerDefineProperty(this, "linearDamping", _descriptor6, this);

          _initializerDefineProperty(this, "angularDamping", _descriptor7, this);

          _defineProperty(this, "_body", null);

          _defineProperty(this, "_colliders", []);

          _defineProperty(this, "_state", ItemRuntimeState.Dormant);

          _defineProperty(this, "_spawnId", '');

          _defineProperty(this, "_spawnIndex", -1);

          _defineProperty(this, "_velocity", new Vec3());
        }

        get state() {
          return this._state;
        }

        get id() {
          return this.itemId || this._spawnId || this.node.name;
        }

        get spawnIndex() {
          return this._spawnIndex;
        }

        get isDormant() {
          return this._state === ItemRuntimeState.Dormant;
        }

        get isDynamic() {
          return this._state === ItemRuntimeState.Dynamic;
        }

        get isFalling() {
          return this._state === ItemRuntimeState.Falling;
        }

        onLoad() {
          this._body = this.getComponent(RigidBody);
          this._colliders = this.getComponents(Collider);
        }

        initialize(spawnId, spawnIndex) {
          this._spawnId = spawnId;
          this._spawnIndex = spawnIndex;
          this.setDormant();
        }
        /**
         * Dormant items are rendered, but their physics components are disabled.
         * This is the main optimization that keeps thousands of level items cheap.
         */


        setDormant() {
          if (this._state === ItemRuntimeState.Consumed) {
            return;
          }

          this._state = ItemRuntimeState.Dormant;

          if (this._body) {
            this._body.type = ERigidBodyType.KINEMATIC;

            this._body.clearVelocity();

            this._body.clearForces();

            this._body.enabled = false;
          }

          for (var i = 0; i < this._colliders.length; i++) {
            this._colliders[i].enabled = false;
          }
        }

        activateDynamic() {
          if (this._state !== ItemRuntimeState.Dormant) {
            return false;
          }

          if (!this._body || this._colliders.length === 0) {
            return false;
          }

          for (var i = 0; i < this._colliders.length; i++) {
            this._colliders[i].enabled = true;

            this._colliders[i].setGroup((_crd && PhysicsGroup === void 0 ? (_reportPossibleCrUseOfPhysicsGroup({
              error: Error()
            }), PhysicsGroup) : PhysicsGroup).ITEM);
          }

          this._body.enabled = true;
          this._body.type = ERigidBodyType.DYNAMIC;
          this._body.mass = Math.max(0.01, this.mass);
          this._body.useGravity = true;
          this._body.allowSleep = true;
          this._body.linearDamping = this.linearDamping;
          this._body.angularDamping = this.angularDamping;

          this._body.setGroup((_crd && PhysicsGroup === void 0 ? (_reportPossibleCrUseOfPhysicsGroup({
            error: Error()
          }), PhysicsGroup) : PhysicsGroup).ITEM);

          this._body.wakeUp();

          this._state = ItemRuntimeState.Dynamic;
          return true;
        }
        /** Ignore Ground/Item collision while falling through the visual hole. */


        beginFalling(initialVelocity) {
          if (this._state === ItemRuntimeState.Consumed) {
            return;
          }

          if (this._state === ItemRuntimeState.Dormant) {
            this.activateDynamic();
          }

          if (!this._body) {
            return;
          }

          this._state = ItemRuntimeState.Falling;
          this._body.enabled = true;
          this._body.type = ERigidBodyType.DYNAMIC;

          this._body.setGroup((_crd && PhysicsGroup === void 0 ? (_reportPossibleCrUseOfPhysicsGroup({
            error: Error()
          }), PhysicsGroup) : PhysicsGroup).FALLING_ITEM);

          for (var i = 0; i < this._colliders.length; i++) {
            this._colliders[i].setGroup((_crd && PhysicsGroup === void 0 ? (_reportPossibleCrUseOfPhysicsGroup({
              error: Error()
            }), PhysicsGroup) : PhysicsGroup).FALLING_ITEM);
          }

          this._body.setLinearVelocity(initialVelocity);

          this._body.wakeUp();
        }

        setFallingVelocity(value) {
          if (this._state !== ItemRuntimeState.Falling || !this._body) {
            return;
          }

          this._body.setLinearVelocity(value);
        }

        getLinearVelocity(out) {
          if (!this._body || !this._body.enabled) {
            out.set(0, 0, 0);
            return out;
          }

          this._body.getLinearVelocity(out);

          return out;
        }

        markConsumed() {
          if (this._state === ItemRuntimeState.Consumed) {
            return;
          }

          this._state = ItemRuntimeState.Consumed;

          if (this._body) {
            this._body.clearVelocity();

            this._body.clearForces();

            this._body.enabled = false;
          }

          for (var i = 0; i < this._colliders.length; i++) {
            this._colliders[i].enabled = false;
          }

          this.node.active = false;
        }

        canFreeze(speedThreshold) {
          if (this._state !== ItemRuntimeState.Dynamic || !this._body) {
            return false;
          }

          this.getLinearVelocity(this._velocity);
          return this._velocity.lengthSqr() <= speedThreshold * speedThreshold;
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "itemId", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return '';
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "requiredHoleLevel", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "consumeValue", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "consumeRadius", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.18;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "mass", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.7;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "linearDamping", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.12;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "angularDamping", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.08;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=ItemRuntime.js.map