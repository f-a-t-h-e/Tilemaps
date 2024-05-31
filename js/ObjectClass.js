import { Game } from "./Game.js";

export class ObjectClass {
  /**
   *
   * @param {Game} game
   * @param {import("./types.js").ObjectClassConstractorOptions} param1
   */
  constructor(game, { rootX, rootY, r, image, sx, sy, sw, sh, dw, dh, x, y }) {
    this.game = game;

    this.rootX = rootX;
    this.rootY = rootY;
    this.r = r;
    this.image = image;
    this.sx = sx;
    this.sy = sy;
    this.sw = sw;
    this.sh = sh;

    this.x = x;
    this.y = y;

    this.dw = dw;
    this.dh = dh;
  }

  render(dx,dy) {
    this.game.ctx.drawImage(
      this.image,
      this.sx,
      this.sy,
      this.sw,
      this.sh,

      dx,
      dy,

      this.dw,
      this.dh
    );
  }
  debug(dx,dy) {
    this.render(dx,dy);
    this.game.ctx.save();
    this.game.ctx.beginPath();
    this.game.ctx.arc(
      this.rootX + this.game.camera.x,
      this.rootY + this.game.camera.y,
      this.r,
      0,
      2 * Math.PI,
      false
    );
    this.game.ctx.fillStyle = "#0033004d"; // Fill color
    this.game.ctx.fill();
    this.game.ctx.lineWidth = 2; // Border width
    this.game.ctx.strokeStyle = "#003300"; // Border color
    this.game.ctx.stroke();
    this.game.ctx.restore();
  }
}

export class ObjectTree extends ObjectClass {
  static image = document.getElementById("trees1");
  static h = 78;
  static w = 78;
  static size = 2;
  static r = 0.25;
  /**
   *
   * @param {Game} game
   * @param {{type:0|1|2|3|4|5|6|7|8;age:0|1|2;rootX:number;rootY:number}} param1
   */
  constructor(game, { rootX, rootY, type = 0, age = 0 }) {
    let dw = 0;
    let dh = 0;
    if (ObjectTree.h > ObjectTree.w) {
      dw =
        game.baseTileSize * (ObjectTree.size * (ObjectTree.w / ObjectTree.h));
      dh = game.baseTileSize * ObjectTree.size;
    } else {
      dh =
        game.baseTileSize * (ObjectTree.size * (ObjectTree.h / ObjectTree.w));
      dw = game.baseTileSize * ObjectTree.size;
    }
    super(game, {
      rootX,
      rootY,
      image: ObjectTree.image,
      sx: age * ObjectTree.w,
      sy: type * ObjectTree.h,
      sw: ObjectTree.w,
      sh: ObjectTree.h,
      dw: dw,
      dh: dh,
      x: rootX - dw * 0.5,
      y: rootY - (dh - game.baseTileSize * ObjectTree.r),
      r: game.baseTileSize * ObjectTree.r,
    });
  }

  resize(newTileSizeRatio) {
    this.dw *= newTileSizeRatio;
    this.dh *= newTileSizeRatio;

    this.rootX *= newTileSizeRatio;
    this.rootY *= newTileSizeRatio;
    this.x  *= newTileSizeRatio;
    this.y  *= newTileSizeRatio
    this.r = this.game.baseTileSize * ObjectTree.r;
  }
}
