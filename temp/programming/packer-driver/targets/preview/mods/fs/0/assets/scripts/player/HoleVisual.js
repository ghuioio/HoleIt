System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, _decorator, Component, Node, Vec3, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _temp, _crd, ccclass, property, HoleVisual;

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

      _cclegacy._RF.push({}, "111ffxVZfBJw5igoSdbPoMz", "HoleVisual", undefined);

      ({
        ccclass,
        property
      } = _decorator);

      _export("HoleVisual", HoleVisual = (_dec = ccclass('HoleVisual'), _dec2 = property({
        type: Node,
        tooltip: 'Child root containing the rim/black cylinder visual. Do not assign the movement root itself.'
      }), _dec3 = property({
        tooltip: 'Radius represented by scaleRoot scale = 1.'
      }), _dec(_class = (_class2 = (_temp = class HoleVisual extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "scaleRoot", _descriptor, this);

          _initializerDefineProperty(this, "baseRadius", _descriptor2, this);

          _defineProperty(this, "_baseScale", new Vec3(1, 1, 1));
        }

        onLoad() {
          if (this.scaleRoot) {
            this._baseScale.set(this.scaleRoot.scale);
          }
        }

        setRadius(radius) {
          if (!this.scaleRoot || this.baseRadius <= 0) {
            return;
          }

          var scale = radius / this.baseRadius;
          this.scaleRoot.setScale(this._baseScale.x * scale, this._baseScale.y, this._baseScale.z * scale);
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "scaleRoot", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "baseRadius", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1.0;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=HoleVisual.js.map