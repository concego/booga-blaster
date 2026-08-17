export const ELEMENTS = Object.freeze({
  FIRE: "fire",
  WATER: "water",
  EARTH: "earth",
  AIR: "air"
});

export const SPELLS = Object.freeze({
  [ELEMENTS.FIRE]: Object.freeze({ name: "Fogo", range: 2, zone: "flame", durationTurns: 3 }),
  [ELEMENTS.WATER]: Object.freeze({ name: "Água", range: 2, instantEffect: "push" }),
  [ELEMENTS.EARTH]: Object.freeze({ name: "Terra", range: 1, instantEffect: "stones" }),
  [ELEMENTS.AIR]: Object.freeze({ name: "Ar", range: 3, zone: "wind", durationTurns: 2 })
});

export const getSpell = (element) => SPELLS[element] || null;
