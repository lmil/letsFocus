import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import type { Task } from "../../services/task.service";
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
  notificationsEnabled: boolean;
  soundEnabled: boolean;
};

type TimerMode = "pomodoro" | "strict" | "custom";
type TimerProps = {
  selectedTask: Task | null;
};

const getCompletionMessage = (type: SessionType) => {
  if (type === "FOCUS") {
    return {
      toast: "Focus session complete! Time for a break.",
      title: "LetsFocus — Session Complete 🍅",
      body: "Time for a break. Well done!",
    };
  }
  if (type === "SHORT_BREAK") {
    return {
      toast: "Break's over! Ready to focus?",
      title: "LetsFocus — Break Over ⏰",
      body: "Ready to focus again?",
    };
  }
  return {
    toast: "Long break done. Let's get back to it!",
    title: "LetsFocus — Long Break Done 💪",
    body: "Time to get back to it!",
  };
};

const playCompletionSound = () => {
  const context = new AudioContext();

  const beepCount = 6;
  const beepDuration = 0.18;
  const beepGap = 0.08;

  for (let i = 0; i < beepCount; i++) {
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.type = "square";

    const startAt = context.currentTime + i * (beepDuration + beepGap);
    const stopAt = startAt + beepDuration;

    // alternate between two frequencies for that classic alarm warble
    oscillator.frequency.setValueAtTime(1000, startAt);
    oscillator.frequency.setValueAtTime(1200, startAt + beepDuration / 2);

    gainNode.gain.setValueAtTime(0.4, startAt);
    gainNode.gain.setValueAtTime(0, stopAt);

    oscillator.start(startAt);
    oscillator.stop(stopAt);
  }
};

