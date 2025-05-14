import axios from './axios';
import { Audio } from 'expo-av';

let ttsSound = null;

export const playTTSFromText = async (text) => {
  try {
    const response = await axios.post(
      'api/tts',
      { text },
      { responseType: 'blob' } // ensures we receive binary audio data
    );

    const blob = response.data;

    // Create a local URI from the blob
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64data = reader.result;
      const uri = base64data;

      if (ttsSound) {
        await ttsSound.unloadAsync();
        ttsSound = null;
      }

      const { sound } = await Audio.Sound.createAsync({ uri });
      ttsSound = sound;
      await ttsSound.playAsync();
    };

    reader.readAsDataURL(blob); // Converts blob into base64 URI

  } catch (error) {
    console.error('TTS playback error:', error);
  }
};

export const stopTTS = async () => {
  if (ttsSound) {
    try {
      await ttsSound.stopAsync();
      await ttsSound.unloadAsync();
    } catch (error) {
      console.warn('Error stopping TTS:', error);
    }
    ttsSound = null;
  }
};
