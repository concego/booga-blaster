const SPECIAL_ENEMIES = Object.freeze({
  troll: Object.freeze({
    id: "troll",
    name: "Troll",
    hp: 3,
    role: "special",
    onlyElement: "fire",
    behavior: "break-blocks",
    personality: "Quebra blocos e só recebe dano de Fogo.",
    isSpecial: true
  })
});

export const createSpecialEnemy = (id) => {
  const template = SPECIAL_ENEMIES[id];
  if (!template) return null;
  return { ...template, maxHp: template.hp, hp: template.hp, stunned: 0 };
};

export const getSpecialEnemyForPhase = (phase = 1) => (
  Number(phase) === 1 ? createSpecialEnemy("troll") : null
);
