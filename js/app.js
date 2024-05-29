import { Game } from "./Game.js";

window.addEventListener("load", async () => {
  /**
   * @type {HTMLCanvasElement}
   */
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");

  const game = new Game(ctx);
  canvas.width = game.w;
  canvas.height = game.h;
  ctx.imageSmoothingEnabled = false;

  window.addEventListener("keydown", (e) => {
    if (typeof game.keys[e.key] === "boolean") {
      game.keys[e.key] = true;
      e.preventDefault();
    }
  });
  window.addEventListener("keyup", (e) => {
    if (typeof game.keys[e.key] === "boolean") {
      game.keys[e.key] = false;
      e.preventDefault();
    }
  });

  function resizeCanvas() {
    game.resize(innerWidth, innerHeight);
    canvas.width = game.w;
    canvas.height = game.h;

    //   This has to be set after each resize
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  window.addEventListener("resize", resizeCanvas);
  document
    .getElementById("debug")
    ?.addEventListener("click", () => game.toggleDebugging());
  document
    .getElementById("edit")
    ?.addEventListener("click", () => game.toggleEditMode());
  document.addEventListener("mousemove", (e) => {
    const { x, y } = canvas.getBoundingClientRect();
    game.setCursor(e.clientX - x, e.clientY - y);
  });
  canvas.addEventListener("click", (e) => {
    if (e.target === e.currentTarget) {
      game.click(e);
    }
  });
  resizeCanvas();
  let lastTime = 0;
  function animate(timesTamp) {
    const deltaTime = (timesTamp - lastTime) * 0.001;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.update(deltaTime);
    game.render();
    lastTime = timesTamp;
    window.requestAnimationFrame(animate);
  }
  animate(0);
});
