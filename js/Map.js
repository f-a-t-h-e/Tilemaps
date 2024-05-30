import { Game } from "./Game.js";
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
    this.cols = Math.ceil(this.game.w / BASE_TILE) * mapSizeTimesWindow;
    this.rows = Math.ceil(this.game.h / BASE_TILE) * mapSizeTimesWindow;
    this.tileSize = 64;
    /**
     * @type {HTMLImageElement}
     */
    this.image = document.getElementById("tilemap1");
    this.imageTile = 32;
    this.imageCols = this.image.width / this.imageTile;
    this.imageRows = this.image.height / this.imageTile;
    this.w = this.cols * this.tileSize;
    this.h = this.rows * this.tileSize;
    this.generateMap();
  }
  resize(){
    this.cols = Math.ceil(this.game.w / BASE_TILE) * mapSizeTimesWindow;
    this.rows = Math.ceil(this.game.h / BASE_TILE) * mapSizeTimesWindow;
    this.w = this.cols * this.tileSize;
    this.h = this.rows * this.tileSize;
    this.generateMap()
  }
  generateMap() {
    const { ground, objects } = getSourceFromMap(
      generateRandomMap(this.cols, this.rows),
      this.image.height / this.imageTile,
      this.image.width / this.imageTile
    );
    this.ground = ground;
    this.objects = objects;
  }

  drawGround() {
    for (let row = this.game.camera.startRow; row < this.game.camera.endRow; row++) {
      for (let column = this.game.camera.startCol; column < this.game.camera.endCol; column++) {
        const tile = this.getGroundTile(row, column);
        this.game.draw(
          this.image,
          tile[0],
          tile[1],
          column,
          row,
          this.imageTile
        );
      }
    }
    for (let i = 0; i < this.objects.layer1.length; i++) {
      let obj = this.objects.layer1[i];
      this.game.draw(
        this.image,
        obj.tile[0],
        obj.tile[1],
        obj.col,
        obj.row,
        this.imageTile
      );
    }
    for (let i = 0; i < this.objects.layer2.length; i++) {
      let obj = this.objects.layer2[i];
      this.game.draw(
        this.image,
        obj.tile[0],
        obj.tile[1],
        obj.col,
        obj.row,
        this.imageTile
      );
    }
  }
  /**
   * Get the tile from the map using the current row & column
   * @param {number} row The row you are targetting
   * @param {number} column The column you are targetting
   * @returns The corresponding position in the game map
   */
  getGroundTile(row, column) {
    return this.ground[row][column];
  }
}
