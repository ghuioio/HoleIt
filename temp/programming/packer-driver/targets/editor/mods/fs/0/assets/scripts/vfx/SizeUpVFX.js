System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, _decorator, Component, Sprite, SpriteFrame, GameEvent, gameEvents, _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _temp, _crd, ccclass, property, SizeUpVFX;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfGameEvent(extras) {
    _reporterNs.report("GameEvent", "../core/GameEvents", _context.meta, extras);
  }

  function _reportPossibleCrUseOfgameEvents(extras) {
    _reporterNs.report("gameEvents", "../core/GameEvents", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      Sprite = _cc.Sprite;
      SpriteFrame = _cc.SpriteFrame;
    }, function (_unresolved_2) {
      GameEvent = _unresolved_2.GameEvent;
      gameEvents = _unresolved_2.gameEvents;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "7a34dm385xDKam3w9WxO5Cd", "SizeUpVFX", undefined);

      ({
        ccclass,
        property
      } = _decorator);

      _export("SizeUpVFX", SizeUpVFX = (_dec = ccclass('SizeUpVFX'), _dec2 = property({
        type: Sprite
      }), _dec3 = property({
        type: [SpriteFrame],
        tooltip: 'Assign vfx_sizeup_00000 ... 00022 in order.'
      }), _dec4 = property({
        tooltip: 'Frames per second.'
      }), _dec(_class = (_class2 = (_temp = class SizeUpVFX extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "sprite", _descriptor, this);

          _initializerDefineProperty(this, "frames", _descriptor2, this);

          _initializerDefineProperty(this, "fps", _descriptor3, this);

          _defineProperty(this, "_playing", false);

          _defineProperty(this, "_time", 0);

          _defineProperty(this, "_frame", 0);
        }

        onEnable() {
          (_crd && gameEvents === void 0 ? (_reportPossibleCrUseOfgameEvents({
            error: Error()
          }), gameEvents) : gameEvents).on((_crd && GameEvent === void 0 ? (_reportPossibleCrUseOfGameEvent({
            error: Error()
          }), GameEvent) : GameEvent).HOLE_LEVEL_UP, this.play, this);
        }

        onDisable() {
          (_crd && gameEvents === void 0 ? (_reportPossibleCrUseOfgameEvents({
            error: Error()
          }), gameEvents) : gameEvents).off((_crd && GameEvent === void 0 ? (_reportPossibleCrUseOfGameEvent({
            error: Error()
          }), GameEvent) : GameEvent).HOLE_LEVEL_UP, this.play, this);
        }

        start() {
          if (this.sprite) {
            this.sprite.node.active = false;
          }
        }

        update(dt) {
          if (!this._playing || !this.sprite || this.frames.length === 0) {
            return;
          }

          this._time += dt;
          const frameDuration = 1 / Math.max(1, this.fps);

          while (this._time >= frameDuration) {
            this._time -= frameDuration;
            this._frame++;

            if (this._frame >= this.frames.length) {
              this._playing = false;
              this.sprite.node.active = false;
              return;
            }

            this.sprite.spriteFrame = this.frames[this._frame];
          }
        }

        play() {
          if (!this.sprite || this.frames.length === 0) {
            return;
          }

          this._time = 0;
          this._frame = 0;
          this._playing = true;
          this.sprite.spriteFrame = this.frames[0];
          this.sprite.node.active = true;
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "sprite", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "frames", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "fps", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 24;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=SizeUpVFX.js.map