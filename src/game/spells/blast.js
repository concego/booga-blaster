import { isInsideGrid } from "../../core/grid.js?v=svg-test-25";

// Raio 1: a célula central e as oito células vizinhas.
export const blastCells = (state, center) => {
  const cells = [];
  for (let y = center.y - 1; y <= center.y + 1; y += 1) {
    for (let x = center.x - 1; x <= center.x + 1; x += 1) {
      if (isInsideGrid(state, x, y)) cells.push({ x, y });
    }
  }
  return cells;
};
