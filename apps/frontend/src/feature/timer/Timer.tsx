import { useEffect, useState } from "react";

type SessionType = "focus" | "shortBreak" | "longBreak";

const DURATIONS: Record<SessionType, number> = {
  focus: 0.12 * 60 * 1000, // 7
  shortBreak: 0.05 * 60 * 1000, // 3
  longBreak: 0.07 * 60 * 1000, // 4
};

type TimerSettings = {
  focusMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  sessionsUntilLongBreak: number;
};

function Timer() {
  const [sessionType, setSessionType] = useState<SessionType>("focus");
  const [completedFocusSessions, setCompletedFocusSessions] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [accumulatedMs, setAccumulatedMs] = useState(0);
  const [now, setNow] = useState(() => Date.now());
  const [settings, setSettings] = useState<TimerSettings>({
    focusMinutes: 25,
    shortBreakMinutes: 5,
    longBreakMinutes: 15,
    sessionsUntilLongBreak: 4,
  });

  // Derived values
  const isRunning = startTime !== null;
  const elapsedMs = accumulatedMs + (startTime !== null ? now - startTime : 0);
  const duration = DURATIONS[sessionType];
  const timeLeftMs = Math.max(0, duration - elapsedMs);

  useEffect(() => {
    if (startTime === null) return;

    const interval = setInterval(() => {
      const currentNow = Date.now();
      const totalElapsed = accumulatedMs + (currentNow - startTime);

      if (totalElapsed >= duration) {
        setStartTime(null);
        setNow(currentNow);
        setAccumulatedMs(0);

        if (sessionType === "focus") {
          setCompletedFocusSessions((prev) => {
            const next = prev + 1;
            if (next % 4 === 0) {
              setSessionType("longBreak");
              return 0;
            }
            setSessionType("shortBreak");
            return next;
          });
        } else {
          setSessionType("focus");
        }
      } else {
        setNow(currentNow);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [startTime, accumulatedMs, duration, sessionType]);

  function handleStart() {
    if (startTime !== null) return; // prevent double start
    const currentNow = Date.now();
    setNow(currentNow);
    setStartTime(currentNow);
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
    setCompletedFocusSessions(0);
  }

  const minutes = Math.floor(timeLeftMs / 1000 / 60);
  const seconds = Math.floor((timeLeftMs / 1000) % 60);

  const display = `${String(minutes).padStart(2, "0")}:${String(
    seconds,
  ).padStart(2, "0")}`;

  const circumference = 2 * Math.PI * 112;
  const progress = timeLeftMs / duration;
  const dashOffset = circumference * (1 - progress);

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <div className="flex gap-2">
        <button
          onClick={() => {
            setSessionType("focus");
            handleReset();
          }}
          className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
            sessionType === "focus"
              ? "bg-white text-[#FF6B6B]"
              : "bg-white/20 text-white"
          }`}
        >
          Focus
        </button>
        <button
          onClick={() => {
            setSessionType("shortBreak");
            handleReset();
          }}
          className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
            sessionType === "shortBreak"
              ? "bg-white text-[#FF6B6B]"
              : "bg-white/20 text-white"
          }`}
        >
          Short Break
        </button>
        <button
          onClick={() => {
            setSessionType("longBreak");
            handleReset();
          }}
          className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
            sessionType === "longBreak"
              ? "bg-white text-[#FF6B6B]"
              : "bg-white/20 text-white"
          }`}
        >
          Long Break
        </button>
      </div>
      <div className="relative flex items-center justify-center w-64 h-64">
        <svg className="absolute w-full h-full -rotate-90">
          <circle
            cx="128"
            cy="128"
            r="112"
            fill="none"
            stroke="white"
            strokeOpacity="0.2"
            strokeWidth="12"
          />
          <circle
            cx="128"
            cy="128"
            r="112"
            fill="none"
            stroke="white"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ transition: "stroke-dashoffset 0.8s linear" }}
          />
        </svg>
        <div className="flex gap-2 flex-col">
          <span className="text-white text-5xl font-bold tracking-widest">
            {display}
          </span>
          <p className="text-white/70 text-sm font-medium tracking-wide">
            {sessionType === "focus"
              ? `Session ${completedFocusSessions + 1} of 4`
              : sessionType === "shortBreak"
                ? completedFocusSessions === 0
                  ? `Short Break`
                  : `Short Break for Session ${completedFocusSessions}`
                : `Long Break`}
          </p>
        </div>
      </div>
      <div className="flex gap-4">
        <button
          onClick={isRunning ? handlePause : handleStart}
          className="px-8 py-3 bg-white text-[#FF6B6B] rounded-3xl font-bold text-sm tracking-wide hover:scale-105 transition-transform"
        >
          {isRunning ? "Pause" : accumulatedMs > 0 ? "Resume" : "Start"}
        </button>
      </div>
    </div>
  );
}

export default Timer;
