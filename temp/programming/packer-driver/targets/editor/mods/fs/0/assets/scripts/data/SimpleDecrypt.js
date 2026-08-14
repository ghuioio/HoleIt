System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, _crd;

  /**
   * Same decryption algorithm supplied in HM Games' asset package.
   * Kept isolated so it can be removed from the final build when using the
   * compact preprocessed level file.
   */
  function simpleDecryptContent(text, charShift = 5, numberShift = 3) {
    let result = '';

    for (let i = 0; i < text.length; i++) {
      const c = text[i];

      if (/[a-zA-Z]/.test(c)) {
        const offset = c === c.toUpperCase() ? 'A'.charCodeAt(0) : 'a'.charCodeAt(0);
        result += String.fromCharCode((c.charCodeAt(0) - charShift - offset - i % 10 + 26) % 26 + offset);
      } else if (/\d/.test(c)) {
        const num = c.charCodeAt(0) - '0'.charCodeAt(0);
        result += String.fromCharCode((num - numberShift + 10) % 10 + '0'.charCodeAt(0));
      } else {
        result += c;
      }
    }

    return result;
  }

  _export("simpleDecryptContent", simpleDecryptContent);

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "a594b3ajp1OQ5b9QgpuBiFX", "SimpleDecrypt", undefined);

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=SimpleDecrypt.js.map