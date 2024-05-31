import { Game } from "./Game.js";
import { ObjectTree } from "./ObjectClass.js";
import { Player } from "./Player.js";
import { LinkedList } from "./customList.js";
import { generateRandomMap, getSourceFromMap } from "./mapGenerator.js";

const BASE_TILE = 64;
const mapSizeTimesWindow = 2;

export class Map {
  /**
   *
   * @param {Game} game
   */
  constructor(game) {
    this.game = game;
    // this.cols = Math.ceil(this.game.w / BASE_TILE) * mapSizeTimesWindow;
    // this.rows = Math.ceil(this.game.h / BASE_TILE) * mapSizeTimesWindow;
    // this.cols = 50;
    // this.rows = 30;
    this.cols = 75;
    this.rows = 50;
    this.tileSize = this.game.baseTileSize;
    /**
     * @type {HTMLImageElement}
     */
    this.image = document.getElementById("tilemap1");
    this.imageTile = 32;
    this.imageCols = this.image.width / this.imageTile;
    this.imageRows = this.image.height / this.imageTile;
    this.w = this.cols * this.tileSize;
    this.h = this.rows * this.tileSize;
    this.fillObjKeySizeX = `${this.w}`.length;
    this.fillObjKeySizeY = `${this.h}`.length;

    /**
     * @type {import("./types.js").TLinkedList<Player|ObjectTree>}
     */
    this.objects = new LinkedList();
    /**
     * @type {import("./types.js").MapGroundType}
     */
    this.ground = [];
    this.generateMap();
    // this.obj = Array(1000)
    //   .fill("")
    //   .map((_) => new ObjectTree(game, { rootX: 0, rootY: 0 }));
  }
  resize(newTileSizeRatio) {
    // this.cols = Math.ceil(this.game.w / BASE_TILE) * mapSizeTimesWindow;
    // this.rows = Math.ceil(this.game.h / BASE_TILE) * mapSizeTimesWindow;
    this.tileSize = this.game.baseTileSize;
    this.w = this.cols * this.tileSize;
    this.h = this.rows * this.tileSize;
    this.fillObjKeySizeX = `${this.w}`.length;
    this.fillObjKeySizeY = `${this.h}`.length;

    this.ground = this.ground.map((r, row) =>
      r.map((c, col) => {
        return {
          ...c,
          tile: {
            sx: c.tile.sx,
            sy: c.tile.sy,
            dx: c.tile.dx * newTileSizeRatio,
            dy: c.tile.dy * newTileSizeRatio,
          },
        };
      })
    );
    let obj = this.objects.head;

    // First layer (hard)
    while (obj.next) {
      obj.value.resize(newTileSizeRatio);
      obj.index = this.getObjKeyFromPosition(obj.value.rootX, obj.value.rootY);
      obj = obj.next;
    }
  }
  generateMap() {
    // const savedMap = 
    const { ground, objects } = getSourceFromMap(
      generateRandomMap(this.cols, this.rows),
      this.image.height / this.imageTile,
      this.image.width / this.imageTile,
      (objectData) => {
        return new ObjectTree(this.game, {
          rootX: objectData.col * this.tileSize + this.tileSize * .5,
          rootY: objectData.row * this.tileSize + this.tileSize * .5,
          age: objectData.object.age,
          type: objectData.object.type,
        });
      }
    );
    this.ground = ground.map((r, row) =>
      r.map((c, col) => {
        return {
          objects: c.objects,
          tile: {
            sx: c.tile[0] * this.imageTile,
            sy: c.tile[1] * this.imageTile,
            dx: col * this.tileSize,
            dy: row * this.tileSize,
          },
        };
      })
    );
    this.generateObjects(objects);
  }

  /**
   *
   * @param {import("./types.js").TStepObjects} objects
   */
  generateObjects(objects) {
    this.objects.clear();

    this.fillObjKeySizeX = `${this.w}`.length;
    this.fillObjKeySizeY = `${this.h}`.length;
    for (let i = 0; i < objects.layer2.length; i++) {
      const obj = objects.layer2[i];
      this.objects.insertAfter(
        this.getObjKeyFromPosition(obj.object.rootX, obj.object.rootY),
        obj.object
      );
    }

    if (this.game.player) {
      this.game.player.objNode = this.objects.insertAfter(
        this.game.player.objAnchor,
        this.game.player
      );
    }
  }
  render() {
    this.drawGround();
    this.drawObjects();
  }
  debug() {
    this.drawGround();
    this.drawObjectsWithDebug();
  }
  drawGround() {
    for (
      let row = this.game.camera.startRow;
      row < this.game.camera.endRow;
      row++
    ) {
      for (
        let column = this.game.camera.startCol;
        column < this.game.camera.endCol;
        column++
      ) {
        const tile = this.getGroundTile(row, column);
        this.game.draw(
          this.image,
          tile.sx,
          tile.sy,
          tile.dx,
          tile.dy,
          this.imageTile
        );
      }
    }
  }
  drawObjects() {
    let obj = this.objects.head;
    let dx = 0;
    let dy = 0;
    // First layer (hard)
    while (obj) {
      dx = obj.value.x + this.game.camera.x;
      dy = obj.value.y + this.game.camera.y;
      if (
        !(
          dx > this.game.w ||
          dx < -1 * obj.value.dw ||
          dy > this.game.h ||
          dy < -1 * obj.value.dh
        )
      ) {
        obj.value.render(dx, dy);
      }
      obj = obj.next;
    }
    // Second layer (soft)

    this.game.ctx.save();
    dx = this.game.player.x + this.game.camera.x;
    dy = this.game.player.y + this.game.camera.y;
    this.game.ctx.globalAlpha = 0.5;
    this.game.player.render(dx, dy);
    this.game.ctx.restore();
  }
  drawObjectsWithDebug() {
    let obj = this.objects.head;
    let dx = 0;
    let dy = 0;
    // First layer (hard)
    while (obj) {
      dx = obj.value.x + this.game.camera.x;
      dy = obj.value.y + this.game.camera.y;
      if (
        !(
          dx > this.game.w ||
          dx < -1 * obj.value.dw ||
          dy > this.game.h ||
          dy < -1 * obj.value.dh
        )
      ) {
        obj.value.debug(dx, dy);
      }
      obj = obj.next;
    }

    // Second layer (soft)
    this.game.ctx.save();
    dx = this.game.player.x + this.game.camera.x;
    dy = this.game.player.y + this.game.camera.y;
    this.game.ctx.globalAlpha = 0.5;
    this.game.player.debug(dx, dy);
    this.game.ctx.restore();
  }
  /**
   * Get the tile from the map using the current row & column
   * @param {number} row The row you are targetting
   * @param {number} column The column you are targetting
   * @returns The corresponding position in the game map
   */
  getGroundTile(row, column) {
    return this.ground[row][column].tile;
  }

  /**
   *
   * @param {number} x
   * @param {number} y
   * @returns {keyof typeof this.objects}
   */
  getObjKeyFromPosition(x, y) {
    return `${`${Math.round(y)}`.padStart(
      this.fillObjKeySizeY
    )}:${`${Math.round(x)}`.padStart(this.fillObjKeySizeX)}`;
  }
}
