import { useEffect, useState } from "react";
import {
  Cog6ToothIcon,
  XMarkIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

type SessionType = "focus" | "shortBreak" | "longBreak";

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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const durations: Record<SessionType, number> = {
    focus: settings.focusMinutes * 60 * 1000,
    shortBreak: settings.shortBreakMinutes * 60 * 1000,
    longBreak: settings.longBreakMinutes * 60 * 1000,
  };

  // Derived values
  const isRunning = startTime !== null;
  const elapsedMs = accumulatedMs + (startTime !== null ? now - startTime : 0);
  const duration = durations[sessionType];
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
            if (next % settings.sessionsUntilLongBreak === 0) {
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
  }, [
    startTime,
    accumulatedMs,
    duration,
    sessionType,
    settings.sessionsUntilLongBreak,
  ]);

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
    <div className="relative flex flex-col items-center justify-center gap-8">
      <div className="w-full flex justify-end">
        <button
          onClick={() => setIsSettingsOpen((prev) => !prev)}
          className="p-2 text-white/60 hover:text-white transition-colors"
        >
          <Cog6ToothIcon className="w-6 h-6" />
        </button>
        {isSettingsOpen && (
          <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center z-10">
            <div className="bg-white rounded-2xl px-6 pt-6 pb-8 w-80 shadow-xl">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-gray-800 font-bold text-lg">
                  Timer Settings
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    title="Reset to defaults"
                    onClick={() =>
                      setSettings({
                        focusMinutes: 25,
                        shortBreakMinutes: 5,
                        longBreakMinutes: 15,
                        sessionsUntilLongBreak: 4,
                      })
                    }
                    className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <ArrowPathIcon className="w-5 h-5" />
                  </button>
                  <button
                    title="Close"
                    onClick={() => setIsSettingsOpen(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 font-medium">Focus</span>
                    <span className="text-gray-400">
                      {settings.focusMinutes} min
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={60}
                    value={settings.focusMinutes}
                    onChange={(e) => {
                      setSettings((prev) => ({
                        ...prev,
                        focusMinutes: Number(e.target.value),
                      }));
                      handleReset();
                    }}
                    className="w-full accent-[#FF6B6B]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 font-medium">
                      Short Break
                    </span>
                    <span className="text-gray-400">
                      {settings.shortBreakMinutes} min
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={15}
                    value={settings.shortBreakMinutes}
                    onChange={(e) => {
                      setSettings((prev) => ({
                        ...prev,
                        shortBreakMinutes: Number(e.target.value),
                      }));
                      handleReset();
                    }}
                    className="w-full accent-[#FF6B6B]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 font-medium">
                      Long Break
                    </span>
                    <span className="text-gray-400">
                      {settings.longBreakMinutes} min
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={30}
                    value={settings.longBreakMinutes}
                    onChange={(e) => {
                      setSettings((prev) => ({
                        ...prev,
                        longBreakMinutes: Number(e.target.value),
                      }));
                      handleReset();
                    }}
                    className="w-full accent-[#FF6B6B]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 font-medium">
                      Sessions until Long Break
                    </span>
                    <span className="text-gray-400">
                      {settings.sessionsUntilLongBreak} sessions
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={settings.sessionsUntilLongBreak}
                    onChange={(e) => {
                      setSettings((prev) => ({
                        ...prev,
                        sessionsUntilLongBreak: Number(e.target.value),
                      }));
                      handleReset();
                    }}
                    className="w-full accent-[#FF6B6B]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
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
              ? `Session ${completedFocusSessions + 1} of ${settings.sessionsUntilLongBreak}`
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
