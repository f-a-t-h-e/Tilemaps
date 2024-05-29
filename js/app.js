const GAME_DIMENTIONS = {
  set w(value) {
    this._tcn = Math.floor(value / 32) || 1;
    this._t = value / this._tcn;
    this._w = value;
  },
  /**
   * Width
   */
  get w() {
    return this._w;
  },
  /**
   * @private
   */
  _w: 160,

  set h(value) {
    this._trn = Math.ceil(value / this._t);
    this._h = value;
  },
  /**
   * Height
   */
  get h() {
    return this._h;
  },
  /**
   * @private
   */
  _h: 160,

  set t(value) {
    this._t = value;
  },
  /**
   * Tile
   */
  get t() {
    return this._t;
  },
  /**
   * @private
   */
  _t: 32,

  set trn(value) {
    this._trn = value;
  },
  /**
   * Tiles rows number
   */
  get trn() {
    return this._trn;
  },
  /**
   * @private
   */
  _trn: 160 / 32,

  set tcn(value) {
    this._tcn = value;
  },
  /**
   * Tiles columns number
   */
  get tcn() {
    return this._tcn;
  },
  /**
   * @private
   */
  _tcn: 160 / 32,

  cursorX: 0,
  cursorY: 0,
};

window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":
      e.preventDefault();
      GAME_DIMENTIONS.cursorY = Math.max(0, GAME_DIMENTIONS.cursorY - 1);
      break;
    case "ArrowDown":
      e.preventDefault();
      GAME_DIMENTIONS.cursorY = Math.min((GAME_DIMENTIONS.trn - 1) * GAME_DIMENTIONS.t, GAME_DIMENTIONS.cursorY + 1);
      break;
    case "ArrowLeft":
      e.preventDefault();
      GAME_DIMENTIONS.cursorX = Math.max(0, GAME_DIMENTIONS.cursorX - 1);
      break;
    case "ArrowRight":
      e.preventDefault();
      GAME_DIMENTIONS.cursorX = Math.min((GAME_DIMENTIONS.tcn - 1) * GAME_DIMENTIONS.t, GAME_DIMENTIONS.cursorX + 1);
      break;
  }
});

const GAME_SETTINGS = {
  set debuging(value) {
    draw = value ? drawDebug : drawNormal;
    this._dubugging = !!value;
  },
  get debuging() {
    return this._dubugging;
  },
  _dubugging: true,
};

let GAME_MAP = [
  [0, 1, 2, 3, 4],
  [5, 6, 7, 8, 9],
  [10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19],
  [20, 21, 22, 23, 24],
];

let draw = GAME_SETTINGS.debuging ? drawDebug : drawNormal;

window.addEventListener("load", async () => {
  /**
   * @type {HTMLCanvasElement}
   */
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");

  /**
   * @type {HTMLImageElement}
   */
  const TILE_IMAGE1 = document.getElementById("tilemap1");
  const IMAGE1_TILE = 32;

  resizeCanvas();
  GAME_DIMENTIONS.cursorX = ((GAME_DIMENTIONS.tcn - 1) * GAME_DIMENTIONS.t) / 2
  GAME_DIMENTIONS.cursorY = ((GAME_DIMENTIONS.trn - 1) * GAME_DIMENTIONS.t) / 2
  window.addEventListener("resize", resizeCanvas);

  document.getElementById("debug")?.addEventListener("click", (e) => {
    e.preventDefault();
    GAME_SETTINGS.debuging = !GAME_SETTINGS.debuging;
    reDrawMap();
  });

  function resizeCanvas() {
    GAME_DIMENTIONS.w = innerWidth;
    GAME_DIMENTIONS.h = innerHeight;
    canvas.width = GAME_DIMENTIONS.w;
    canvas.height = GAME_DIMENTIONS.h;
    GAME_MAP = getSourceFromMap(
      generateRandomMap(GAME_DIMENTIONS.tcn, GAME_DIMENTIONS.trn),
      TILE_IMAGE1.height / IMAGE1_TILE,
      TILE_IMAGE1.width / IMAGE1_TILE
    );

    //   This has to be set after each resize
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    reDrawMap();
  }
  function reDrawMap() {
    drawMap(ctx, TILE_IMAGE1, IMAGE1_TILE);
  }
});

/**
 *
 * @param {CanvasRenderingContext2D} ctx The canas context to use for drawing
 * @param {HTMLImageElement} image Source image to use for drawing
 * @param {number} sx Source image `x` position
 * @param {number} sy Source image `y` position
 * @param {number} dx Canvas `x` position
 * @param {number} dy Canvas `y` position
 * @param {number} imageTile Source image tile size
 */
function drawDebug(ctx, image, sx, sy, dx, dy, imageTile) {
  ctx.drawImage(
    image,
    sx * imageTile,
    sy * imageTile,
    imageTile,
    imageTile,
    dx * GAME_DIMENTIONS.t,
    dy * GAME_DIMENTIONS.t,
    GAME_DIMENTIONS.t,
    GAME_DIMENTIONS.t
  );
  ctx.strokeRect(
    dx * GAME_DIMENTIONS.t,
    dy * GAME_DIMENTIONS.t,
    GAME_DIMENTIONS.t,
    GAME_DIMENTIONS.t
  );
  //   ctx.save();
  //   ctx.fillStyle = "red";
  //   ctx.font = "20px Arial";
  //   ctx.textAlign = "center";
  //   ctx.textBaseline = "middle";
  //   ctx.fillText(
  //     dy * 5 + dx,
  //     dx * GAME_DIMENTIONS.t + 0.5 * GAME_DIMENTIONS.t,
  //     dy * GAME_DIMENTIONS.t + 0.5 * GAME_DIMENTIONS.t
  //     // GAME_DIMENTIONS.t,
  //   );
  //   ctx.restore();
}
/**
 *
 * @param {CanvasRenderingContext2D} ctx The canas context to use for drawing
 * @param {HTMLImageElement} image Source image to use for drawing
 * @param {number} sx Source image `x` position
 * @param {number} sy Source image `y` position
 * @param {number} dx Canvas `x` position
 * @param {number} dy Canvas `y` position
 * @param {number} imageTile Source image tile size
 */
function drawNormal(ctx, image, sx, sy, dx, dy, imageTile) {
  ctx.drawImage(
    image,
    sx * imageTile,
    sy * imageTile,
    imageTile,
    imageTile,
    dx * GAME_DIMENTIONS.t,
    dy * GAME_DIMENTIONS.t,
    GAME_DIMENTIONS.t,
    GAME_DIMENTIONS.t
  );
}

/**
 *
 * @param {CanvasRenderingContext2D} ctx The canas context to use for drawing
 * @param {HTMLImageElement} image Source image to use for drawing
 * @param {number} imageTile Source image tile size
 */
function drawMap(ctx, image, imageTile = GAME_DIMENTIONS.t) {
  for (let row = 0; row < GAME_DIMENTIONS.trn; row++) {
    for (let column = 0; column < GAME_DIMENTIONS.tcn; column++) {
      const tile = getGameTile(row, column);
      draw(ctx, image, tile[0], tile[1], column, row, imageTile);
    }
  }
}

/**
 * Get the tile from the map using the current row & column
 * @param {number} row The row you are targetting
 * @param {number} column The column you are targetting
 * @returns The corresponding position in the game map
 */
function getGameTile(row, column) {
  return GAME_MAP[row][column];
}
