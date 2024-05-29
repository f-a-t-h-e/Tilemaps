import { Game } from "./Game.js";

export class Camera {
  /**
   *
   * @param {Game} game
   */
  constructor(game) {
    // Main setup
    this.game = game;
    this.width = this.game.w;
    this.height = this.game.h;
    this.maxW = this.game.map.w - 1 - this.width;
    this.maxH = this.game.map.h - 1 - this.height;
    this.x = -this.maxW * 0.5;
    this.y = -this.maxH * 0.5;
    this.rows = Math.ceil(this.game.h / this.game.map.tileSize) + 1;
    this.cols = Math.ceil(this.game.w / this.game.map.tileSize) + 1;
    this.moveSpeed = 256;

    this.startRow = Math.floor(-this.y / this.game.map.tileSize);
    this.endRow = Math.min(this.startRow + this.rows, this.game.map.rows);
    this.startCol = Math.floor(-this.x / this.game.map.tileSize);
    this.endCol = Math.min(this.startCol + this.cols, this.game.map.cols);
  }

  resize() {
    this.width = this.game.w;
    this.height = this.game.h;
    this.maxW = this.game.map.w - 1 - this.width;
    this.maxH = this.game.map.h - 1 - this.height;
    this.x = Math.min(0, Math.max(-this.maxW, this.x));
    this.y = Math.min(0, Math.max(-this.maxH, this.y));
    this.rows = Math.ceil(this.game.h / this.game.map.tileSize) + 1;
    this.cols = Math.ceil(this.game.w / this.game.map.tileSize) + 1;
    this.setBoundaries();
  }
  move(deltaTime, moveX, moveY) {
    if (moveX || moveY) {
      this.x = Math.min(
        0,
        Math.max(-this.maxW, this.x + moveX * this.moveSpeed * deltaTime)
      );
      this.y = Math.min(
        0,
        Math.max(-this.maxH, this.y + moveY * this.moveSpeed * deltaTime)
      );
      this.setBoundaries();
    }
  }
  setBoundaries() {
    this.startRow = Math.floor(-this.y / this.game.map.tileSize);
    this.endRow = Math.min(this.startRow + this.rows, this.game.map.rows);
    this.startCol = Math.floor(-this.x / this.game.map.tileSize);
    this.endCol = Math.min(this.startCol + this.cols, this.game.map.cols);
  }
}
