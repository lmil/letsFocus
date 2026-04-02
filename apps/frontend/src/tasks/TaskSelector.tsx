import { useState } from "react";
import { useTasks } from "../hooks/useTasks";
import type { Task } from "../services/task.service";

type TaskSelectorProps = {
  isOpen: boolean;
  selectedTask: Task | null;
  onSelect: (task: Task | null) => void;
  onClose: () => void;
};

function TaskSelector({ isOpen, selectedTask, onSelect, onClose }: TaskSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { tasks } = useTasks();

  const activeTasks = tasks.filter((t) => !t.isCompleted);
  const filteredTasks = activeTasks.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (!isOpen) return null;

  return (
    <>
      <div className="absolute inset-0 bg-black/40 flex z-30 items-end" onClick={onClose}>
        <div
          className="w-full bg-white rounded-t-3xl px-5 pt-3 pb-8"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
          <p className="text-gray-800 font-semibold text-base mb-3">Select Task</p>
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5 mb-6">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9ca3af"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="flex-shrink-0"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search task..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 text-sm text-gray-700 placeholder-gray-300 outline-none bg-transparent"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#9ca3af"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
          <p className="text-xs text-gray-400 mb-2">Active Tasks</p>
          <div className="flex flex-col gap-1">
            {filteredTasks.map((task) => (
              <button
                key={task.id}
                onClick={() => {
                  onSelect(task);
                  onClose();
                }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-left transition-colors"
                style={{
                  background:
                    selectedTask?.id === task.id ? `${task.color}30` : "transparent",
                }}
              >
                <span
                  className="w-3 h-3 flex-shrink-0 rounded-full"
                  style={{ background: task.color }}
                />
                <span className="flex-1 min-w-0">
                  <span className="block text-sm text-gray-800 truncate">
                    {task.title}
                  </span>
                  <span className="block text-xs text-gray-400">
                    {task.completedSessions} / {task.estimatedSessions} sessions
                  </span>
                </span>
                <span className="flex-shrink-0 flex items-center justify-center w-4 h-4">
                  {selectedTask?.id === task.id ? (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={task.color}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    ""
                  )}
                </span>
              </button>
            ))}
          </div>
          <div className="border-t border-gray-100 mt-2 pt-2">
            <button
              onClick={() => {
                onSelect(null);
                onClose();
              }}
              className="flex-1 flex gap-3 items-center px-3 py-2.5 rounded-xl text-left"
            >
              <span className="w-2.5 h-2.5 border-2 border-gray-200 rounded-full flex-shrink-0" />
              <span className="flex-1 text-sm text-gray-400">No task -- just focus</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default TaskSelector;
