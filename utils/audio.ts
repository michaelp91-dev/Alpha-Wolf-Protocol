let audioCtx: AudioContext | null = null;

export const initAudio = () => {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
};

export const playBeep = (type: 'Low' | 'Mid' | 'High') => {
    if (!audioCtx) initAudio();
    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    const freqs = { 'Low': 150, 'Mid': 400, 'High': 800 };
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.frequency.value = freqs[type];
    osc.type = 'triangle';
    
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.3);
};