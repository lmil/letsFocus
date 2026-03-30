import { useState } from "react";

type TaskFormProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, estimatedSessions: number) => void;
};
const pomodoroSessionCount = [1, 2, 3, 4, 5, 6, 7, 8];

function TaskForm({ isOpen, onClose, onSubmit }: TaskFormProps) {
  const [taskFormData, setTaskFormData] = useState({
    title: "",
    estimatedSessions: 4,
  });

  if (!isOpen) return null;

  return (
    <div
      className="absolute inset-0 bg-black/40 flex items-end"
      onClick={onClose}
    >
      <div
        className="w-full bg-white rounded-t-3xl px-5 pt-3 pb-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
        <input
          type="text"
          placeholder="Add a Task..."
          value={taskFormData.title}
          onChange={(e) =>
            setTaskFormData((prev) => ({ ...prev, title: e.target.value }))
          }
          className="border-b border-gray-100 pb-4 mb-5 w-full text-xl text-gray-800 placeholder-gray-300 outline-none "
        ></input>
        <div className="mb-5">
          <p className="text-sm text-gray-400 mb-3">Estimated Pomodoros</p>
          <div className="flex justify-between">
            {pomodoroSessionCount.map((n) => (
              <button
                className="w-8 h-8 rounded-full text-sm font-medium transition-colors"
                style={{
                  background:
                    taskFormData.estimatedSessions === n
                      ? "#FF6B6B"
                      : "#f3f4f6",
                  color:
                    taskFormData.estimatedSessions === n ? "white" : "#6b7280",
                }}
                key={n}
                onClick={() =>
                  setTaskFormData((prev) => ({ ...prev, estimatedSessions: n }))
                }
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
          <div className="flex gap-4 opacity-25 text-xs text-gray-400">
            <span className="flex flex-col gap-1 items-center">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#6b7280"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
              Date
            </span>
            <span className="flex flex-col gap-1 items-center">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#6b7280"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                <line x1="4" y1="22" x2="4" y2="15" />
              </svg>
              Priority
            </span>
            <span className="flex flex-col gap-1 items-center">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#6b7280"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
                <line x1="7" y1="7" x2="7.01" y2="7" />
              </svg>
              Tags
            </span>
            <span className="flex flex-col gap-1 items-center">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#6b7280"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="7" width="20" height="14" rx="2" />
                <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
              </svg>
              Project
            </span>
          </div>
          <button
            className="px-6 py-2 rounded-full text-sm font-semibold transition-opacity"
            style={{
              background: "#ff6b6b",
              color: "white",
              opacity: taskFormData.title.trim() ? 1 : 0.4,
            }}
            onClick={() => {
              if (!taskFormData.title.trim()) return;
              onSubmit(
                taskFormData.title.trim(),
                taskFormData.estimatedSessions,
              );
              setTaskFormData({ title: "", estimatedSessions: 4 });
            }}
          >
            add
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskForm;
