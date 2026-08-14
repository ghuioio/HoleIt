System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, _crd, PhysicsGroup;

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "d3dedYGGLVHypCER0EPbfdZ", "PhysicsGroups", undefined);

      /**
       * These bit values must match Project Settings -> Physics -> Collision Matrix.
       * Group index 0 is DEFAULT. Create the following custom groups in this order:
       * 1 GROUND, 2 ITEM, 3 FALLING_ITEM, 4 HOLE.
       */
      _export("PhysicsGroup", PhysicsGroup = {
        DEFAULT: 1 << 0,
        GROUND: 1 << 1,
        ITEM: 1 << 2,
        FALLING_ITEM: 1 << 3,
        HOLE: 1 << 4
      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=PhysicsGroups.js.map