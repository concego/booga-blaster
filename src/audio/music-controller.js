const TRACKS = Object.freeze({
  "floresta-espinhosa": Object.freeze({ src: "audio/jungle-music.ogg", volume: 0.22 }),
  "floresta-ambiente": Object.freeze({ src: "audio/forest-ambience.mp3", volume: 0.18 }),
  boss: Object.freeze({ src: "audio/rex-tension.ogg", volume: 0.28 })
});

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

export const startBiomeMusic = (biome) => {
  startTrack(TRACKS[biome] ? biome : "floresta-espinhosa");
};

export const startBossMusic = () => startTrack("boss");

export const stopMusic = () => {
  if (!ambientAudio) return;
  ambientAudio.pause();
  ambientAudio.currentTime = 0;
  ambientAudio = null;
  activeTrack = null;
};

export const getMusicTracks = () => ({ ...TRACKS });
