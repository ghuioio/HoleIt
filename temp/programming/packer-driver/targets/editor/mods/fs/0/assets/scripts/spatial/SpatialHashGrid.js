System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, SpatialHashGrid, _crd;

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  _export("SpatialHashGrid", void 0);

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "4fe3aLqh11DLZFLVE1KSk0R", "SpatialHashGrid", undefined);

      /**
       * XZ spatial hash for dormant items. Dynamic items are removed from this grid
       * until they are frozen again, so the Hole never scans all 4k+ objects.
       */
      _export("SpatialHashGrid", SpatialHashGrid = class SpatialHashGrid {
        constructor(_cellSize) {
          _defineProperty(this, "_cells", new Map());

          _defineProperty(this, "_itemKeys", new Map());

          this._cellSize = _cellSize;
        }

        clear() {
          this._cells.clear();

          this._itemKeys.clear();
        }

        insert(item, position) {
          this.remove(item);
          const key = this.getKey(position.x, position.z);

          let cell = this._cells.get(key);

          if (!cell) {
            cell = new Set();

            this._cells.set(key, cell);
          }

          cell.add(item);

          this._itemKeys.set(item, key);
        }

        remove(item) {
          const key = this._itemKeys.get(item);

          if (key === undefined) {
            return;
          }

          const cell = this._cells.get(key);

          if (cell) {
            cell.delete(item);

            if (cell.size === 0) {
              this._cells.delete(key);
            }
          }

          this._itemKeys.delete(item);
        }

        query(position, radius, out) {
          out.length = 0;
          const minX = Math.floor((position.x - radius) / this._cellSize);
          const maxX = Math.floor((position.x + radius) / this._cellSize);
          const minZ = Math.floor((position.z - radius) / this._cellSize);
          const maxZ = Math.floor((position.z + radius) / this._cellSize);

          for (let x = minX; x <= maxX; x++) {
            for (let z = minZ; z <= maxZ; z++) {
              const cell = this._cells.get(`${x}:${z}`);

              if (!cell) {
                continue;
              }

              cell.forEach(item => out.push(item));
            }
          }
        }

        getKey(x, z) {
          return `${Math.floor(x / this._cellSize)}:${Math.floor(z / this._cellSize)}`;
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=SpatialHashGrid.js.map