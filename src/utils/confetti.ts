import confetti from 'canvas-confetti';

export const triggerStarConfetti = () => {
  try {
    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#fbbf24', '#f59e0b', '#ec4899', '#3b82f6', '#10b981'],
      shapes: ['star', 'circle'],
    });
  } catch {
    // Ignore canvas errors
  }
};

export const triggerBigCelebration = () => {
  try {
    const end = Date.now() + 1.2 * 1000;
    const colors = ['#f43f5e', '#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#facc15'];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  } catch {
    // Ignore
  }
};
