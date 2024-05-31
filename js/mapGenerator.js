import { ObjectTree } from "./ObjectClass.js";
import { getObjectKeysASNumbers, getRandomValueFromArray } from "./utils.js";

// MAP GENERATION
export const tileRules = {
  0: {
    top: [10, 11, 12, 17],
    bottom: [5, 10, 21],
    right: [1, 2, 21],
    left: [2, 7, 12, 17],
  },
  1: {
    top: [10, 11, 12, 17],
    bottom: [6, 11, 15, 16],
    right: [1, 2, 21],
    left: [0, 1, 20],
  },
  2: {
    top: [10, 11, 12, 17],
    bottom: [7, 12, 20],
    right: [0, 5, 10, 17],
    left: [0, 1, 20],
  },
  5: {
    top: [0, 5, 16],
    bottom: [5, 10, 21],
    right: [6, 7, 15, 20],
    left: [2, 7, 12, 17],
  },
  6: {
    top: [1, 6, 20, 21],
    bottom: [6, 11, 15, 16],
    right: [6, 7, 15, 20],
    left: [5, 6, 16, 21],
  },
  7: {
    top: [2, 7, 15],
    bottom: [7, 12, 20],
    right: [0, 5, 10, 17],
    left: [5, 6, 16, 21],
  },
  10: {
    top: [0, 5, 16],
    bottom: [0, 1, 2, 17],
    right: [11, 16],
    left: [2, 7, 12, 17],
  },
  11: {
    top: [1, 6, 20, 21],
    bottom: [0, 1, 2, 17],
    right: [11, 16],
    left: [10, 11, 15],
  },
  12: {
    top: [2, 7, 15],
    bottom: [0, 1, 2, 17],
    right: [0, 5, 10, 17],
    left: [10, 11, 15],
  },
  15: {
    top: [1, 6, 20, 21],
    bottom: [7, 12, 20],
    right: [11, 16],
    left: [5, 6, 16, 21],
  },
  16: {
    top: [1, 6, 20, 21],
    bottom: [5, 10, 21],
    right: [6, 7, 15, 20],
    left: [10, 11, 15],
  },
  17: {
    top: [10, 11, 12, 17],
    bottom: [0, 1, 2, 17],
    right: [0, 5, 10, 17],
    left: [2, 7, 12, 17],
  },
  20: {
    top: [2, 7, 15],
    bottom: [6, 11, 15, 16],
    right: [1, 2, 21],
    left: [5, 6, 16, 21],
  },
  21: {
    top: [0, 5, 16],
    bottom: [6, 11, 15, 16],
    right: [6, 7, 15, 20],
    left: [0, 1, 20],
  },
};
// const objectsRules = {
//   3: {
//     bottom: [8],
//   },
//   4: {
//     bottom: [9],
//   },
//   // 8: {
//   //   top: [3],
//   // },
//   // 9: {
//   //   top: [4],
//   // },
//   13: {
//     bottom: [18],
//   },
//   // 18: {
//   //   top: [13],
//   // },
//   14: {},
//   19: {},
//   22: {},
//   23: {},
//   24: {},
// };

export const objectsRules = {
  0: [0, 1, 2],
  1: [0, 1, 2],
  2: [0, 1, 2],
  3: [0, 1, 2],
  4: [0, 1, 2],
  5: [0, 1, 2],
  6: [0, 1, 2],
  7: [0, 1, 2],
  8: [0, 1, 2],
};
const specialTiles = {
  3: {
    bottom: [8],
  },
  4: {
    bottom: [9],
  },
  18: {
    bottom: [23],
  },
  19: {
    bottom: [24],
  },
};
export function generateRandomMap(width, height) {
  /**
   * @type {import("./types").TStepMap}
   */
  const map = Array.from({ length: height }, () =>
    Array(width)
      .fill(null)
      .map((_) => ({
        tile: null,
      }))
  );
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (typeof map[y][x].tile == "number") {
        continue;
      }
      let validTiles = Object.keys(tileRules).map(Number);

      // Check tile above
      if (y > 0) {
        const topTile = map[y - 1][x];
        validTiles = validTiles.filter((tile) =>
          tileRules[tile].top.includes(topTile.tile)
        );
      }

      // Check tile to the left
      if (x > 0) {
        const leftTile = map[y][x - 1];
        let a = [...validTiles];
        // debugger;
        validTiles = validTiles.filter((tile) => {
          return tileRules[tile].left.includes(leftTile.tile);
        });
      }

      // Randomly select a valid tile
      const randomTile =
        validTiles[Math.floor(Math.random() * validTiles.length)];

      // Handle objects tiles
      if (!map[y][x].object && Math.random() < 0.3) {
        let validObjectTiles = getObjectKeysASNumbers(objectsRules);
        /**
         * @type {keyof typeof objectsRules}
         */
        const randomObjType = getRandomValueFromArray(validObjectTiles)
        map[y][x].object = {
          type: randomObjType,
          age: objectsRules[randomObjType][
            Math.floor(Math.random() * objectsRules[randomObjType].length)
          ],
        };
      }
      map[y][x].tile = randomTile;
    }
  }

  return map;
}

/**
 *
 * @param {import("./types").TStepMap} map
 * @param {number} rows The source rows
 * @param {number} columns The source columns
 * @param {import("./types").ObjectGenerator} objectGenerator The function that will handle generating the objects
 * @returns The map with the values from the source
 */
export function getSourceFromMap(map, rows, columns, objectGenerator) {
  const objects = {
    /**
     * @type {{row: number,col: number,object: {type: 0 | 5 | 1 | 2 | 7 | 6 | 3 | 4 | 8;age: 0 | 1 | 2;}}[]}
     */
    layer1: [],
    /**
     * @type {({row:number,col:number,object:ObjectTree})[]}
     */
    layer2: [],
  };
  /**
   * @type {ObjectTree}
   */
  let newObj = null;
  return {
    ground: map.map((row, i) =>
      row.map((target, j) => {
        if (target.object) {
          newObj = objectGenerator({
            row: i,
            col: j,
            object: target.object
          });
            objects.layer2.push({
              row: i,
              col: j,
              object: newObj,
            });
        }
        return {
          tile: getSourceFromTileNumber(target.tile, rows, columns),
          objects: newObj ? [newObj] : [],
        };
      })
    ),
    objects,
  };
}

/**
 *
 * @param {number} tile
 * @param {number} rows
 * @param {number} columns
 * @returns
 */
export function getSourceFromTileNumber(tile, rows, columns) {
  return [tile % columns, Math.floor(tile / rows)];
}
