const SPECIAL_ENEMIES = Object.freeze({
  "spider-queen": Object.freeze({
    id: "spider-queen",
    name: "Rainha Aranha",
    hp: 3,
    role: "special",
    behavior: "webs",
    webRange: 1,
    personality: "Lança teias a um quadrado de distância.",
    isSpecial: true
  }),
  "alpha-wolf": Object.freeze({
    id: "alpha-wolf",
    name: "Lobo Alfa",
    hp: 3,
    role: "special",
    behavior: "summon-wolves",
    summonCooldown: 0,
    personality: "Uiva, invoca lobos e tenta encurralar Supimpus.",
    isSpecial: true
  }),
  "novice-bravo": Object.freeze({
    id: "novice-bravo",
    name: "Bravo Novato",
    hp: 3,
    role: "boss",
    behavior: "slingshot-potion",
    reloadTurns: 0,
    potionAvailable: true,
    potionTurns: 0,
    potionUsed: false,
    ranged: 3,
    personality: "Usa um estilingue de alcance 3 e carrega uma poção de um uso.",
    intro: "Ah, então você é o Goblin de quem estão falando. Bem, não importa, eu já treinei muito limpando o porão da taverna. Isso vai ser fácil!",
    isSpecial: true
  }),
  troll: Object.freeze({
    id: "troll",
    name: "Troll",
    hp: 3,
    role: "special",
    onlyElement: "fire",
    behavior: "break-blocks",
    personality: "Quebra blocos e só recebe dano de Fogo.",
    isSpecial: true
  }),
  "forest-warden": Object.freeze({
    id: "forest-warden",
    name: "Guardião do Bosque",
    hp: 3,
    role: "boss",
    personality: "O Boss da floresta protege a arena.",
    isSpecial: true
  })
});

export const createSpecialEnemy = (id) => {
  const template = SPECIAL_ENEMIES[id];
  if (!template) return null;
  return { ...template, maxHp: template.hp, hp: template.hp, stunned: 0 };
};

export const getSpecialEnemyForPhase = (phase = 1) => {
  const numericPhase = Math.max(1, Number(phase) || 1);
  const phaseInEnvironment = ((numericPhase - 1) % 3) + 1;
  const specialId = {
    1: "spider-queen",
    2: "alpha-wolf",
    3: "novice-bravo"
  }[phaseInEnvironment];
  return createSpecialEnemy(specialId);
};
