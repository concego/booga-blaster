const SVG_NS = "http://www.w3.org/2000/svg";
const CELL_SIZE = 90;
const ORIGIN = 45;

const createSvg = (tag, attributes = {}) => {
  const node = document.createElementNS(SVG_NS, tag);
  Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, value));
  return node;
};

const center = (cell) => ({
  x: ORIGIN + cell.x * CELL_SIZE + CELL_SIZE / 2,
  y: ORIGIN + cell.y * CELL_SIZE + CELL_SIZE / 2
});

const addZone = (group, cell, type) => {
  const point = center(cell);
  const className = type === "flame" ? "dynamic-flame" : "dynamic-wind";
  const symbol = type === "flame" ? "✦" : "〰";
  group.append(createSvg("rect", {
    x: point.x - 35, y: point.y - 35, width: 70, height: 70, rx: 16, class: className
  }));
  group.append(createSvg("text", { x: point.x, y: point.y, class: "dynamic-symbol" })).textContent = symbol;
};

const addPlayer = (player) => {
  const point = center(player);
  const body = document.querySelector("#player-body");
  const marker = document.querySelector("#player-marker");
  if (!body || !marker) return;
  body.setAttribute("cx", point.x);
  body.setAttribute("cy", point.y);
  marker.setAttribute("x", point.x);
  marker.setAttribute("y", point.y + 8);
};

const addEnemy = (group, enemy) => {
  const point = center(enemy);
  group.append(createSvg("circle", { cx: point.x, cy: point.y, r: 26, class: "dynamic-enemy" }));
  group.append(createSvg("text", { x: point.x, y: point.y, class: "dynamic-symbol" })).textContent = "!";
};

const addPowerup = (group, item) => {
  const point = center(item);
  group.append(createSvg("circle", { cx: point.x, cy: point.y, r: 22, class: "dynamic-powerup" }));
  group.append(createSvg("text", { x: point.x, y: point.y, class: "dynamic-symbol" })).textContent = "★";
};

export const renderArena = (state) => {
  const group = document.querySelector("#dynamic-arena");
  const playerLayer = document.querySelector("#player-layer");
  if (!group || !playerLayer) return;
  group.replaceChildren();

  state.zones.forEach((zone) => zone.cells.forEach((cell) => addZone(group, cell, zone.type)));
  state.grid.cells.forEach((row, y) => row.forEach((value, x) => {
    if (value !== "#") return;
    const point = center({ x, y });
    group.append(createSvg("rect", {
      x: point.x - 35, y: point.y - 35, width: 70, height: 70, rx: 12, class: "dynamic-wall"
    }));
  }));
  state.powerups.filter((item) => item.revealed && !item.collected).forEach((item) => addPowerup(group, item));
  state.enemies.forEach((enemy) => addEnemy(group, enemy));
  addPlayer(state.player);
};
