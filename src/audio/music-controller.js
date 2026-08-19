// As faixas do Dino Crawler não são usadas aqui. Cada bioma e a Boss Battle
// receberão arquivos próprios antes de serem ativados no jogo.
const TRACKS = Object.freeze({});

let ambientAudio = null;
let activeTrack = null;

const startTrack = (trackId, loop = true) => {
  const track = TRACKS[trackId];
  if (!track) return;
  if (activeTrack === trackId && ambientAudio) return;
  if (ambientAudio) {
    ambientAudio.pause();
    ambientAudio.currentTime = 0;
  }
  ambientAudio = new Audio(track.src);
  ambientAudio.loop = loop;
  ambientAudio.preload = "auto";
  ambientAudio.volume = track.volume;
  activeTrack = trackId;
  const promise = ambientAudio.play();
  if (promise?.catch) promise.catch(() => {});
};

export const startBiomeMusic = (biome) => startTrack(biome);
export const startBossMusic = () => startTrack("boss");

export const stopMusic = () => {
  if (!ambientAudio) return;
  ambientAudio.pause();
  ambientAudio.currentTime = 0;
  ambientAudio = null;
  activeTrack = null;
};

export const getMusicTracks = () => ({ ...TRACKS });
