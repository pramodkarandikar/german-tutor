// Simple Web Audio API synthesizer for game sounds
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playTone(freq, type, duration, vol = 0.1, slideFreq = null) {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  if (slideFreq) {
    osc.frequency.exponentialRampToValueAtTime(slideFreq, audioCtx.currentTime + duration);
  }
  
  gain.gain.setValueAtTime(vol, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

export const playSound = {
  tick: () => playTone(800, 'sine', 0.1, 0.05),
  correct: () => {
    playTone(659.25, 'sine', 0.15, 0.1); // single E5 tone
  },
  wrong: () => {
    // Elegant soft descending chime
    playTone(350, 'sine', 0.2, 0.08, 250); 
  },
  blitz: () => {
    playTone(440, 'square', 0.05, 0.05);
    setTimeout(() => playTone(554.37, 'square', 0.05, 0.05), 50);
    setTimeout(() => playTone(659.25, 'square', 0.05, 0.05), 100);
    setTimeout(() => playTone(880, 'square', 0.2, 0.05), 150);
  },
  highScore: () => {
    playTone(523.25, 'square', 0.1, 0.1);
    setTimeout(() => playTone(659.25, 'square', 0.1, 0.1), 150);
    setTimeout(() => playTone(783.99, 'square', 0.1, 0.1), 300);
    setTimeout(() => playTone(1046.50, 'square', 0.4, 0.1), 450);
  },
  timeout: () => {
    // Soft, extended fade down for running out of time
    playTone(500, 'sine', 0.5, 0.08, 150);
  }
};
