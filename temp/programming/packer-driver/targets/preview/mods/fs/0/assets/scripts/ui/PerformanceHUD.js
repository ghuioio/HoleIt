System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, _decorator, Component, Label, _dec, _dec2, _class, _class2, _descriptor, _descriptor2, _temp, _crd, ccclass, property, PerformanceHUD;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      Label = _cc.Label;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "827bf0cNEZEuoacBL7YqGvX", "PerformanceHUD", undefined);

      ({
        ccclass,
        property
      } = _decorator);

      _export("PerformanceHUD", PerformanceHUD = (_dec = ccclass('PerformanceHUD'), _dec2 = property({
        type: Label
      }), _dec(_class = (_class2 = (_temp = class PerformanceHUD extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "fpsLabel", _descriptor, this);

          _initializerDefineProperty(this, "refreshInterval", _descriptor2, this);

          _defineProperty(this, "_timer", 0);

          _defineProperty(this, "_frameCount", 0);
        }

        update(deltaTime) {
          this._timer += deltaTime;
          this._frameCount++;

          if (this._timer < this.refreshInterval) {
            return;
          }

          if (this.fpsLabel && this._timer > 0) {
            var fps = Math.round(this._frameCount / this._timer);
            this.fpsLabel.string = 'FPS: ' + fps;
          }

          this._timer = 0;
          this._frameCount = 0;
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "fpsLabel", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "refreshInterval", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.5;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=PerformanceHUD.js.map