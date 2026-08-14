System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, _decorator, Component, Node, Vec3, _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _temp, _crd, ccclass, property, TutorialPointerAnimator;

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

      _cclegacy._RF.push({}, "947b5i6hHdKkb00xA0D46r7", "TutorialPointerAnimator", undefined);

      ({
        ccclass,
        property
      } = _decorator);

      _export("TutorialPointerAnimator", TutorialPointerAnimator = (_dec = ccclass('TutorialPointerAnimator'), _dec2 = property({
        type: Node
      }), _dec3 = property({
        tooltip: 'Horizontal travel in UI pixels.'
      }), _dec4 = property({
        tooltip: 'Cycles per second.'
      }), _dec(_class = (_class2 = (_temp = class TutorialPointerAnimator extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "pointer", _descriptor, this);

          _initializerDefineProperty(this, "amplitude", _descriptor2, this);

          _initializerDefineProperty(this, "frequency", _descriptor3, this);

          _defineProperty(this, "_time", 0);

          _defineProperty(this, "_base", new Vec3());
        }

        onEnable() {
          this._time = 0;

          if (this.pointer) {
            this._base.set(this.pointer.position);
          }
        }

        update(dt) {
          if (!this.pointer) {
            return;
          }

          this._time += dt;
          const x = Math.sin(this._time * Math.PI * 2 * this.frequency) * this.amplitude;
          this.pointer.setPosition(this._base.x + x, this._base.y, this._base.z);
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "pointer", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "amplitude", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 80;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "frequency", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.8;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=TutorialPointerAnimator.js.map