System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, _decorator, Component, Node, UITransform, Vec2, Vec3, GameEvent, gameEvents, _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _temp, _crd, ccclass, property, JoystickInput;

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
      Node = _cc.Node;
      UITransform = _cc.UITransform;
      Vec2 = _cc.Vec2;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      GameEvent = _unresolved_2.GameEvent;
      gameEvents = _unresolved_2.gameEvents;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "d6aa95kQPFED6/4UGViAK42", "JoystickInput", undefined);

      ({
        ccclass,
        property
      } = _decorator);

      _export("JoystickInput", JoystickInput = (_dec = ccclass('JoystickInput'), _dec2 = property({
        type: Node,
        tooltip: 'Joystick handle child node.'
      }), _dec3 = property({
        tooltip: 'Maximum handle radius in UI pixels.'
      }), _dec4 = property({
        tooltip: 'Ignore tiny movement around the center.'
      }), _dec(_class = (_class2 = (_temp = class JoystickInput extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "handle", _descriptor, this);

          _initializerDefineProperty(this, "radius", _descriptor2, this);

          _initializerDefineProperty(this, "deadZone", _descriptor3, this);

          _defineProperty(this, "_direction", new Vec2());

          _defineProperty(this, "_uiPos", new Vec2());

          _defineProperty(this, "_uiWorld", new Vec3());

          _defineProperty(this, "_localPos", new Vec3());

          _defineProperty(this, "_touchId", -1);

          _defineProperty(this, "_sentFirstInput", false);
        }

        getDirection(out) {
          out.set(this._direction.x, this._direction.y);
          return out;
        }

        onEnable() {
          this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
          this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
          this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
          this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        }

        onDisable() {
          this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
          this.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
          this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
          this.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
          this.resetJoystick();
        }

        onTouchStart(event) {
          if (this._touchId !== -1) {
            return;
          }

          const id = event.getID();
          this._touchId = id === null ? 0 : id;
          this.updateFromTouch(event);
          this.trySendFirstInput();
          event.propagationStopped = true;
        }

        onTouchMove(event) {
          const id = event.getID();
          const currentId = id === null ? 0 : id;

          if (currentId !== this._touchId) {
            return;
          }

          this.updateFromTouch(event);
          this.trySendFirstInput();
          event.propagationStopped = true;
        }

        onTouchEnd(event) {
          const id = event.getID();
          const currentId = id === null ? 0 : id;

          if (currentId !== this._touchId) {
            return;
          }

          this._touchId = -1;
          this.resetJoystick();
          event.propagationStopped = true;
        }

        updateFromTouch(event) {
          const uiTransform = this.getComponent(UITransform);

          if (!uiTransform) {
            return;
          }

          event.getUILocation(this._uiPos);

          this._uiWorld.set(this._uiPos.x, this._uiPos.y, 0);

          uiTransform.convertToNodeSpaceAR(this._uiWorld, this._localPos);
          let x = this._localPos.x;
          let y = this._localPos.y;
          const length = Math.sqrt(x * x + y * y);

          if (length > this.radius && length > 0.0001) {
            const scale = this.radius / length;
            x *= scale;
            y *= scale;
          }

          if (this.handle) {
            this.handle.setPosition(x, y, 0);
          }

          const normalizedX = this.radius > 0 ? x / this.radius : 0;
          const normalizedY = this.radius > 0 ? y / this.radius : 0;
          const normalizedLength = Math.sqrt(normalizedX * normalizedX + normalizedY * normalizedY);

          if (normalizedLength < this.deadZone) {
            this._direction.set(0, 0);

            return;
          }

          const invLength = normalizedLength > 1 ? 1 / normalizedLength : 1;

          this._direction.set(normalizedX * invLength, normalizedY * invLength);
        }

        trySendFirstInput() {
          if (this._sentFirstInput) {
            return;
          }

          if (this._direction.lengthSqr() <= this.deadZone * this.deadZone) {
            return;
          }

          this._sentFirstInput = true;
          (_crd && gameEvents === void 0 ? (_reportPossibleCrUseOfgameEvents({
            error: Error()
          }), gameEvents) : gameEvents).emit((_crd && GameEvent === void 0 ? (_reportPossibleCrUseOfGameEvent({
            error: Error()
          }), GameEvent) : GameEvent).FIRST_PLAYER_INPUT);
        }

        resetJoystick() {
          this._direction.set(0, 0);

          if (this.handle) {
            this.handle.setPosition(0, 0, 0);
          }
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "handle", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "radius", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 85;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "deadZone", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.08;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=JoystickInput.js.map