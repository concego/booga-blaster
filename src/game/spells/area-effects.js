import { isInsideGrid } from "../../core/grid.js";

export const adjacentCells = (state, center) => {
  const candidates = [
    { x: center.x, y: center.y - 1 },
    { x: center.x, y: center.y + 1 },
    { x: center.x - 1, y: center.y },
    { x: center.x + 1, y: center.y }
  ];
  return candidates.filter(({ x, y }) => isInsideGrid(state, x, y));
};

const sameZone = (zone, type, cells) => (
  zone.type === type && cells.some((cell) => zone.cells.some((saved) => saved.x === cell.x && saved.y === cell.y))
);

export const upsertZone = (state, type, cells, turns) => {
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
