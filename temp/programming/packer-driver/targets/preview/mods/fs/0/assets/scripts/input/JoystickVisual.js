System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, _decorator, Color, Component, Graphics, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _temp, _crd, ccclass, property, JoystickVisual;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      _decorator = _cc._decorator;
      Color = _cc.Color;
      Component = _cc.Component;
      Graphics = _cc.Graphics;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "80d55uuyRtP/LhFPY3j5TS6", "JoystickVisual", undefined);

      ({
        ccclass,
        property
      } = _decorator);

      _export("JoystickVisual", JoystickVisual = (_dec = ccclass('JoystickVisual'), _dec2 = property({
        type: Graphics
      }), _dec3 = property({
        type: Graphics
      }), _dec(_class = (_class2 = (_temp = class JoystickVisual extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "background", _descriptor, this);

          _initializerDefineProperty(this, "handleGraphics", _descriptor2, this);

          _initializerDefineProperty(this, "backgroundRadius", _descriptor3, this);

          _initializerDefineProperty(this, "handleRadius", _descriptor4, this);
        }

        start() {
          if (this.background) {
            this.background.clear();
            this.background.fillColor = new Color(255, 255, 255, 55);
            this.background.circle(0, 0, this.backgroundRadius);
            this.background.fill();
          }

          if (this.handleGraphics) {
            this.handleGraphics.clear();
            this.handleGraphics.fillColor = new Color(255, 255, 255, 150);
            this.handleGraphics.circle(0, 0, this.handleRadius);
            this.handleGraphics.fill();
          }
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "background", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "handleGraphics", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "backgroundRadius", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 90;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "handleRadius", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 38;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=JoystickVisual.js.map