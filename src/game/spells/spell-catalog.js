export const ELEMENTS = Object.freeze({
  FIRE: "fogo",
  WATER: "água",
  EARTH: "terra",
  AIR: "ar"
});

export const SPELLS = Object.freeze({
  [ELEMENTS.FIRE]: Object.freeze({ range: 2, zone: "flame", durationTurns: 3 }),
  [ELEMENTS.WATER]: Object.freeze({ range: 2, instantEffect: "push" }),
  [ELEMENTS.EARTH]: Object.freeze({ range: 1, instantEffect: "stones" }),
  [ELEMENTS.AIR]: Object.freeze({ range: 3, zone: "wind", durationTurns: 2 })
});

export const getSpell = (element) => SPELLS[element] || null;
