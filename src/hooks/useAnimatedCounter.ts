import { useState, useEffect, useRef } from 'react';

/**
 * Animated counter hook - smoothly counts from 0 to target value
 */
export function useAnimatedCounter(target: number, duration: number = 1500, enabled: boolean = true) {
  const [value, setValue] = useState(0);
  const startTime = useRef<number | null>(null);
  const animationFrame = useRef<number>(0);

  useEffect(() => {
    if (!enabled) {
      setValue(target);
      return;
    }

    startTime.current = null;
    const startValue = 0;

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const animate = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const elapsed = timestamp - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);

      setValue(Math.round(startValue + (target - startValue) * easedProgress));

      if (progress < 1) {
        animationFrame.current = requestAnimationFrame(animate);
      }
    };

    animationFrame.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [target, duration, enabled]);

  return value;
}
