import { Game } from "./Game.js";
import { getSourceFromTileNumber, tileRules } from "./mapGenerator.js";

export class Editor {
  /**
   *
   * @param {Game} game
   */
  constructor(game) {
    this.game = game;
    /**
     * @type {null|{tile:[number,number];type:"ground"|"object"}}
     */
    this.target = null;
    const editingControlsParent = document.getElementById("edit-controls");
    if (!editingControlsParent) {
      return;
    }
    // editingControlsParent.addEventListener("click", e=>{
    //     e.stopPropagation();
    // })
    editingControlsParent.replaceChildren([]);

    const tiles = Object.keys(tileRules).map(Number);
    for (let i = 0; i < tiles.length; i++) {
      const element = document.createElement("button");
      element.style.minWidth = `${this.game.map.tileSize}px`;
      element.style.minHeight = `${this.game.map.tileSize}px`;
      element.style.width = `${this.game.map.tileSize}px`;
      element.style.height = `${this.game.map.tileSize}px`;
      element.style.backgroundImage = 'url("' + this.game.map.image.src + '")';
      const position = getSourceFromTileNumber(
        tiles[i],
        this.game.map.imageRows,
        this.game.map.imageCols
      );
      element.style.backgroundPosition = `${
        (position[0] / (this.game.map.imageCols - 1)) * 100
      }% ${(position[1] / (this.game.map.imageRows - 1)) * 100}%`;
      element.style.backgroundSize =
        this.game.map.image.width * 2 +
        "px " +
        this.game.map.image.height * 2 +
        "px";
      element.setAttribute("data-pos", `${position[0]} ${position[1]}`);
      element.addEventListener("click", () => {
        this.target = {
          tile: position,
          type: "ground",
        };
      });
      editingControlsParent.appendChild(element);
    }
  }

  render() {
    this.game.ctx.save();
    this.game.ctx.strokeStyle = "red";
    const col =
      Math.floor(
        (this.game.cursor.x -
          ((this.game.camera.x % this.game.map.tileSize) +
            this.game.map.tileSize)) /
          this.game.map.tileSize
      ) + 1;
    const row =
      Math.floor(
        (this.game.cursor.y -
          ((this.game.camera.y % this.game.map.tileSize) +
            this.game.map.tileSize)) /
          this.game.map.tileSize
      ) + 1;
    const x =
      col * this.game.map.tileSize +
      (this.game.camera.x % this.game.map.tileSize);
    const y =
      row * this.game.map.tileSize +
      (this.game.camera.y % this.game.map.tileSize);

    this.game.ctx.strokeRect(
      x,
      y,
      this.game.map.tileSize,
      this.game.map.tileSize
    );
    if (this.target) {
      this.game.ctx.drawImage(
        this.game.map.image,
        this.target.tile[0] * this.game.map.imageTile,
        this.target.tile[1] * this.game.map.imageTile,
        this.game.map.imageTile,
        this.game.map.imageTile,
        x,
        y,
        this.game.map.tileSize,
        this.game.map.tileSize
      );
    }
    this.game.ctx.restore();
  }

  apply(row, column, action = "click") {
    if (this.target) {
      this.game.map.ground[row][column] = this.target.tile;
    }
  }
}