function Timer({ selectedTask }: TimerProps) {
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
    notificationsEnabled: true,
    soundEnabled: true,
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [timerMode, setTimerMode] = useState<TimerMode>("pomodoro");
  const [customMinutes, setCustomMinutes] = useState(25);
  const [notificationPermission, setNotificationPermission] =
    useState<NotificationPermission>(() => {
      if (typeof Notification === "undefined") return "denied";
      return Notification.permission;
    });

  const [toast, setToast] = useState<{ visible: boolean; message: string }>({
    visible: false,
    message: "",
  });
  const [showCongrats, setShowCongrats] = useState(false);
  const navigate = useNavigate();

  const durations: Record<SessionType, number> = {
    FOCUS: settings.focusMinutes * 60 * 1000,
    SHORT_BREAK: settings.shortBreakMinutes * 60 * 1000,
    LONG_BREAK: settings.longBreakMinutes * 60 * 1000,
  };

  const startSessionMutation = useMutation({
    mutationFn: ({ startedAt, taskId }: { startedAt: string; taskId?: string }) =>
      startSession({
        type: sessionType,
        duration: durations[sessionType] / 1000,
        startedAt,
        taskId,
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

  const completeSessionMutation = useMutation<CompleteSessionResponse, Error, string>({
    mutationFn: (id: string) => completeSession(id),
  });

  const sessionIdRef = useRef<string | null>(null);
  const completeSessionRef = useRef(completeSessionMutation.mutateAsync);

  useEffect(() => {
    sessionIdRef.current = sessionId;
    completeSessionRef.current = completeSessionMutation.mutateAsync;
  });

  useEffect(() => {
    if (!toast.visible) return;
    const timeout = setTimeout(() => {
      setToast({ visible: false, message: "" });
    }, 3000);
    return () => clearTimeout(timeout);
  }, [toast.visible]);

  // Derived values
  const isRunning = startTime !== null;
  const ringColor = !isRunning && accumulatedMs > 0 ? "#1A96F0" : "#FF6B6B";
  const primaryLabel = isRunning
    ? "Pause"
    : accumulatedMs > 0
      ? "Continue"
      : sessionType === "FOCUS"
        ? "Start to Focus"
        : "Start Break";
  const elapsedMs = accumulatedMs + (startTime !== null ? now - startTime : 0);
  const duration =
    timerMode === "custom" ? customMinutes * 60 * 1000 : durations[sessionType];
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

        const messages = getCompletionMessage(sessionType);

        setToast({ visible: true, message: messages.toast });

        if (settings.soundEnabled) {
          playCompletionSound();
        }

        if (settings.notificationsEnabled && notificationPermission === "granted") {
          new Notification(messages.title, { body: messages.body });
        }

        if (currentSessionId) {
          completeSessionRef.current(currentSessionId).then((response) => {
            if (response.data.task?.isCompleted) {
              setShowCongrats(true);
            } else if (timerMode !== "custom") {
              setSessionType(response.data.nextSessionType);
            }
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
    settings.notificationsEnabled,
    timerMode,
    notificationPermission,
    settings.soundEnabled,
  ]);

  async function handleStart() {
    if (startTime !== null) return; // prevent double start

    if (settings.notificationsEnabled && notificationPermission === "default") {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
    }

    const currentNow = Date.now();
    setNow(currentNow);
    setStartTime(currentNow);
    const response = await startSessionMutation.mutateAsync({
      startedAt: new Date(currentNow).toISOString(),
      taskId: selectedTask?.id,
    });
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

  const display = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0",
  )}`;

  const circumference = 2 * Math.PI * 112;
  const progress = timeLeftMs / duration;
  const dashOffset = circumference * (1 - progress);

  useEffect(() => {
    if (isRunning) {
      const label = sessionType === "FOCUS" ? "Focus" : "Break";
      document.title = `${display} - ${label} | LetSFocus`;
    } else {
      document.title = "LetsFocus";
    }
  }, [display, isRunning, sessionType]);

  return (
    <>
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
                  <h2 className="text-gray-800 font-bold text-lg">Timer Settings</h2>
                  <div className="flex items-center gap-2">
                    <button
                      title="Reset to defaults"
                      onClick={() =>
                        setSettings({
                          focusMinutes: 25,
                          shortBreakMinutes: 5,
                          longBreakMinutes: 15,
                          sessionsUntilLongBreak: 4,
                          notificationsEnabled: true,
                          soundEnabled: true,
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
                      <span className="text-gray-400">{settings.focusMinutes} min</span>
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
                      <span className="text-gray-600 font-medium">Short Break</span>
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
                      <span className="text-gray-600 font-medium">Long Break</span>
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
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-medium text-sm">Sound</span>
                    <button
                      onClick={() =>
                        setSettings((prev) => ({
                          ...prev,
                          soundEnabled: !prev.soundEnabled,
                        }))
                      }
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                        settings.soundEnabled
                          ? "bg-[#FF6B6B] text-white"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {settings.soundEnabled ? "ON" : "OFF"}
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-medium text-sm">
                      Notifications
                    </span>
                    <div className="flex items-center gap-2">
                      {notificationPermission === "denied" && (
                        <span className="text-xs text-gray-400">blocked in browser</span>
                      )}
                      <button
                        onClick={() =>
                          setSettings((prev) => ({
                            ...prev,
                            notificationsEnabled: !prev.notificationsEnabled,
                          }))
                        }
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                          settings.notificationsEnabled
                            ? "bg-[#FF6B6B] text-white"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {settings.notificationsEnabled ? "ON" : "OFF"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        {timerMode === "custom" && (
          <div className="flex items-center gap-3">
            <input
              type="number"
              min={1}
              max={120}
              value={customMinutes}
              onChange={(e) => {
                setCustomMinutes(Number(e.target.value));
                handleReset();
              }}
              className="w-20 text-center bg-white/20 text-white font-bold text-sm rounded-full px-3 py-1.5 outline-none"
            />
            <span className="text-white text-center bg-white/20 text-white font-bold text-sm rounded-full px-3 py-1.5 outline-none">
              Minutes
            </span>
          </div>
        )}

        <div className="relative flex items-center justify-center w-72 h-72">
          <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 280 280">
            <circle cx="140" cy="140" r="132" fill="white" />
            <circle
              cx="140"
              cy="140"
              r="112"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="12"
            />
            <circle
              cx="140"
              cy="140"
              r="112"
              fill="none"
              stroke={ringColor}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              style={{
                transition: "stroke-dashoffset 0.8s linear, stroke 0.3s ease",
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-1">
              <span className="text-gray-800 text-5xl font-bold tracking-widest">
                {display}
              </span>
              {timerMode === "strict" && (
                <p className="text-gray-400 text-xs font-semibold tracking-widest uppercase flex items-center justify-center gap-1">
                  <LockClosedIcon className="w-3 h-3" />
                  Strict
                </p>
              )}
              {timerMode === "pomodoro" && (
                <p className="text-gray-400 text-sm font-medium tracking-wide">
                  {sessionType === "FOCUS"
                    ? `Session ${completedFocusSessions + 1} of ${settings.sessionsUntilLongBreak}`
                    : sessionType === "SHORT_BREAK"
                      ? completedFocusSessions === 0
                        ? `Short Break`
                        : `Short Break for Session ${completedFocusSessions}`
                      : `Long Break`}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          {!isRunning && accumulatedMs > 0 && sessionType === "FOCUS" && (
            <button
              onClick={handleStop}
              className="px-8 py-3 bg-white/20 text-white rounded-3xl font-bold text-sm tracking-wide hover:scale-105 transition-transform"
            >
              Stop
            </button>
          )}
          {isRunning && sessionType !== "FOCUS" && (
            <button
              onClick={handleStop}
              className="px-8 py-3 bg-white/20 text-white rounded-3xl font-bold text-sm tracking-wide hover:scale-105 transition-transform"
            >
              Skip Break
            </button>
          )}
          <button
            onClick={
              isRunning ? handlePause : accumulatedMs > 0 ? handleResume : handleStart
            }
            disabled={isRunning && timerMode === "strict"}
            className={`px-8 py-3 bg-white text-[#FF6B6B] rounded-3xl font-bold text-sm tracking-wide transition-transform ${
              isRunning && timerMode === "strict"
                ? "opacity-40 cursor-not-allowed"
                : "hover:scale-105"
            }`}
          >
            {primaryLabel}
          </button>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => {
              setTimerMode("pomodoro");
              handleReset();
            }}
            disabled={isRunning || accumulatedMs > 0}
            title="Pomodoro Mode"
            className={`p-2 rounded-full transition-all ${
              isRunning || accumulatedMs > 0
                ? timerMode === "pomodoro"
                  ? "bg-white/30 text-white cursor-not-allowed"
                  : "text-white/20 cursor-not-allowed"
                : timerMode === "pomodoro"
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
            disabled={isRunning || accumulatedMs > 0}
            title="Strict Mode"
            className={`p-2 rounded-full transition-all ${
              isRunning || accumulatedMs > 0
                ? timerMode === "strict"
                  ? "bg-white/30 text-white cursor-not-allowed"
                  : "text-white/20 cursor-not-allowed"
                : timerMode === "strict"
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
            disabled={isRunning || accumulatedMs > 0}
            title="Custom Mode"
            className={`p-2 rounded-full transition-all ${
              isRunning || accumulatedMs > 0
                ? timerMode === "custom"
                  ? "bg-white/30 text-white cursor-not-allowed"
                  : "text-white/20 cursor-not-allowed"
                : timerMode === "custom"
                  ? "bg-white/30 text-white"
                  : "text-white/40 hover:text-white/70"
            }`}
          >
            <AdjustmentsHorizontalIcon className="w-5 h-5" />
          </button>
        </div>
        {toast.visible && (
          <div className="px-5 py-2.5 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-full">
            {toast.message}
          </div>
        )}
      </div>

      {showCongrats && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20 rounded-2xl">
          <div className="bg-white rounded-3xl px-8 py-10 mx-6 flex flex-col items-center gap-4 text-center">
            <span className="text-6xl">🏆</span>
            <h2 className="text-gray-800 text-2xl font-bold">Congratulations!</h2>
            <p className="text-gray-400 text-sm">
              You've completed all sessions for this task. Great work!
            </p>
            <button
              onClick={() => setShowCongrats(false)}
              className="w-full bg-[#ff6b6b] py-3 text-white font-semibold rounded-2xl hover:opacity-90 transition-opacity"
            >
              Back to Home
            </button>
            <button
              onClick={() => {
                setShowCongrats(false);
                navigate("/report");
              }}
              className="w-full py-3 bg-gray-100 text-gray-600 font-semibold rounded-2xl hover:opacity-90 transition-opacity"
            >
              View Report
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Timer;
