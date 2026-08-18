export const createDemoEnemies = ({ durable = false } = {}) => [
  {
    id: "enemy-contact-test",
    name: "Troll de teste",
    x: 1,
    y: 2,
    hp: durable ? 2 : 1,
    maxHp: durable ? 2 : 1,
    stunned: 0,
    drop: "ghost-potion"
  },
  {
    id: "enemy-area-test",
    name: "Aprendiz de teste",
    x: 2,
    y: 3,
    hp: durable ? 2 : 1,
    maxHp: durable ? 2 : 1,
    stunned: 1
  },
  {
    id: "enemy-scout-test",
    name: "Escoteiro de teste",
    x: 7,
    y: 1,
    hp: durable ? 2 : 1,
    maxHp: durable ? 2 : 1,
    stunned: 0,
    drop: "bad-news"
  },
  {
    id: "enemy-brute-test",
    name: "Brutamontes de teste",
    x: 6,
    y: 3,
    hp: 2,
    maxHp: 2,
    stunned: 0,
    heartDrop: true
  },
  {
    id: "enemy-ambush-test",
    name: "Emboscador de teste",
    x: 0,
    y: 3,
    hp: durable ? 2 : 1,
    maxHp: durable ? 2 : 1,
    stunned: 0
  }
];
