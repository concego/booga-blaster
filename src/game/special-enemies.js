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

export const getSpecialEnemyForPhase = (phase = 1) => {
  if (Number(phase) !== 1) return null;
  const template = SPECIAL_ENEMIES.troll;
  return { ...template, maxHp: template.hp, hp: template.hp, stunned: 0 };
};
