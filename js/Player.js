import { Game } from "./Game.js";

export class Player {
  /**
   *
   * @param {Game} game
   * @param {{ x:number, y:number, fullHp:number, hp:number, maxSpeed:number, speed:number, size:number }} param1
   */
  constructor(
    game,
    { x, y, fullHp = 100, hp = fullHp, maxSpeed = 1000, size = 32, speed = size * 2 }
  ) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.size = size;
    this.r = size * 0.5;

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
    this.spritePerSecond = 1 / 10;

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
    this.speedX = speed;
    this.speedY = speed;
  }
  /**
   *
   * @param {keyof typeof this.spriteStates} state
   */
  stateSwitcher(state) {
    this.state = state;
  }
  move(moveX, moveY) {
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
if (moveX && moveY) {
  // To make the distance moved the independent on the direction
  // x,y = (x,y) / sqrt(2)
  this.x = Math.max(
    this.r,
    Math.min(this.game.map.w - this.r, this.x + moveX * this.speedX * 0.7071067811865475)
  );
  this.y = Math.max(
    this.r,
    Math.min(this.game.map.h - this.r, this.y + moveY * this.speedY * 0.7071067811865475)
  );
}else{

  this.x = Math.max(
    this.r,
    Math.min(this.game.map.w - this.r, this.x + moveX * this.speedX)
  );
  this.y = Math.max(
    this.r,
    Math.min(this.game.map.h - this.r, this.y + moveY * this.speedY)
  );
}
    return [this.x, this.y];
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

  render() {
    this.game.ctx.save();
    // this.game.ctx.beginPath();
    // this.game.ctx.arc(
    //   this.x + this.game.camera.x,
    //   this.y + this.game.camera.y,
    //   this.r,
    //   0,
    //   2 * Math.PI,
    //   false
    // );
    // this.game.ctx.fillStyle = "blue"; // Fill color
    // this.game.ctx.fill();
    // this.game.ctx.lineWidth = 2; // Border width
    // this.game.ctx.strokeStyle = "#003300"; // Border color
    // this.game.ctx.stroke();
    this.game.ctx.drawImage(
      this.image,
      this.spriteStates[this.state][
        this.currentSprite % this.spriteStates[this.state].length
      ],
      this.spriteDirections[this.direction],
      this.spriteSize,
      this.spriteSize,
      this.x + this.game.camera.x,
      this.y + this.game.camera.y,
      this.size,
      this.size
    );
    this.game.ctx.restore();
  }

  resize() {
    this.x = Math.max(this.r, Math.min(this.game.map.w - this.r, this.x));
    this.y = Math.max(this.r, Math.min(this.game.map.h - this.r, this.y));
    return [this.x, this.y];
  }
}
