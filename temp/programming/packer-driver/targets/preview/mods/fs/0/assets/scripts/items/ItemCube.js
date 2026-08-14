System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, _decorator, Component, Vec3, _dec, _class, _temp, _crd, ccclass, ItemCubeState, ItemCube;

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  _export("ItemCubeState", void 0);

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      Vec3 = _cc.Vec3;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "c2eacrGbaJD0pbF+BnmJgGn", "ItemCube", undefined);

      ({
        ccclass
      } = _decorator);

      (function (ItemCubeState) {
        ItemCubeState[ItemCubeState["Idle"] = 0] = "Idle";
        ItemCubeState[ItemCubeState["Consuming"] = 1] = "Consuming";
        ItemCubeState[ItemCubeState["Consumed"] = 2] = "Consumed";
      })(ItemCubeState || _export("ItemCubeState", ItemCubeState = {}));

      _export("ItemCube", ItemCube = (_dec = ccclass('ItemCube'), _dec(_class = (_temp = class ItemCube extends Component {
        constructor() {
          super(...arguments);

          _defineProperty(this, "_state", ItemCubeState.Idle);

          _defineProperty(this, "_delay", 0);

          _defineProperty(this, "_elapsed", 0);

          _defineProperty(this, "_duration", 0.3);

          _defineProperty(this, "_startWorldPos", new Vec3());

          _defineProperty(this, "_targetWorldPos", new Vec3());

          _defineProperty(this, "_currentWorldPos", new Vec3());

          _defineProperty(this, "_startScale", new Vec3(1, 1, 1));

          _defineProperty(this, "_currentScale", new Vec3(1, 1, 1));
        }

        get state() {
          return this._state;
        }

        get isIdle() {
          return this._state === ItemCubeState.Idle;
        }

        prepareForUse() {
          this._state = ItemCubeState.Idle;
          this._delay = 0;
          this._elapsed = 0;
          this.node.active = true;
        }

        beginConsume(targetWorldPos, delay, duration) {
          if (this._state !== ItemCubeState.Idle) {
            return false;
          }

          this._state = ItemCubeState.Consuming;
          this._delay = Math.max(0, delay);
          this._elapsed = 0;
          this._duration = Math.max(0.05, duration);
          this.node.getWorldPosition(this._startWorldPos);

          this._targetWorldPos.set(targetWorldPos);

          this._startScale.set(this.node.scale);

          return true;
        }
        /**
         * Return true khi animation an item da ket thuc.
         * Ham nay duoc ItemManager goi tap trung, khong dung update() tren 1000 ItemCube.
         */


        tickConsume(deltaTime) {
          if (this._state !== ItemCubeState.Consuming) {
            return false;
          }

          if (this._delay > 0) {
            this._delay -= deltaTime;
            return false;
          }

          this._elapsed += deltaTime;
          var t = Math.min(1, this._elapsed / this._duration); // Roi nhanh dan vao tam Hole.

          var eased = t * t * t;
          Vec3.lerp(this._currentWorldPos, this._startWorldPos, this._targetWorldPos, eased);
          this.node.setWorldPosition(this._currentWorldPos); // Nho lai o nua sau animation de cam giac bi hut xuong lo.

          var shrinkT = Math.max(0, (t - 0.5) / 0.5);
          var scaleFactor = 1 - shrinkT * 0.8;

          this._currentScale.set(this._startScale.x * scaleFactor, this._startScale.y * scaleFactor, this._startScale.z * scaleFactor);

          this.node.setScale(this._currentScale);

          if (t < 1) {
            return false;
          }

          this._state = ItemCubeState.Consumed;
          this.node.active = false;
          return true;
        }

      }, _temp)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=ItemCube.js.map