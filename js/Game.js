import { Camera } from "./Camera.js";
import { Editor } from "./Editor.js";
import { Map } from "./Map.js";

// const GAME_WIDTH = 768;
// const GAME_HEIGHT = 768;
const GAME_WIDTH = 32 * 5 * 2;
const GAME_HEIGHT = 32 * 5 * 2;
export class Game {
  /**
   *
   * @param {CanvasRenderingContext2D} ctx
   */
  constructor(ctx) {
    // Main setup
    this.ctx = ctx;
    this.w = GAME_WIDTH;
    this.h = GAME_HEIGHT;
    this.keys = {
      ArrowUp: false,
      ArrowDown: false,
      ArrowLeft: false,
      ArrowRight: false,
    };
    this.cursor = {
      x: 0,
      y: 0,
    };
    //
    this.map = new Map(this);
    this.camera = new Camera(this);
    this.editor = new Editor(this);
    this.debugging = false;
    this.draw = this.debugging ? this.drawDebug : this.drawNormal;
    this.editMode = false;
    this.renderEdit = this.editMode ? this.renderEditOn : this.renderEditOff;
  }
  update(deltaTime) {
    let moveX = 0;
    let moveY = 0;
    if (this.keys["ArrowUp"]) {
      moveY += 1;
    }
    if (this.keys["ArrowDown"]) {
      moveY -= 1;
    }
    if (this.keys["ArrowRight"]) {
      moveX -= 1;
    }
    if (this.keys["ArrowLeft"]) {
      moveX += 1;
    }
    this.camera.move(deltaTime, moveX, moveY);
  }
  render() {
    // this.ctx.drawImage(
    //   this.map.image,
    //   this.camera.x,
    //   this.camera.y,
    //   this.camera.width,
    //   this.camera.height,
    //   0,
    //   0,
    //   GAME_WIDTH,
    //   GAME_HEIGHT
    // );

    // for (let row = 0; row < this.map.cols; row++) {
    //   for (let col = 0; col < this.map.rows; col++) {
    //     this.draw(
    //       this.map.image,
    //       col,
    //       row,
    //       col,
    //       row,
    //       this.map.imageTile
    //     );
    //   }
    // }
    // this.draw( this.map.image, 0, 0, 0, 0, this.map.imageTile);
    this.map.drawGround();
    this.renderEdit();
  }
  /**
   *
   * @param {number} w
   * @param {number} h
   */
  resize(w, h) {
    this.w = w;
    this.h = h;
    this.map.resize();
    this.camera.resize();
  }
  /**
   *
   * @param {HTMLImageElement} image Source image to use for drawing
   * @param {number} sx Source image `x` position
   * @param {number} sy Source image `y` position
   * @param {number} dx Canvas `x` position
   * @param {number} dy Canvas `y` position
   * @param {number} imageTile Source image tile size
   */
  drawDebug(image, sx, sy, dx, dy, imageTile) {
    this.drawNormal(image, sx, sy, dx, dy, imageTile);
    this.ctx.strokeRect(
      dx * this.map.tileSize + this.camera.x,
      dy * this.map.tileSize + this.camera.y,
      this.map.tileSize,
      this.map.tileSize
    );
    this.ctx.save();
    this.ctx.fillStyle = "red";
    this.ctx.font = "20px Arial";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(
      dy * this.map.cols + dx,
      dx * this.map.tileSize + 0.5 * this.map.tileSize + this.camera.x,
      dy * this.map.tileSize + 0.5 * this.map.tileSize + this.camera.y
      // this.map.tileSize,
    );
    this.ctx.restore();
  }
  /**
   *
   * @param {HTMLImageElement} image Source image to use for drawing
   * @param {number} sx Source image `x` position
   * @param {number} sy Source image `y` position
   * @param {number} dx Canvas `x` position
   * @param {number} dy Canvas `y` position
   * @param {number} imageTile Source image tile size
   */
  drawNormal(image, sx, sy, dx, dy, imageTile) {
    this.ctx.drawImage(
      image,
      sx * imageTile,
      sy * imageTile,
      imageTile,
      imageTile,
      dx * this.map.tileSize + this.camera.x,
      dy * this.map.tileSize + this.camera.y,
      this.map.tileSize,
      this.map.tileSize
    );
  }
  renderEditOn() {
    this.editor.render();
  }
  renderEditOff() {}
  toggleDebugging() {
    this.debugging = !this.debugging;
    this.draw = this.debugging ? this.drawDebug : this.drawNormal;
  }
  toggleEditMode() {
    const editingControlsParent = document.getElementById("edit-controls");
    if (!editingControlsParent) {
      return;
    }
    this.editMode = !this.editMode;
    if (this.editMode) {
      editingControlsParent.style.display = "flex";
    } else {
      editingControlsParent.style.display = "none";
    }
    this.renderEdit = this.editMode ? this.renderEditOn : this.renderEditOff;
  }
  /**
   *
   * @param {MouseEvent} e
   */
  click(e) {
    if (this.editMode) {
      const col = Math.floor((-this.camera.x + e.clientX) / this.map.tileSize);
      const row = Math.floor((-this.camera.y + e.clientY) / this.map.tileSize);
      this.editor.apply(row, col, "click");
    }
  }
  setCursor(x, y) {
    this.cursor.x = x;
    this.cursor.y = y;
  }
}
