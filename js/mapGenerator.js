// MAP GENERATION
const tileRules = {
    0: {
      top: [8, 9, 10, 11, 12, 13, 14],
      bottom: [5, 10, 21],
      right: [1, 2, 21],
      left: [2, 3, 4, 7, 8, 9, 12, 13, 14],
    },
    1: {
      top: [8, 9, 10, 11, 12, 13, 14],
      bottom: [6, 11, 15, 16, 17, 18, 19, 22],
      right: [1, 2, 21],
      left: [0, 1, 20],
    },
    2: {
      top: [8, 9, 10, 11, 12, 13, 14],
      bottom: [7, 12, 20],
      right: [0, 3, 4, 5, 8, 9, 10, 13, 14],
      left: [0, 1, 20],
    },
    3: {
      top: [8, 9, 10, 11, 12, 13, 14],
      bottom: [8],
      right: [0, 3, 4, 5, 8, 9, 10, 13, 14],
      left: [2, 3, 4, 7, 8, 9, 12, 13, 14],
    },
    4: {
      top: [8, 9, 10, 11, 12, 13, 14],
      bottom: [9],
      right: [0, 3, 4, 5, 8, 9, 10, 13, 14],
      left: [2, 3, 4, 7, 8, 9, 12, 13, 14],
    },
    5: {
      top: [0, 5, 16],
      bottom: [5, 10, 21],
      right: [6, 7, 15, 17, 18, 19, 20, 22, 23, 24],
      left: [2, 3, 4, 7, 8, 9, 12, 13, 14],
    },
    6: {
      top: [1, 6, 17, 20, 21, 22, 23, 24],
      bottom: [6, 11, 15, 16, 17, 18, 19, 22],
      right: [6, 7, 15, 17, 18, 19, 20, 22, 23, 24],
      left: [5, 6, 16, 17, 18, 19, 21, 22, 23, 24],
    },
    7: {
      top: [2, 7, 15],
      bottom: [7, 12, 20],
      right: [0, 3, 4, 5, 8, 9, 10, 13, 14],
      left: [5, 6, 16, 17, 18, 19, 21, 22, 23, 24],
    },
    8: {
      top: [3],
      bottom: [0, 1, 2, 3, 4, 13, 14],
      right: [0, 3, 4, 5, 8, 9, 10, 13, 14],
      left: [2, 3, 4, 7, 8, 9, 12, 13, 14],
    },
    9: {
      top: [4],
      bottom: [0, 1, 2, 3, 4, 13, 14],
      right: [0, 3, 4, 5, 8, 9, 10, 13, 14],
      left: [2, 3, 4, 7, 8, 9, 12, 13, 14],
    },
    10: {
      top: [0, 5, 16],
      bottom: [0, 1, 2, 3, 4, 13, 14],
      right: [11, 16],
      left: [2, 3, 4, 7, 8, 9, 12, 13, 14],
    },
    11: {
      top: [1, 6, 17, 20, 21, 22, 23, 24],
      bottom: [0, 1, 2, 3, 4, 13, 14],
      right: [11, 16],
  
      left: [10, 11, 15],
    },
    12: {
      top: [2, 7, 15],
      bottom: [0, 1, 2, 3, 4, 13, 14],
      right: [0, 3, 4, 5, 8, 9, 10, 13, 14],
      left: [10, 11, 15],
    },
    13: {
      top: [8, 9, 10, 11, 12, 13, 14],
      bottom: [0, 1, 2, 3, 4, 13, 14],
      right: [0, 3, 4, 5, 8, 9, 10, 13, 14],
      left: [2, 3, 4, 7, 8, 9, 12, 13, 14],
    },
    14: {
      top: [8, 9, 10, 11, 12, 13, 14],
      bottom: [0, 1, 2, 3, 4, 13, 14],
      right: [0, 3, 4, 5, 8, 9, 10, 13, 14],
      left: [2, 3, 4, 7, 8, 9, 12, 13, 14],
    },
    15: {
      top: [1, 6, 17, 20, 21, 22, 23, 24],
      bottom: [7, 12, 20],
      right: [11, 16],
      left: [5, 6, 16, 17, 18, 19, 21, 22, 23, 24],
    },
    16: {
      top: [1, 6, 17, 20, 21, 22, 23, 24],
      bottom: [5, 10, 21],
      right: [6, 7, 15, 17, 18, 19, 20, 22, 23, 24],
      left: [10, 11, 15],
    },
    17: {
      top: [1, 6, 17, 20, 21, 22, 23, 24],
      bottom: [6, 11, 15, 16, 17, 18, 19, 22],
      right: [6, 7, 15, 17, 18, 19, 20, 22, 23, 24],
      left: [5, 6, 16, 17, 18, 19, 21, 22, 23, 24],
    },
    18: {
      top: [1, 6, 17, 20, 21, 22, 23, 24],
      bottom: [23],
      right: [6, 7, 15, 17, 18, 19, 20, 22, 23, 24],
      left: [5, 6, 16, 17, 18, 19, 21, 22, 23, 24],
    },
    19: {
      top: [1, 6, 17, 20, 21, 22, 23, 24],
      bottom: [24],
      right: [6, 7, 15, 17, 18, 19, 20, 22, 23, 24],
      left: [5, 6, 16, 17, 18, 19, 21, 22, 23, 24],
    },
    20: {
      top: [2, 7, 15],
      bottom: [6, 11, 15, 16, 17, 18, 19, 22],
      right: [1, 2, 21],
      left: [5, 6, 16, 17, 18, 19, 21, 22, 23, 24],
    },
    21: {
      top: [0, 5, 16],
      bottom: [6, 11, 15, 16, 17, 18, 19, 22],
      right: [6, 7, 15, 17, 18, 19, 20, 22, 23, 24],
      left: [0, 1, 20],
    },
    22: {
      top: [1, 6, 17, 20, 21, 22, 23, 24],
      bottom: [6, 11, 15, 16, 17, 18, 19, 22],
      right: [6, 7, 15, 17, 18, 19, 20, 22, 23, 24],
      left: [5, 6, 16, 17, 18, 19, 21, 22, 23, 24],
    },
    23: {
      top: [18],
      bottom: [6, 11, 15, 16, 17, 18, 19, 22],
      right: [6, 7, 15, 17, 18, 19, 20, 22, 23, 24],
      left: [5, 6, 16, 17, 18, 19, 21, 22, 23, 24],
    },
    24: {
      top: [19],
      bottom: [6, 11, 15, 16, 17, 18, 19, 22],
      right: [6, 7, 15, 17, 18, 19, 20, 22, 23, 24],
      left: [5, 6, 16, 17, 18, 19, 21, 22, 23, 24],
    },
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
  function generateRandomMap(width, height) {
    /**
     * @type {(keyof (typeof tileRules)| null)[][]}
     */
    const map = Array.from({ length: height }, () => Array(width).fill(null));
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (typeof map[y][x] == "number") {
          continue;
        }
        let validTiles = Object.keys(tileRules).map(Number);
        let a = [...validTiles];
        if (typeof map[y][x + 1] == "number") {
          const rightTile = map[y][x + 1];
          validTiles = validTiles.filter((tile) =>
            tileRules[tile].right.includes(rightTile)
          );
        }
        // Check tile above
        if (y > 0) {
          const topTile = map[y - 1][x];
          validTiles = validTiles.filter((tile) =>
            tileRules[tile].top.includes(topTile)
          );
        }
  
        // Check tile to the left
        if (x > 0) {
          const leftTile = map[y][x - 1];
          validTiles = validTiles.filter((tile) => {
            return tileRules[tile].left.includes(leftTile);
          });
        }
  
        // Randomly select a valid tile
        const randomTile =
          validTiles[Math.floor(Math.random() * validTiles.length)];
  
        map[y][x] = randomTile;
  
        // Handle special tiles
        if (specialTiles[randomTile]) {
          if (y + 1 < height) {
            const bottomTile =
              specialTiles[randomTile].bottom[
                [
                  Math.floor(
                    Math.random() * specialTiles[randomTile].bottom.length
                  ),
                ]
              ];
            map[y + 1][x] = bottomTile;
          }
        }
      }
    }
  
    return map;
  }
  
  /**
   *
   * @param {(keyof typeof tileRules)[][]} map
   * @param {number} rows The source rows
   * @param {number} columns The source columns
   * @returns The map with the values from the source
   */
  function getSourceFromMap(map, rows, columns) {
    return map.map((row) =>
      row.map((target) => {
        return [target % columns, Math.floor(target / rows)];
      })
    );
  }
  