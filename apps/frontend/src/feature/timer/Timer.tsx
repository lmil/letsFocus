import { useEffect, useRef, useState } from "react";
import {
  startSession,
  pauseSession,
  resumeSession,
  stopSession,
  completeSession,
} from "../../services/session.service";
import type {
  CompleteSessionResponse,
  SessionType,
} from "../../services/session.service";
import { useMutation } from "@tanstack/react-query";
import {
  Cog6ToothIcon,
  XMarkIcon,
  ArrowPathIcon,
  ClockIcon,
  LockClosedIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";

type TimerSettings = {
  focusMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  sessionsUntilLongBreak: number;
};

type TimerMode = "pomodoro" | "strict" | "custom";

function Timer() {
  const [sessionType, setSessionType] = useState<SessionType>("FOCUS");
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
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [timerMode, setTimerMode] = useState<TimerMode>("pomodoro");

  const durations: Record<SessionType, number> = {
    FOCUS: settings.focusMinutes * 60 * 1000,
    SHORT_BREAK: settings.shortBreakMinutes * 60 * 1000,
    LONG_BREAK: settings.longBreakMinutes * 60 * 1000,
  };

  const startSessionMutation = useMutation({
    mutationFn: (startedAt: string) =>
      startSession({
        type: sessionType,
        duration: durations[sessionType] / 1000,
        startedAt,
      }),
  });

  const pauseSessionMutation = useMutation<void, Error, string>({
    mutationFn: (id: string) => pauseSession(id),
  });

  const resumeSessionMutation = useMutation<void, Error, string>({
    mutationFn: (id: string) => resumeSession(id),
  });

  const stopSessionMutation = useMutation<void, Error, string>({
    mutationFn: (id: string) => stopSession(id),
  });

  const completeSessionMutation = useMutation<
    CompleteSessionResponse,
    Error,
    string
  >({
    mutationFn: (id: string) => completeSession(id),
  });

  const sessionIdRef = useRef<string | null>(null);
  const completeSessionRef = useRef(completeSessionMutation.mutateAsync);

  useEffect(() => {
    sessionIdRef.current = sessionId;
    completeSessionRef.current = completeSessionMutation.mutateAsync;
  });

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

        const currentSessionId = sessionIdRef.current;
        setSessionId(null);

        if (currentSessionId) {
          completeSessionRef.current(currentSessionId).then((response) => {
            setSessionType(response.data.nextSessionType);
          });
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

  async function handleStart() {
    if (startTime !== null) return; // prevent double start

    const currentNow = Date.now();
    setNow(currentNow);
    setStartTime(currentNow);
    const response = await startSessionMutation.mutateAsync(
      new Date(currentNow).toISOString(),
    );
    setSessionId(response.data.sessionId);
  }

  async function handlePause() {
    if (startTime === null || sessionId === null) return;

    const currentSessionId = sessionId;
    const elapsedSinceStart = Date.now() - startTime;
    setAccumulatedMs((prev) => prev + elapsedSinceStart);
    setStartTime(null);
    await pauseSessionMutation.mutateAsync(currentSessionId);
  }

  async function handleResume() {
    if (startTime !== null || sessionId === null) return;
    const currentSessionId = sessionId;
    const currentNow = Date.now();
    setNow(currentNow);
    setStartTime(currentNow);
    await resumeSessionMutation.mutateAsync(currentSessionId);
  }

  async function handleStop() {
    if (sessionId === null) return;
    const currentSessionId = sessionId;
    setStartTime(null);
    setAccumulatedMs(0);
    setNow(Date.now());
    setSessionId(null);
    await stopSessionMutation.mutateAsync(currentSessionId);
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
            setSessionType("FOCUS");
            handleReset();
          }}
          className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
            sessionType === "FOCUS"
              ? "bg-white text-[#FF6B6B]"
              : "bg-white/20 text-white"
          }`}
        >
          Focus
        </button>
        <button
          onClick={() => {
            setSessionType("SHORT_BREAK");
            handleReset();
          }}
          className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
            sessionType === "SHORT_BREAK"
              ? "bg-white text-[#FF6B6B]"
              : "bg-white/20 text-white"
          }`}
        >
          Short Break
        </button>
        <button
          onClick={() => {
            setSessionType("LONG_BREAK");
            handleReset();
          }}
          className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
            sessionType === "LONG_BREAK"
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
            {sessionType === "FOCUS"
              ? `Session ${completedFocusSessions + 1} of ${settings.sessionsUntilLongBreak}`
              : sessionType === "SHORT_BREAK"
                ? completedFocusSessions === 0
                  ? `Short Break`
                  : `Short Break for Session ${completedFocusSessions}`
                : `Long Break`}
          </p>
        </div>
      </div>
      <div className="flex gap-4">
        <button
          onClick={
            isRunning
              ? handlePause
              : accumulatedMs > 0
                ? handleResume
                : handleStart
          }
          className="px-8 py-3 bg-white text-[#FF6B6B] rounded-3xl font-bold text-sm tracking-wide hover:scale-105 transition-transform"
        >
          {isRunning ? "Pause" : accumulatedMs > 0 ? "Resume" : "Start"}
        </button>
        {(isRunning || accumulatedMs > 0) && (
          <button
            onClick={handleStop}
            className="px-8 py-3 bg-white/20 text-white rounded-3xl font-bold text-sm tracking-wide hover:scale-105 transition-transform"
          >
            Stop
          </button>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => {
            setTimerMode("pomodoro");
            handleReset();
          }}
          title="Pomodoro Mode"
          className={`p-2 rounded-full transition-all ${
            timerMode === "pomodoro"
              ? "bg-white/30 text-white"
              : "text-white/40 hover:text-white/70"
          }`}
        >
          <ClockIcon className="w-5 h-5" />
        </button>
        <button
          onClick={() => {
            setTimerMode("strict");
            handleReset();
          }}
          title="Strict Mode"
          className={`p-2 rounded-full transition-all ${
            timerMode === "strict"
              ? "bg-white/30 text-white"
              : "text-white/40 hover:text-white/70"
          }`}
        >
          <LockClosedIcon className="w-5 h-5" />
        </button>
        <button
          onClick={() => {
            setTimerMode("custom");
            handleReset();
          }}
          title="Custom Mode"
          className={`p-2 rounded-full transition-all ${
            timerMode === "custom"
              ? "bg-white/30 text-white"
              : "text-white/40 hover:text-white/70"
          }`}
        >
          <AdjustmentsHorizontalIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default Timer;
