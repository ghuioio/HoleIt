System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, _decorator, Component, Node, Vec3, _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _temp, _crd, ccclass, property, CameraFollow;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      Node = _cc.Node;
      Vec3 = _cc.Vec3;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "12ca37Zye5BpJrxnjJnobYt", "CameraFollow", undefined);

      ({
        ccclass,
        property
      } = _decorator);

      _export("CameraFollow", CameraFollow = (_dec = ccclass('CameraFollow'), _dec2 = property({
        type: Node
      }), _dec3 = property({
        type: Vec3,
        tooltip: 'Camera offset from Hole.'
      }), _dec4 = property({
        tooltip: 'Higher = snappier follow.'
      }), _dec5 = property({
        tooltip: 'Look slightly above/below Hole center.'
      }), _dec(_class = (_class2 = (_temp = class CameraFollow extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "target", _descriptor, this);

          _initializerDefineProperty(this, "offset", _descriptor2, this);

          _initializerDefineProperty(this, "followSharpness", _descriptor3, this);

          _initializerDefineProperty(this, "lookHeight", _descriptor4, this);

          _defineProperty(this, "_targetPos", new Vec3());

          _defineProperty(this, "_desiredPos", new Vec3());

          _defineProperty(this, "_cameraPos", new Vec3());

          _defineProperty(this, "_lookPos", new Vec3());
        }

        lateUpdate(deltaTime) {
          if (!this.target) {
            return;
          }

          this.target.getWorldPosition(this._targetPos);
          Vec3.add(this._desiredPos, this._targetPos, this.offset);
          this.node.getWorldPosition(this._cameraPos);
          const t = this.followSharpness <= 0 ? 1 : 1 - Math.exp(-this.followSharpness * Math.min(deltaTime, 0.05));
          Vec3.lerp(this._cameraPos, this._cameraPos, this._desiredPos, t);
          this.node.setWorldPosition(this._cameraPos);

          this._lookPos.set(this._targetPos.x, this._targetPos.y + this.lookHeight, this._targetPos.z);

          this.node.lookAt(this._lookPos);
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "target", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "offset", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return new Vec3(0, 12, 8.5);
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "followSharpness", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 7;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "lookHeight", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.25;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=CameraFollow.js.map