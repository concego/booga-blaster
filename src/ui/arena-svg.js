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
  group.append(createSvg("rect", {
    x: point.x - 35, y: point.y - 35, width: 70, height: 70, rx: 16, class: className
  }));
  if (type === "flame") {
    group.append(createSvg("path", {
      d: `M ${point.x} ${point.y + 27} C ${point.x - 25} ${point.y + 8}, ${point.x - 8} ${point.y - 4}, ${point.x} ${point.y - 28} C ${point.x + 8} ${point.y - 6}, ${point.x + 25} ${point.y + 8}, ${point.x} ${point.y + 27}Z`,
      class: "flame-core"
    }));
  } else {
    group.append(createSvg("path", {
      d: `M ${point.x - 26} ${point.y - 12} C ${point.x - 8} ${point.y - 28}, ${point.x + 8} ${point.y + 5}, ${point.x + 27} ${point.y - 12} M ${point.x - 27} ${point.y + 12} C ${point.x - 8} ${point.y - 4}, ${point.x + 8} ${point.y + 24}, ${point.x + 26} ${point.y + 8}`,
      class: "wind-streak"
    }));
  }
};

const addPlayer = (player) => {
  const point = center(player);
  const body = document.querySelector("#player-body");
  const hat = document.querySelector("#player-hat");
  const eyeLeft = document.querySelector("#player-eye-left");
  const eyeRight = document.querySelector("#player-eye-right");
  if (!body || !hat || !eyeLeft || !eyeRight) return;
  body.setAttribute("cx", point.x);
  body.setAttribute("cy", point.y);
  hat.setAttribute("d", `M ${point.x - 22} ${point.y - 18} L ${point.x - 5} ${point.y - 48} L ${point.x + 5} ${point.y - 20} L ${point.x + 25} ${point.y - 44} L ${point.x + 18} ${point.y - 10}Z`);
  eyeLeft.setAttribute("cx", point.x - 10);
  eyeLeft.setAttribute("cy", point.y - 3);
  eyeRight.setAttribute("cx", point.x + 10);
  eyeRight.setAttribute("cy", point.y - 3);
};

const addEnemy = (group, enemy) => {
  const point = center(enemy);
  const maxHp = enemy.maxHp ?? 3;
  const hpRatio = Math.max(0, Math.min(1, enemy.hp / maxHp));
  group.append(createSvg("rect", { x: point.x - 29, y: point.y - 42, width: 58, height: 7, rx: 3, class: "enemy-hp-back" }));
  group.append(createSvg("rect", { x: point.x - 29, y: point.y - 42, width: 58 * hpRatio, height: 7, rx: 3, class: "enemy-hp" }));
  group.append(createSvg("circle", { cx: point.x, cy: point.y, r: 26, class: "dynamic-enemy" }));
  group.append(createSvg("circle", { cx: point.x - 9, cy: point.y - 5, r: 4, fill: "#241c35" }));
  group.append(createSvg("circle", { cx: point.x + 9, cy: point.y - 5, r: 4, fill: "#241c35" }));
  if (enemy.stunned > 0) {
    group.append(createSvg("circle", { cx: point.x, cy: point.y, r: 34, class: "enemy-stun-ring" }));
  }
};

const addHeart = (group, item) => {
  const point = center(item);
  group.append(createSvg("path", {
    d: `M ${point.x} ${point.y + 22} C ${point.x - 38} ${point.y - 2}, ${point.x - 22} ${point.y - 30}, ${point.x} ${point.y - 12} C ${point.x + 22} ${point.y - 30}, ${point.x + 38} ${point.y - 2}, ${point.x} ${point.y + 22}Z`,
    class: "dynamic-heart"
  }));
};

const addPowerup = (group, item) => {
  const point = center(item);
  group.append(createSvg("rect", {
    x: point.x - 18, y: point.y - 18, width: 36, height: 36, rx: 8,
    class: "dynamic-powerup", transform: `rotate(45 ${point.x} ${point.y})`
  }));
  group.append(createSvg("circle", { cx: point.x, cy: point.y, r: 7, class: "powerup-core" }));
};

const addProjectile = (group, projectile) => {
  const point = center(projectile.cell);
  const className = `projectile-${projectile.element}`;
  group.append(createSvg("circle", { cx: point.x, cy: point.y, r: 20, class: className }));
  group.append(createSvg("circle", { cx: point.x, cy: point.y, r: 30, class: "projectile-ring" }));
};

const addChest = (group, chest) => {
  const point = center(chest);
  group.append(createSvg("rect", {
    x: point.x - 27, y: point.y - 20, width: 54, height: 40, rx: 7, class: "dynamic-chest"
  }));
  group.append(createSvg("path", {
    d: `M ${point.x - 27} ${point.y - 8} Q ${point.x} ${point.y - 38} ${point.x + 27} ${point.y - 8}`,
    class: "chest-lid"
  }));
  group.append(createSvg("rect", {
    x: point.x - 5, y: point.y - 4, width: 10, height: 13, rx: 2, class: "chest-lock"
  }));
};

const addWall = (group, cell, block = null) => {
  const point = center(cell);
  const colorClass = block?.color ? ` wall-${block.color}` : "";
  group.append(createSvg("rect", {
    x: point.x - 35, y: point.y - 35, width: 70, height: 70, rx: 12, class: `dynamic-wall${colorClass}`
  }));
  group.append(createSvg("path", {
    d: `M ${point.x - 23} ${point.y - 18}L ${point.x - 7} ${point.y - 5}L ${point.x - 19} ${point.y + 19} M ${point.x + 4} ${point.y - 27}L ${point.x + 18} ${point.y - 7}L ${point.x + 8} ${point.y + 23}`,
    class: "wall-crack"
  }));
};

export const renderArena = (state) => {
  const group = document.querySelector("#dynamic-arena");
  const playerLayer = document.querySelector("#player-layer");
  if (!group || !playerLayer) return;
  group.replaceChildren();

  state.zones.forEach((zone) => zone.cells.forEach((cell) => addZone(group, cell, zone.type)));
  state.grid.cells.forEach((row, y) => row.forEach((value, x) => {
    if (value !== "#") return;
    const block = state.grid.blocks?.find((item) => item.x === x && item.y === y);
    addWall(group, { x, y }, block);
  }));
  state.projectiles.forEach((projectile) => addProjectile(group, projectile));
  state.chests.filter((chest) => !chest.opened).forEach((chest) => addChest(group, chest));
  state.heartItems.filter((item) => item.revealed && !item.collected).forEach((item) => addHeart(group, item));
  state.powerups.filter((item) => item.revealed && !item.collected).forEach((item) => addPowerup(group, item));
  state.enemies.forEach((enemy) => addEnemy(group, enemy));
  addPlayer(state.player);
};
