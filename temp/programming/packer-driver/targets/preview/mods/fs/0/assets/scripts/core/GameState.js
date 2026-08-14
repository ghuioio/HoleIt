System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, _crd, GameState;

  _export("GameState", void 0);

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "d5b85ypS79BDYoPJAGlR0dr", "GameState", undefined);

      (function (GameState) {
        GameState[GameState["Boot"] = 0] = "Boot";
        GameState[GameState["Tutorial"] = 1] = "Tutorial";
        GameState[GameState["Playing"] = 2] = "Playing";
        GameState[GameState["Win"] = 3] = "Win";
        GameState[GameState["Lose"] = 4] = "Lose";
      })(GameState || _export("GameState", GameState = {}));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=GameState.js.map