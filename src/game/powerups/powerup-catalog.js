export const POWERUP_TYPES = Object.freeze({
  EXTRA_LIFE: "extra-life",
  GHOST_POTION: "ghost-potion",
  SALAMANDER: "salamander",
  MOLE: "mole",
  SUPER_STRENGTH: "super-strength",
  BAD_NEWS: "bad-news"
});

export const POWERUPS = Object.freeze({
  [POWERUP_TYPES.EXTRA_LIFE]: Object.freeze({ name: "Vida extra", temporary: false }),
  [POWERUP_TYPES.GHOST_POTION]: Object.freeze({ name: "Poção Fantasma", effect: "ghost", temporary: true }),
  [POWERUP_TYPES.SALAMANDER]: Object.freeze({ name: "Salamandra", effect: "fire-immunity", temporary: true }),
  [POWERUP_TYPES.MOLE]: Object.freeze({ name: "Toupeira", effect: "earth-immunity", temporary: true }),
  [POWERUP_TYPES.SUPER_STRENGTH]: Object.freeze({ name: "Super Força", effect: "throw-range", temporary: true }),
  [POWERUP_TYPES.BAD_NEWS]: Object.freeze({ name: "Notícia ruim", effect: "bad-news", temporary: true, duration: 2 })
});

export const getPowerup = (type) => POWERUPS[type] || null;
