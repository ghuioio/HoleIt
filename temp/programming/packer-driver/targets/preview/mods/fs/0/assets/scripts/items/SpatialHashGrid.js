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

      _cclegacy._RF.push({}, "802f3WCJtZDoZmFLTO82093", "SpatialHashGrid", undefined);

      /**
       * Spatial hash nhe cho cac item dung yen tren mat dat.
       * Item chi nam trong grid khi dang Idle. Khi bat dau bi an, ItemManager se remove no.
       */
      _export("SpatialHashGrid", SpatialHashGrid = class SpatialHashGrid {
        constructor(_cellSize) {
          _defineProperty(this, "_cells", new Map());

          _defineProperty(this, "_itemToCell", new Map());

          this._cellSize = _cellSize;
        }

        clear() {
          this._cells.clear();

          this._itemToCell.clear();
        }

        add(item) {
          var position = item.node.position;
          var key = this.makeKeyFromPosition(position.x, position.z);

          var bucket = this._cells.get(key);

          if (!bucket) {
            bucket = [];

            this._cells.set(key, bucket);
          }

          bucket.push(item);

          this._itemToCell.set(item, key);
        }

        remove(item) {
          var key = this._itemToCell.get(item);

          if (!key) {
            return;
          }

          var bucket = this._cells.get(key);

          if (bucket) {
            var index = bucket.indexOf(item);

            if (index >= 0) {
              bucket.splice(index, 1);
            }

            if (bucket.length === 0) {
              this._cells.delete(key);
            }
          }

          this._itemToCell.delete(item);
        }

        query(x, z, radius, out) {
          out.length = 0;
          var minCellX = Math.floor((x - radius) / this._cellSize);
          var maxCellX = Math.floor((x + radius) / this._cellSize);
          var minCellZ = Math.floor((z - radius) / this._cellSize);
          var maxCellZ = Math.floor((z + radius) / this._cellSize);

          for (var cellX = minCellX; cellX <= maxCellX; cellX++) {
            for (var cellZ = minCellZ; cellZ <= maxCellZ; cellZ++) {
              var bucket = this._cells.get(this.makeKey(cellX, cellZ));

              if (!bucket) {
                continue;
              }

              for (var i = 0; i < bucket.length; i++) {
                out.push(bucket[i]);
              }
            }
          }

          return out;
        }

        makeKeyFromPosition(x, z) {
          var cellX = Math.floor(x / this._cellSize);
          var cellZ = Math.floor(z / this._cellSize);
          return this.makeKey(cellX, cellZ);
        }

        makeKey(cellX, cellZ) {
          return cellX + ':' + cellZ;
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=SpatialHashGrid.js.map