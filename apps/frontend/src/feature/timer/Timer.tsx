import { useEffect, useState } from "react";

const FOCUS_DURATION = 25 * 60 * 1000; // 25 menit dalam ms

function Timer() {
  const [startTime, setStartTime] = useState<number | null>(null);
  const [accumulatedMs, setAccumulatedMs] = useState(0);
  const [now, setNow] = useState(() => Date.now());

  // Derived values
  const isRunning = startTime !== null;
  const elapsedMs = accumulatedMs + (startTime !== null ? now - startTime : 0);
  const timeLeftMs = Math.max(0, FOCUS_DURATION - elapsedMs);

  useEffect(() => {
    if (startTime === null) return;

    const interval = setInterval(() => {
      const currentNow = Date.now();
      const totalElapsed = accumulatedMs + (currentNow - startTime);

      if (totalElapsed >= FOCUS_DURATION) {
        setAccumulatedMs(FOCUS_DURATION);
        setStartTime(null);
        setNow(currentNow);
      } else {
        setNow(currentNow);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, accumulatedMs]);

  function handleStart() {
    if (startTime !== null) return; // prevent double start
    setStartTime(Date.now());
  }

  function handlePause() {
    if (startTime === null) return;

    const elapsedSinceStart = Date.now() - startTime;
    setAccumulatedMs((prev) => prev + elapsedSinceStart);
    setStartTime(null);
  }

  function handleReset() {
    setStartTime(null);
    setAccumulatedMs(0);
    setNow(Date.now());
  }

  const minutes = Math.floor(timeLeftMs / 1000 / 60);
  const seconds = Math.floor((timeLeftMs / 1000) % 60);

  const display = `${String(minutes).padStart(2, "0")}:${String(
    seconds,
  ).padStart(2, "0")}`;

  return (
    <div>
      <h2>{display}</h2>
      <p>Running: {String(isRunning)}</p>

      <button onClick={handleStart}>Start</button>
      <button onClick={handlePause}>Pause</button>
      <button onClick={handleReset}>Reset</button>
    </div>
  );
}

export default Timer;
