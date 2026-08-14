System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, _decorator, Component, Vec2, Vec3, JoystickInput, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _temp, _crd, ccclass, property, HoleMovement;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfJoystickInput(extras) {
    _reporterNs.report("JoystickInput", "../input/JoystickInput", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      Vec2 = _cc.Vec2;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      JoystickInput = _unresolved_2.JoystickInput;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "cf33fg5uDVED4EL7PvihMhl", "HoleMovement", undefined);

      ({
        ccclass,
        property
      } = _decorator);

      _export("HoleMovement", HoleMovement = (_dec = ccclass('HoleMovement'), _dec2 = property({
        type: _crd && JoystickInput === void 0 ? (_reportPossibleCrUseOfJoystickInput({
          error: Error()
        }), JoystickInput) : JoystickInput
      }), _dec3 = property({
        tooltip: 'Maximum Hole speed in world units/second.'
      }), _dec4 = property({
        tooltip: 'Acceleration while the joystick is held.'
      }), _dec5 = property({
        tooltip: 'Deceleration after releasing the joystick.'
      }), _dec6 = property({
        tooltip: 'Enable when joystick-up visually moves the Hole down-screen.'
      }), _dec(_class = (_class2 = (_temp = class HoleMovement extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "joystick", _descriptor, this);

          _initializerDefineProperty(this, "moveSpeed", _descriptor2, this);

          _initializerDefineProperty(this, "acceleration", _descriptor3, this);

          _initializerDefineProperty(this, "deceleration", _descriptor4, this);

          _initializerDefineProperty(this, "invertZ", _descriptor5, this);

          _initializerDefineProperty(this, "minX", _descriptor6, this);

          _initializerDefineProperty(this, "maxX", _descriptor7, this);

          _initializerDefineProperty(this, "minZ", _descriptor8, this);

          _initializerDefineProperty(this, "maxZ", _descriptor9, this);

          _defineProperty(this, "inputEnabled", true);

          _defineProperty(this, "_input", new Vec2());

          _defineProperty(this, "_velocity", new Vec3());

          _defineProperty(this, "_position", new Vec3());
        }

        stopImmediately() {
          this._velocity.set(0, 0, 0);
        }

        update(deltaTime) {
          const dt = Math.min(deltaTime, 0.05);

          if (!this.joystick || !this.inputEnabled) {
            this._input.set(0, 0);
          } else {
            this.joystick.getDirection(this._input);
          }

          const targetVX = this._input.x * this.moveSpeed;
          const zSign = this.invertZ ? -1 : 1;
          const targetVZ = this._input.y * this.moveSpeed * zSign;
          const hasInput = this._input.lengthSqr() > 0.000001;
          const maxDelta = (hasInput ? this.acceleration : this.deceleration) * dt;
          this._velocity.x = this.moveTowards(this._velocity.x, targetVX, maxDelta);
          this._velocity.z = this.moveTowards(this._velocity.z, targetVZ, maxDelta);

          this._position.set(this.node.position);

          this._position.x += this._velocity.x * dt;
          this._position.z += this._velocity.z * dt;
          this._position.x = this.clamp(this._position.x, this.minX, this.maxX);
          this._position.z = this.clamp(this._position.z, this.minZ, this.maxZ);
          this.node.setPosition(this._position);
        }

        moveTowards(current, target, maxDelta) {
          const delta = target - current;

          if (Math.abs(delta) <= maxDelta) {
            return target;
          }

          return current + (delta > 0 ? maxDelta : -maxDelta);
        }

        clamp(value, min, max) {
          return Math.max(min, Math.min(max, value));
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "joystick", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "moveSpeed", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 6.5;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "acceleration", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 24;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "deceleration", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 30;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "invertZ", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "minX", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return -8;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "maxX", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 8;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "minZ", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return -8;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "maxZ", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 10;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=HoleMovement.js.map