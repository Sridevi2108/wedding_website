/**
 * Redirect legacy audioSynth calls to the unified weddingAudio manager.
 * Ensures no procedural synthesizers or previous audio are played.
 */
import { weddingAudio } from './weddingAudio';

export const templeAudio = {
  toggle: () => weddingAudio.toggle(),
  start: () => weddingAudio.play(),
  stop: () => weddingAudio.pause(),
  getIsPlaying: () => weddingAudio.getIsPlaying(),
};
