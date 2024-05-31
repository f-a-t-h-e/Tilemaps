import { Game } from "./Game.js";
import { ObjectTree } from "./ObjectClass.js";
import { TwoWayNode } from "./customList.js";
import { checkRCollision } from "./utils.js";

export class Player {
  // static baseSpeed = 20;
  _x = 0;
  get x() {
    return this._x;
  }
  set x(value) {
    this._x = Math.max(this.r, Math.min(this.game.map.w - this.r, value));
    this._rootX = Math.round(this._x + this.dw * 0.5);
  }
  _y = 0;
  get y() {
    return this._y;
  }
  set y(value) {
    this._y = Math.max(this.r, Math.min(this.game.map.h - this.r, value));
    this._rootY = Math.round(this._y + this.dh - this.r);
  }
  _rootX = 0;
  get rootX(){
    return this._rootX
  }
  set rootX(value){
    this._rootX = Math.max(this.r, Math.min(this.game.map.w - this.r, (Math.round(value))));
    this._x = this._rootX - this.dw * .5;
  }
  _rootY = 0;
  get rootY(){
    return this._rootY
  }
  set rootY(value){
    this._rootY = Math.max(this.r, Math.min(this.game.map.h - this.r, Math.round(value)))
    this._y = this._rootY - (this.dh - this.r)
  }
  // _o = new TwoWayNode(0,0)
  // set objNode (v){
  //   console.trace(v)
  //   this._o = v
  // }
  // get objNode (){
  //   return this._o
  // }
  /**
   *
   * @param {Game} game
   * @param {{ x:number, y:number, fullHp:number, hp:number, maxSpeed:number, speed:number, size:number }} param1
   */
  constructor(
    game,
    {
      x,
      y,
      fullHp = 100,
      hp = fullHp,
      maxSpeed = 50,
      size = 0.5,
      speed = 0.125,
    }
  ) {
    this.game = game;
    this.size = size;
    this.dw = this.size * this.game.baseTileSize;
    this.dh = this.size * this.game.baseTileSize;
    this.r = this.game.baseTileSize * this.size * 0.25;
    this.rootX = x;
    this.rootY = y;
    this.objNode = new TwoWayNode(0, 0);
    this.setObjPosition();
    /**
     * @type {HTMLImageElement}
     */
    this.image = document.getElementById("player");
    this.spriteSize = 16;
    this.spriteDirections = {
      s: 0 * this.spriteSize,
      sw: 1 * this.spriteSize,
      w: 2 * this.spriteSize,
      nw: 3 * this.spriteSize,
      n: 4 * this.spriteSize,
      ne: 5 * this.spriteSize,
      e: 6 * this.spriteSize,
      se: 7 * this.spriteSize,
    };
    this.spriteStates = {
      idle: [0].map((v) => v * this.spriteSize),
      running: [1, 2, 3].map((v) => v * this.spriteSize),
    };
    this.currentSprite = 0;
    this.spriteInterval = 0;
    this.spritePerSecond = 1 / (maxSpeed * 3 * speed);

    /**
     * @type {keyof typeof this.spriteStates}
     */
    this.state = "idle";
    /**
     * @type {keyof typeof this.spriteDirections}
     */
    this.direction = "se";

    this.fullHp = fullHp;
    this.hp = hp;
    this.maxSpeed = maxSpeed;
    this.speed = speed;
    this.speedX = this.maxSpeed * speed * this.game.baseTileSize * this.size;
    this.speedY = this.maxSpeed * speed * this.game.baseTileSize * this.size;
  }
  /**
   *
   * @param {keyof typeof this.spriteStates} state
   */
  stateSwitcher(state) {
    this.state = state;
  }
  move(moveX, moveY) {
    if (moveX && moveY) {
      // To make the distance moved the independent on the direction
      // x,y = (x,y) / sqrt(2)
      // this.x = this.x + moveX * this.speedX * 0.7071067811865475;
      // this.y = this.y + moveY * this.speedY * 0.7071067811865475;
      this.rootX = this.rootX + moveX * this.speedX * 0.707107;
      this.rootY = this.rootY + moveY * this.speedY * 0.707107;
    } else {
      this.rootX = this.rootX + moveX * this.speedX;
      this.rootY = this.rootY + moveY * this.speedY;
    }
    // Check Collision
    this.applyCollision(moveX, moveY);

    // Set the direction
    /**
     * @type {typeof this.direction}
     */
    let moveWordX = "";
    /**
     * @type {typeof this.direction}
     */
    let moveWordY = "";
    if (moveX > 0) {
      moveWordX = "e";
    } else if (moveX < 0) {
      moveWordX = "w";
    }

    if (moveY > 0) {
      moveWordY = "s";
    } else if (moveY < 0) {
      moveWordY = "n";
    }

    this.direction = `${moveWordY}${moveWordX}`;
    this.setObjPosition();
    return [this.rootX, this.rootY];
  }
  /**
   *
   * @param {number} deltaTime
   */
  update(deltaTime) {
    this.spriteInterval += deltaTime;
    if (this.spriteInterval >= this.spritePerSecond) {
      this.spriteInterval %= this.spritePerSecond;
      ++this.currentSprite;
    }
  }

