import { SIZE, newGame, changeDirection, tick } from "./engine.js";
const $ = (id) => document.getElementById(id);
let state = newGame(),
  lastStep = 0,
  best = 0;
try {
  best = Math.max(
    0,
    Number(
      localStorage.getItem("snake-best") || localStorage.getItem("hiscore"),
    ) || 0,
  );
} catch {}
$("best").textContent = String(best).padStart(2, "0");
const keyDirections = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  w: "up",
  s: "down",
  a: "left",
  d: "right",
};
function renderBoard() {
  const segments = state.snake.map((segment, index) => {
    const cell = document.createElement("span");
    cell.className = index === 0 ? "segment head" : "segment";
    cell.style.gridColumnStart = segment.x + 1;
    cell.style.gridRowStart = segment.y + 1;
    cell.setAttribute("aria-hidden", "true");
    return cell;
  });
  if (state.food) {
    const food = document.createElement("span");
    food.className = "food";
    food.style.gridColumnStart = state.food.x + 1;
    food.style.gridRowStart = state.food.y + 1;
    food.setAttribute("aria-hidden", "true");
    segments.push(food);
  }
  $("board").replaceChildren(...segments);
  $("score").textContent = String(state.score).padStart(2, "0");
}
function renderState() {
  renderBoard();
  $("pause").disabled = !["playing", "paused"].includes(state.status);
  $("pause").textContent = state.status === "paused" ? "Resume" : "Pause";
  $("overlay").hidden = state.status === "playing";
  const messages = {
    ready: [
      "Find your rhythm.",
      "Arrow keys, WASD or touch controls.",
      "Start game",
      "Ready to play.",
    ],
    paused: [
      "Take a breath.",
      "Your game is waiting right here.",
      "Resume game",
      "Game paused.",
    ],
    over: [
      "A good run.",
      `You collected ${state.score} ${state.score === 1 ? "square" : "squares"}. Try a new route.`,
      "Play again",
      `Game over. Score ${state.score}.`,
    ],
    won: [
      "Every square, yours.",
      "The whole board is complete.",
      "Play again",
      "You filled the board.",
    ],
    playing: ["", "", "", "Game in progress."],
  };
  const [title, copy, action, status] = messages[state.status];
  $("overlay-title").textContent = title;
  $("overlay-copy").textContent = copy;
  $("start").textContent = action;
  $("status").textContent = status;
}
function play() {
  if (state.status !== "paused") state = newGame();
  state = { ...state, status: "playing" };
  lastStep = performance.now();
  renderState();
  $("board").focus({ preventScroll: true });
}
function pause() {
  if (state.status === "playing") state = { ...state, status: "paused" };
  else if (state.status === "paused") {
    play();
    return;
  }
  renderState();
}
function steer(direction) {
  if (state.status === "ready") play();
  state = changeDirection(state, direction);
}
$("start").addEventListener("click", play);
$("pause").addEventListener("click", pause);
$("restart").addEventListener("click", () => {
  state = newGame();
  play();
});
document
  .querySelectorAll("[data-direction]")
  .forEach((button) =>
    button.addEventListener("click", () => steer(button.dataset.direction)),
  );
document.addEventListener("keydown", (event) => {
  if (
    event.altKey ||
    event.ctrlKey ||
    event.metaKey ||
    event.target.matches("input, textarea, select")
  )
    return;
  if (
    keyDirections[event.key] &&
    (state.status === "playing" || event.target === $("board"))
  ) {
    event.preventDefault();
    steer(keyDirections[event.key]);
  } else if (event.code === "Space" && event.target === $("board")) {
    event.preventDefault();
    pause();
  }
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden && state.status === "playing") pause();
});
let swipe = null;
$("board").addEventListener("pointerdown", (event) => {
  swipe = { x: event.clientX, y: event.clientY };
});
$("board").addEventListener("pointerup", (event) => {
  if (!swipe) return;
  const dx = event.clientX - swipe.x,
    dy = event.clientY - swipe.y;
  if (Math.max(Math.abs(dx), Math.abs(dy)) > 14)
    steer(
      Math.abs(dx) > Math.abs(dy)
        ? dx > 0
          ? "right"
          : "left"
        : dy > 0
          ? "down"
          : "up",
    );
  swipe = null;
});
function frame(now) {
  const interval = Math.max(90, 180 - Math.floor(state.score / 3) * 12);
  if (state.status === "playing" && now - lastStep >= interval) {
    lastStep = now;
    const previous = state;
    state = tick(state);
    if (state.score > best) {
      best = state.score;
      $("best").textContent = String(best).padStart(2, "0");
      try {
        localStorage.setItem("snake-best", String(best));
      } catch {}
    }
    if (state.status !== previous.status) renderState();
    else renderBoard();
  }
  requestAnimationFrame(frame);
}
renderState();
requestAnimationFrame(frame);
