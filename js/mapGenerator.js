// MAP GENERATION
const tileRules = {
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
const objectsRules = {
  3: {
    bottom: [8],
  },
  4: {
    bottom: [9],
  },
  // 8: {
  //   top: [3],
  // },
  // 9: {
  //   top: [4],
  // },
  13: {
    bottom: [18],
  },
  // 18: {
  //   top: [13],
  // },
  14: {},
  19: {},
  22: {},
  23: {},
  24: {},
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
   * @type {({tile:keyof (typeof tileRules);object?:{tile:keyof (typeof objectsRules)}|null}| null)[][]}
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
        let a = [...validTiles];
        // debugger;
        validTiles = validTiles.filter((tile) =>
          tileRules[tile].top.includes(topTile.tile)
        );
        // if (!validTiles.length) {
        // }
      }

      // Check tile to the left
      if (x > 0) {
        const leftTile = map[y][x - 1];
        let a = [...validTiles];
        // debugger;
        validTiles = validTiles.filter((tile) => {
          return tileRules[tile].left.includes(leftTile.tile);
        });
        // if (!validTiles.length) {
        // }
      }

      // Randomly select a valid tile
      const randomTile =
        validTiles[Math.floor(Math.random() * validTiles.length)];

      // Handle objects tiles
      if (!map[y][x].object && Math.random() < 0.3) {
        let validObjectTiles = Object.keys(objectsRules).map(Number);
        map[y][x].object = {
          tile: validObjectTiles[
            Math.floor(Math.random() * validObjectTiles.length)
          ],
        };
        // Check if you need to complete the object in the bottom tile
        if (objectsRules[map[y][x].object.tile].bottom && map[y + 1]) {
          map[y + 1][x].object = {
            tile: objectsRules[map[y][x].object.tile].bottom[
              Math.floor(
                Math.random() *
                  objectsRules[map[y][x].object.tile].bottom.length
              )
            ],
          };
        }
      }
      map[y][x].tile = randomTile;
    }
  }

  return map;
}

/**
 *
 * @param {({tile:keyof (typeof tileRules);object?:{tile:keyof (typeof objectsRules)}|null}| null)[][]} map
 * @param {number} rows The source rows
 * @param {number} columns The source columns
 * @returns The map with the values from the source
 */
export function getSourceFromMap(map, rows, columns) {
  const objects = {
    /**
     * @type {{row: number,col: number,tile: [number,number]}[]}
     */
    layer1: [],
    /**
     * @type {{row: number,col: number,tile: [number,number]}[]}
     */
    layer2: [],
  };
  return {
    ground: map.map((row, i) =>
      row.map((target, j) => {
        if (target.object) {
          if (objectsRules[target.object.tile]) {
            objects.layer1.push({
              row: i,
              col: j,
              tile: [
                target.object.tile % columns,
                Math.floor(target.object.tile / rows),
              ],
            });
          } else {
            objects.layer2.push({
              row: i,
              col: j,
              tile: [
                target.object.tile % columns,
                Math.floor(target.object.tile / rows),
              ],
            });
          }
        }
        // return {
        //   ground: [target.tile % columns, Math.floor(target.tile / rows)],
        //   ...(target.object ? { object: {tile: [target.object.tile % columns, Math.floor(target.object.tile / rows)]} } : {}),
        // };
        return [target.tile % columns, Math.floor(target.tile / rows)];
      })
    ),
    objects,
  };
}
