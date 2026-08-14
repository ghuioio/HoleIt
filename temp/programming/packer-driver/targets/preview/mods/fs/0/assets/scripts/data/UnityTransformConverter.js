System.register(["__unresolved_0", "cc"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, _decorator, Component, Quat, Vec3, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _temp, _crd, ccclass, property, UnityTransformConverter;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfLevelVec3Data(extras) {
    _reporterNs.report("LevelVec3Data", "./LevelDataTypes", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      Quat = _cc.Quat;
      Vec3 = _cc.Vec3;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "79dc8+/Fp1OU4mcdBBmb2ld", "UnityTransformConverter", undefined);

      ({
        ccclass,
        property
      } = _decorator);

      _export("UnityTransformConverter", UnityTransformConverter = (_dec = ccclass('UnityTransformConverter'), _dec2 = property({
        tooltip: 'Global multiplier applied to Unity position data. Start at 0.1 and tune against the demo.'
      }), _dec3 = property({
        tooltip: 'Mirror the Unity X axis.'
      }), _dec4 = property({
        tooltip: 'Mirror the Unity Z axis. Toggle this first if the imported level looks mirrored.'
      }), _dec5 = property({
        tooltip: 'Swap Unity X/Z before mirroring. Leave off unless the layout is rotated/transposed.'
      }), _dec6 = property({
        tooltip: 'Additional world X offset after conversion.'
      }), _dec7 = property({
        tooltip: 'Additional world Y offset after conversion.'
      }), _dec8 = property({
        tooltip: 'Additional world Z offset after conversion.'
      }), _dec9 = property({
        tooltip: 'Additional Euler X rotation applied to every item.'
      }), _dec10 = property({
        tooltip: 'Additional Euler Y rotation applied to every item.'
      }), _dec11 = property({
        tooltip: 'Additional Euler Z rotation applied to every item.'
      }), _dec(_class = (_class2 = (_temp = class UnityTransformConverter extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "positionScale", _descriptor, this);

          _initializerDefineProperty(this, "flipX", _descriptor2, this);

          _initializerDefineProperty(this, "flipZ", _descriptor3, this);

          _initializerDefineProperty(this, "swapXZ", _descriptor4, this);

          _initializerDefineProperty(this, "offsetX", _descriptor5, this);

          _initializerDefineProperty(this, "offsetY", _descriptor6, this);

          _initializerDefineProperty(this, "offsetZ", _descriptor7, this);

          _initializerDefineProperty(this, "rotationOffsetX", _descriptor8, this);

          _initializerDefineProperty(this, "rotationOffsetY", _descriptor9, this);

          _initializerDefineProperty(this, "rotationOffsetZ", _descriptor10, this);
        }

        convertPosition(source, out) {
          var x = source.x;
          var z = source.z;

          if (this.swapXZ) {
            var temp = x;
            x = z;
            z = temp;
          }

          if (this.flipX) {
            x = -x;
          }

          if (this.flipZ) {
            z = -z;
          }

          out.set(x * this.positionScale + this.offsetX, source.y * this.positionScale + this.offsetY, z * this.positionScale + this.offsetZ);
          return out;
        }

        convertEuler(source, out) {
          // Mirroring a coordinate axis also changes the handedness of rotations.
          // These rules are intentionally exposed through flip/swap settings so the
          // final orientation can be tuned visually against HM's Unity demo.
          var rx = source.x;
          var ry = source.y;
          var rz = source.z;

          if (this.swapXZ) {
            var temp = rx;
            rx = rz;
            rz = temp;
          }

          if (this.flipX) {
            ry = -ry;
            rz = -rz;
          }

          if (this.flipZ) {
            rx = -rx;
            ry = -ry;
          }

          out.set(rx + this.rotationOffsetX, ry + this.rotationOffsetY, rz + this.rotationOffsetZ);
          return out;
        }

        convertRotation(source, out) {
          var euler = new Vec3();
          this.convertEuler(source, euler);
          Quat.fromEuler(out, euler.x, euler.y, euler.z);
          return out;
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "positionScale", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.1;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "flipX", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return false;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "flipZ", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return false;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "swapXZ", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return false;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "offsetX", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "offsetY", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "offsetZ", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "rotationOffsetX", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "rotationOffsetY", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "rotationOffsetZ", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=UnityTransformConverter.js.map