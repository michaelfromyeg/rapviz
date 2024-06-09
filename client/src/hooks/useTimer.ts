import { useCallback, useEffect, useState } from "react";

function useTimer(speed: number = 1): {
  currentMillisecond: number;
  setCurrentMillisecond: (value: number) => void;
  reset: () => void;
  paused: boolean;
  play: () => void;
  pause: () => void;
} {
  const [paused, setPaused] = useState<boolean>(false);

  const play = useCallback(() => setPaused(false), []);
  const pause = useCallback(() => setPaused(true), []);

  const [currentMillisecond, setCurrentMillisecond] = useState(0);
  const reset = useCallback(() => setCurrentMillisecond(0), []);

  useEffect(() => {
    if (!paused) {
      let last = Date.now();
      const timer = globalThis.setInterval(() => {
        const now = Date.now();
        setCurrentMillisecond((cm) => cm + (now - last) * speed);
        last = now;
      }, 97); // Connor McDavid?
      return () => globalThis.clearInterval(timer);
    }
  }, [paused, speed]);

  return {
    currentMillisecond,
    setCurrentMillisecond,
    reset,
    paused,
    play,
    pause,
  };
}

export default useTimer;
