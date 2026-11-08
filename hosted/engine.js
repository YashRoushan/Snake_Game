// Browser edition of the original 18 × 18 grid game, with explicit game state.
export const SIZE = 18;
export const DIRECTIONS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};
export function same(a, b) {
  return a.x === b.x && a.y === b.y;
}
export function spawnFood(snake, random = Math.random) {
  const available = [];
  for (let y = 0; y < SIZE; y++)
    for (let x = 0; x < SIZE; x++)
      if (!snake.some((segment) => same(segment, { x, y })))
        available.push({ x, y });
  return available.length
    ? available[
        Math.min(available.length - 1, Math.floor(random() * available.length))
      ]
    : null;
}
export function newGame() {
  const snake = [
    { x: 8, y: 9 },
    { x: 7, y: 9 },
    { x: 6, y: 9 },
  ];
  return {
    snake,
    food: { x: 13, y: 9 },
    direction: "right",
    queued: "right",
    score: 0,
    status: "ready",
  };
}
export function changeDirection(state, next) {
  if (!DIRECTIONS[next] || state.status === "over" || state.status === "won")
    return state;
  const current = DIRECTIONS[state.direction],
    desired = DIRECTIONS[next];
  if (current.x + desired.x === 0 && current.y + desired.y === 0) return state;
  return { ...state, queued: next };
}
export function tick(state, random = Math.random) {
  if (state.status !== "playing") return state;
  const movement = DIRECTIONS[state.queued];
  const head = {
    x: state.snake[0].x + movement.x,
    y: state.snake[0].y + movement.y,
  };
  const eating = state.food && same(head, state.food);
  const occupied = eating ? state.snake : state.snake.slice(0, -1);
  if (
    head.x < 0 ||
    head.x >= SIZE ||
    head.y < 0 ||
    head.y >= SIZE ||
    occupied.some((segment) => same(segment, head))
  )
    return { ...state, status: "over" };
  const snake = [head, ...state.snake];
  if (!eating) snake.pop();
  const food = eating ? spawnFood(snake, random) : state.food;
  return {
    ...state,
    snake,
    food,
    direction: state.queued,
    score: state.score + (eating ? 1 : 0),
    status: food ? "playing" : "won",
  };
}
