import { isInsideGrid } from "../../core/grid.js?v=svg-test-28";

// Raio 1 em cruz: centro, Norte, Sul, Oeste e Leste.
export const blastCells = (state, center) => {
  const offsets = [
    { x: 0, y: 0 },
    { x: 0, y: -1 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
    { x: 1, y: 0 }
  ];
  return offsets
    .map((offset) => ({ x: center.x + offset.x, y: center.y + offset.y }))
    .filter(({ x, y }) => isInsideGrid(state, x, y));
};
