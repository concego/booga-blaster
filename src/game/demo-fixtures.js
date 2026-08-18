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
  }
];
