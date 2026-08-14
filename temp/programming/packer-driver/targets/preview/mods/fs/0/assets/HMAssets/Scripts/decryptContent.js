System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, _crd, simpleDecryptContent;

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "afdb8vUbvBAlotgXn+ucuLF", "decryptContent", undefined);

      simpleDecryptContent = function simpleDecryptContent(text, charShift, numberShift) {
        if (charShift === void 0) {
          charShift = 5;
        }

        if (numberShift === void 0) {
          numberShift = 3;
        }

        var result = '';

        for (var i = 0; i < text.length; i++) {
          var c = text[i];

          if (/[a-zA-Z]/.test(c)) {
            var offset = c === c.toUpperCase() ? 'A'.charCodeAt(0) : 'a'.charCodeAt(0);
            result += String.fromCharCode((c.charCodeAt(0) - charShift - offset - i % 10 + 26) % 26 + offset);
          } else if (/\d/.test(c)) {
            var num = c.charCodeAt(0) - '0'.charCodeAt(0);
            result += String.fromCharCode((num - numberShift + 10) % 10 + '0'.charCodeAt(0));
          } else {
            result += c;
          }
        }

        return result;
      };

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=decryptContent.js.map