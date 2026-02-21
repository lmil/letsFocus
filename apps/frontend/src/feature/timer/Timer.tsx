import { useEffect, useState } from "react";

const FOCUS_DURATION = 25 * 60 * 1000;

function Timer() {
  const [startTime, setStartTime] = useState<number | null>(null);
  const [accumulatedMs, setAccumulatedMs] = useState(0);
  const [now, setNow] = useState(() => Date.now());

  const isRunning = startTime !== null;

  const elapsedMs = accumulatedMs + (startTime !== null ? now - startTime : 0);
  const timeLeftMs = Math.max(0, FOCUS_DURATION - elapsedMs);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      const currentNow = Date.now();
      setNow(currentNow);

      if (accumulatedMs + (currentNow - (startTime ?? 0)) >= FOCUS_DURATION) {
        setAccumulatedMs(FOCUS_DURATION);
        setStartTime(null);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, startTime, accumulatedMs]);

  function handleStart() {
    setStartTime(Date.now());
  }

  function handlePause() {
    if (startTime === null) return;
    setAccumulatedMs((prev) => prev + (Date.now() - startTime));
    setStartTime(null);
  }

  const minutes = Math.floor(timeLeftMs / 1000 / 60);
  const seconds = Math.floor((timeLeftMs / 1000) % 60);
  const display = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return (
    <div>
      <p>{display}</p>
      <p>Running: {String(isRunning)}</p>
      <button onClick={handleStart}>Start</button>
      <button onClick={handlePause}>Pause</button>
    </div>
  );
}

export default Timer;
