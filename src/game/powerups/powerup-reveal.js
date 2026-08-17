import { POWERUP_SOURCES } from "./powerup-sources.js";

export const revealPowerup = (item, source) => {
  if (!item || item.collected) return false;
  if (item.source !== source) return false;
  item.revealed = true;
  return true;
};

export const revealBlockContents = (item) => revealPowerup(item, POWERUP_SOURCES.BLOCK_CONTENT);
export const openChestContents = (item) => revealPowerup(item, POWERUP_SOURCES.CHEST);
