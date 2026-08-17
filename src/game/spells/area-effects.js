import { isInsideGrid } from "../../core/grid.js";

export const coneCells = (state, contact, direction) => {
  if (!direction) return [];
  const front = { x: contact.x + direction.dx, y: contact.y + direction.dy };
  const left = { x: front.x - direction.dy, y: front.y + direction.dx };
  const right = { x: front.x + direction.dy, y: front.y - direction.dx };
  return [left, front, right].filter(({ x, y }) => (
    isInsideGrid(state, x, y) && state.grid.cells[y][x] !== "#"
  ));
};

const sameZone = (zone, type, cells) => (
  zone.type === type && cells.some((cell) => zone.cells.some((saved) => saved.x === cell.x && saved.y === cell.y))
);

export const upsertZone = (state, type, cells, turns) => {
  if (!cells.length) return null;
  const existing = state.zones.find((zone) => sameZone(zone, type, cells));
  if (existing) {
    existing.turns = turns;
    existing.cells = cells;
    return existing;
  }
  const zone = { type, cells, turns };
  state.zones.push(zone);
  return zone;
};
