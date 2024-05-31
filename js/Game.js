import { Camera } from "./Camera.js";
import { Editor } from "./Editor.js";
import { Map } from "./Map.js";
import { Player } from "./Player.js";

const GAME_WIDTH = innerWidth;
const GAME_HEIGHT = innerHeight;
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
    this.minCols = 10;
    this.minRows = 10;
    this.maxZoom = 2;
    this.zoomStep = 0.1;
    this.minZoom = 0.2;
    this.defaultZoomLevel = (this.maxZoom - this.minZoom) * .5 + this.minZoom;
    this.zoom = this.defaultZoomLevel;
    this.baseTileSize =
      Math.max(this.w / this.minCols, this.h / this.minRows) * this.zoom;
    // this.imageToCanvas = 2;
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
    this.render = this.debugging ? this.renderDebug : this.renderNormal;
    this.editMode = false;
    this.renderEdit = this.editMode ? this.renderEditOn : this.renderEditOff;

    // Player
    this.player = new Player(this, {
      x: -this.camera.x + this.camera.width * 0.5,
      y: -this.camera.y + this.camera.height * 0.5,
      size: 0.5,
    });

    // this.player.applyCollision(0,0)

    window.addEventListener("keypress", (e) => {
      if (e.key == "Enter") {
        this.map.objects.print();
        // console.log(this.map.objects.head);
        // console.log(this.camera);
      }
    });
  }
  update(deltaTime) {
    let moveX = 0;
    let moveY = 0;
    if (this.keys["ArrowUp"]) {
      moveY -= 1;
    }
    if (this.keys["ArrowDown"]) {
      moveY += 1;
    }
    if (this.keys["ArrowRight"]) {
      moveX += 1;
    }
    if (this.keys["ArrowLeft"]) {
      moveX -= 1;
    }
    moveX *= deltaTime;
    moveY *= deltaTime;
    if (moveX || moveY) {
      this.camera.move(...this.player.move(moveX, moveY));
      this.player.stateSwitcher("running");
    } else {
      this.player.stateSwitcher("idle");
    }
    this.player.update(deltaTime);
  }
  renderNormal() {
    this.map.render();
    this.renderEdit();
  }
  renderDebug() {
    this.map.debug();
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
    let newTileSizeRatio =
      (Math.max(this.w / this.minCols, this.h / this.minRows) /
        this.baseTileSize) *
      this.zoom;
    this.baseTileSize *= newTileSizeRatio;
    this.map.resize(newTileSizeRatio);
    // this.camera.resize(...this.player.resize(newTileSizeRatio));
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
    this.ctx.save();
    this.ctx.strokeStyle = "#eaeaea";
    this.ctx.strokeRect(
      dx + this.camera.x,
      dy + this.camera.y,
      this.map.tileSize,
      this.map.tileSize
    );
    this.ctx.fillStyle = "red";
    this.ctx.font = `${this.baseTileSize * 0.2}px Arial`;
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(
      Math.floor(dy / this.map.tileSize) + Math.floor(dx / this.map.tileSize),
      dx + 0.5 * this.map.tileSize + this.camera.x,
      dy + 0.5 * this.map.tileSize + this.camera.y
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
      sx,
      sy,
      imageTile,
      imageTile,
      dx + this.camera.x,
      dy + this.camera.y,
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
    this.render = this.debugging ? this.renderDebug : this.renderNormal;
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

  // Some settings
  /**
   *
   * @param {HTMLButtonElement} zoomin The zoom-in control button
   * @param {HTMLButtonElement} zoomout The zoom-out control button
   * @param {"in"|"out"|null} zooming The zooming chosen
   */
  setZoom(zoomin, zoomout, zooming) {
    if (zooming === "in") {
      if (this.zoom < this.maxZoom) {
        this.zoom += this.zoomStep;
        zoomout.disabled = false;
        if (this.zoom >= this.maxZoom) {
          this.zoom = this.maxZoom;
          zoomin.disabled = true;
        }
        this.resize(this.w, this.h);
      }
    } else if (zooming === "out") {
      if (this.zoom > this.minZoom) {
        this.zoom -= this.zoomStep;
        zoomin.disabled = false;
        if (this.zoom <= this.minZoom) {
          this.zoom = this.minZoom;
          zoomout.disabled = true;
        }
        this.resize(this.w, this.h);
      }
    } else {
      if (this.zoom !== this.defaultZoomLevel) {
        this.zoom = this.defaultZoomLevel;
        this.resize(this.w, this.h);
      }
      zoomin.disabled = false;
      zoomout.disabled = false;
    }
  }
}
