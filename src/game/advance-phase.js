import { generateLevel } from "./level-generator.js?v=svg-test-76";
import { createPowerupItem } from "./powerups/powerup-sources.js?v=svg-test-76";
import { createHeartItem } from "./collectibles/heart-items.js?v=svg-test-76";

export const advancePhase = (state) => {
  const nextPhase = state.currentPhase + 1;
  if (nextPhase > 21) return "A campanha foi concluída.";

  const baseSeed = state.campaignSeed ?? state.seed;
  const nextSeed = `${baseSeed}-fase-${nextPhase}`;
  const level = generateLevel({ seed: nextSeed, difficulty: nextPhase });
  state.currentPhase = nextPhase;
  state.difficulty = nextPhase;
  state.seed = level.seed;
  state.biome = level.biome;
  state.biomeName = level.biomeName;
  state.biomeVariant = level.biomeVariant;
  state.phaseName = `Fase ${nextPhase} — ${level.biomeName}`;
  state.campaignSeed = baseSeed;
  state.arenaMode = "normal";
  state.specialEnemy = null;
  state.summonedEnemyIds = [];
  state.webs = [];
  state.phaseComplete = false;
  state.player = { ...level.start, stunned: 0 };
  state.goal = { ...level.goal };
  state.launchArmed = false;
  state.effects = [];
  state.effectsRevision += 1;
  state.badNewsPhase = 0;
  state.zones = [];
  state.projectiles = [];
  state.enemies = level.enemies;
  state.powerups = level.powerups.map((item) => createPowerupItem(
    item.type, item.source, item.position, item.id
  ));
  state.heartItems = level.heartItems.map((item) => createHeartItem(
    item.source, item.position, item.id
  ));
  state.chests = level.chests;
  state.grid = { width: 9, height: 5, cells: level.cells, blocks: level.blocks };
  state.unlockedElements = [...level.availableElements];
  if (!state.unlockedElements.includes(state.selectedElement)) state.selectedElement = "fire";

  return `Fase ${nextPhase} iniciada no ambiente ${level.biomeName}.`;
};