  render(dx,dy) {
    this.game.ctx.drawImage(
      this.image,
      this.spriteStates[this.state][
        this.currentSprite % this.spriteStates[this.state].length
      ],
      this.spriteDirections[this.direction],
      this.spriteSize,
      this.spriteSize,
      dx,
      dy,
      this.dw,
      this.dh
    );
    // this.game.ctx.restore();
  }

  debug(dx,dy) {
    this.render(dx,dy);
    this.game.ctx.save();
    this.game.ctx.beginPath();
    // console.log(obj.value.r);
    this.game.ctx.arc(
      this.rootX + this.game.camera.x,
      this.rootY + this.game.camera.y,
      this.r,
      0,
      2 * Math.PI,
      false
    );
    this.game.ctx.fillStyle = "#ff000080"; // Fill color
    this.game.ctx.fill();
    this.game.ctx.lineWidth = 2; // Border width
    this.game.ctx.strokeStyle = "#003300"; // Border color
    this.game.ctx.stroke();
    this.game.ctx.restore();
  }

  resize(newTileSizeRatio) {
    this.dw *= newTileSizeRatio;
    this.dh *= newTileSizeRatio;
    this.r *= newTileSizeRatio;
    this.rootX *= newTileSizeRatio;
    this.rootY *= newTileSizeRatio;
    // this.x *= newTileSizeRatio;
    // this.y *= newTileSizeRatio;
    this.speedX *= newTileSizeRatio;
    this.speedY *= newTileSizeRatio;
    this.game.camera.resize(this.rootX, this.rootY, newTileSizeRatio);
    return [this.rootX, this.rootY];
  }
  setObjPosition() {
    this.objAnchor = this.game.map.getObjKeyFromPosition(
      this.rootX,
      this.rootY
    );
    this.game.map.objects.remove(this.objNode);
    this.objNode = this.game.map.objects.insertAfter(this.objAnchor, this);
  }
  /**
   * 
   * @param {boolean} up The direction to look for the new layer
   */
  moveObjPosition(up) {
    this.objAnchor = this.game.map.getObjKeyFromPosition(
      this.rootX,
      this.rootY
    );
    // loop to get the closest 
    this.game.map.objects.remove(this.objNode);
    this.objNode = this.game.map.objects.insertAfter(this.objAnchor, this);
  }

  applyCollision(moveX,moveY){
    /**
     * @type {ObjectTree[]}
     */
    let objects;
    /**
     * @type {(typeof objects)[number]}
     */
    let obj;
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
        objects = this.game.map.ground[row][column].objects;
        for (let i = 0; i < objects.length; i++) {
          obj = objects[i];
          if (!obj) {
            debugger
          }
          const {colission, deltaX, deltaY, distance, sumOfRadius} = checkRCollision(this, obj);
          if (colission) {
            const unit_X = deltaX / distance;
            const unit_Y = deltaY / distance;
            this.rootX = obj.rootX + (sumOfRadius + 1) * unit_X;
            this.rootY = obj.rootY + (sumOfRadius + 1) * unit_Y;
          }
        }
      }
    }
  }
}
