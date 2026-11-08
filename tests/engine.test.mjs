import test from "node:test";
import assert from "node:assert/strict";
import {
  SIZE,
  newGame,
  changeDirection,
  spawnFood,
  tick,
} from "../hosted/engine.js";

test("movement preserves length and pauses without advancing", () => {
  const start = newGame();
  assert.equal(tick(start), start);
  const next = tick({ ...start, status: "playing" });
  assert.deepEqual(next.snake[0], { x: 9, y: 9 });
  assert.equal(next.snake.length, 3);
  assert.equal(tick({ ...next, status: "paused" }).snake[0].x, 9);
});
test("all four grid edges stop the game at the correct cell", () => {
  for (const [direction, head] of [
    ["left", { x: 0, y: 5 }],
    ["right", { x: 17, y: 5 }],
    ["up", { x: 5, y: 0 }],
    ["down", { x: 5, y: 17 }],
  ]) {
    assert.equal(
      tick({
        ...newGame(),
        snake: [head],
        direction,
        queued: direction,
        status: "playing",
      }).status,
      "over",
    );
  }
});
test("direct reversal and queued reverse before a tick are prevented", () => {
  const state = { ...newGame(), status: "playing" };
  assert.equal(changeDirection(state, "left"), state);
  const upward = changeDirection(state, "up");
  assert.equal(changeDirection(upward, "left"), upward);
  assert.equal(tick(upward).direction, "up");
});
test("eating grows exactly one cell and never puts food inside the snake", () => {
  const state = { ...newGame(), status: "playing", food: { x: 9, y: 9 } };
  const next = tick(state, () => 0);
  assert.equal(next.snake.length, 4);
  assert.equal(next.score, 1);
  assert.ok(
    !next.snake.some((p) => p.x === next.food.x && p.y === next.food.y),
  );
});
test("body collision stops but a vacated tail remains a legal move", () => {
  const state = {
    ...newGame(),
    status: "playing",
    snake: [
      { x: 2, y: 2 },
      { x: 3, y: 2 },
      { x: 3, y: 3 },
      { x: 2, y: 3 },
    ],
    direction: "left",
    queued: "right",
    food: { x: 7, y: 7 },
  };
  assert.equal(tick(state).status, "over");
  assert.equal(tick({ ...state, queued: "down" }).status, "playing");
});
test("a filled board produces no invalid food position", () => {
  const snake = Array.from({ length: SIZE * SIZE }, (_, i) => ({
    x: i % SIZE,
    y: Math.floor(i / SIZE),
  }));
  assert.equal(spawnFood(snake), null);
});
