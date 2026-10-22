import { useState, useRef, useCallback, useEffect } from 'react';

export type TimerStatus = 'idle' | 'running' | 'paused' | 'finished';

export function useTimer(initialSeconds: number, onComplete?: () => void) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [status, setStatus] = useState<TimerStatus>('idle');
  const [totalDuration, setTotalDuration] = useState(initialSeconds);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onCompleteRef = useRef(onComplete);
  
  // Keep the callback ref up to date
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback((seconds?: number) => {
    clearTimer();
    const duration = seconds ?? totalDuration;
    setTotalDuration(duration);
    setTimeLeft(duration);
    setStatus('running');
    
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearTimer();
          setStatus('finished');
          onCompleteRef.current?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [clearTimer, totalDuration]);

  const pause = useCallback(() => {
    clearTimer();
    setStatus('paused');
  }, [clearTimer]);

  const resume = useCallback(() => {
    if (timeLeft > 0) {
      setStatus('running');
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearTimer();
            setStatus('finished');
            onCompleteRef.current?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  }, [timeLeft, clearTimer]);

  const reset = useCallback((seconds?: number) => {
    clearTimer();
    const duration = seconds ?? totalDuration;
    setTotalDuration(duration);
    setTimeLeft(duration);
    setStatus('idle');
  }, [clearTimer, totalDuration]);

  const finish = useCallback(() => {
    clearTimer();
    setTimeLeft(0);
    setStatus('finished');
  }, [clearTimer]);

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  const progress = totalDuration > 0 ? ((totalDuration - timeLeft) / totalDuration) * 100 : 0;

  return {
    timeLeft,
    status,
    progress,
    totalDuration,
    start,
    pause,
    resume,
    reset,
    finish,
  };
}
