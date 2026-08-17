export const DIRECTIONS = Object.freeze({
  north: Object.freeze({ label: "norte", dx: 0, dy: -1 }),
  south: Object.freeze({ label: "sul", dx: 0, dy: 1 }),
  west: Object.freeze({ label: "oeste", dx: -1, dy: 0 }),
  east: Object.freeze({ label: "leste", dx: 1, dy: 0 })
});

export const getDirection = (name) => DIRECTIONS[name] || null;
