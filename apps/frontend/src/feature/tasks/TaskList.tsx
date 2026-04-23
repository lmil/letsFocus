import { useState, useRef, useEffect } from "react";
import TaskCard from "./TaskCard";
import TaskForm from "./TaskForm";
import { useTasks, type TaskFilters } from "../../hooks/useTasks";
import { type Task } from "../../services/task.service";

function TaskList() {
  const [filters, setFilters] = useState<TaskFilters>({
    status: "all",
    search: "",
    sort: "createdAt_desc",
  });
  const TASK_COLORS = ["#EF4444", "#3B82F6", "#10B981", "#F97316", "#8B5CF6", "#14B8A6"];
  const { tasks, isLoading, isError, createTask, completeTask, deleteTask } =
    useTasks(filters);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const visibleTasks = tasks;

  const sortOptions: { value: TaskFilters["sort"]; label: string }[] = [
    { value: "createdAt_desc", label: "Newest first" },
    { value: "createdAt_asc", label: "Oldest first" },
    { value: "progress_desc", label: "Most progress" },
  ];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleComplete(id: string) {
    await completeTask(id);
  }

  async function handleAddTask(title: string, estimatedSessions: number) {
    const randomColor = TASK_COLORS[Math.floor(Math.random() * TASK_COLORS.length)];
    await createTask({ title, estimatedSessions, color: randomColor });
    setIsFormOpen(false);
  }

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-white font-bold text-lg">Tasks</h2>
        <button
          onClick={() => setIsFormOpen(true)}
          className="px-4 py-1.5 bg-white/20 hover:bg-white/30 text-white text-sm font-semibold rounded-full transition-colors"
        >
          + Add Task
        </button>
      </div>

      <div className="flex gap-2 mb-2">
        {(["all", "active", "completed"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilters((f) => ({ ...f, status }))}
            className={`px-4 py-1.5 rounded-full ${filters.status === status ? "bg-white text-[#FF6B6B]" : "bg-white/20 text-white"}`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 bg-white/40 rounded-xl px-3 py-2 mb-2">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="flex-shrink-0 opacity-60"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder="Search tasks..."
          value={filters.search}
          onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
          className="flex-1 bg-transparent text-white placeholder-white/40 text-sm outline-none"
        />
        {filters.search && (
          <button onClick={() => setFilters((f) => ({ ...f, search: "" }))}>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-60"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-white/60 text-xs">Sort by</span>
        <div ref={sortRef} className="relative">
          <button
            onClick={() => setIsSortOpen((o) => !o)}
            className="flex items-center gap-1.5 bg-white/10 text-white text-xs rounded-lg px-2 py-1.5 cursor-pointer"
          >
            {sortOptions.find((o) => o.value === filters.sort)?.label}
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-transform ${isSortOpen ? "rotate-180" : ""}`}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          {isSortOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg overflow-hidden z-50 min-w-[120px]">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setFilters((f) => ({ ...f, sort: option.value }));
                    setIsSortOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-gray-100 ${
                    filters.sort === option.value
                      ? "text-[#FF6B6B] font-semibold"
                      : "text-gray-800"
                  }`}
                >
                  {filters.sort === option.value && (
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                  {filters.sort !== option.value && <span className="w-[10px]" />}
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center py-12">
          <p className="text-white/70 text-sm">Loading tasks...</p>
        </div>
      )}

      {isError && (
        <div className="flex justify-center py-12">
          <p className="text-white/70 text-sm">
            Failed to load tasks. Is the backend running?
          </p>
        </div>
      )}

      {!isLoading && !isError && visibleTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 gap-2">
          <p className="text-white font-medium">No tasks yet</p>
          <p className="text-white/50 text-sm">Tap + Add Task to get started</p>
        </div>
      ) : (
        visibleTasks.map((task) => (
          <TaskCard key={task.id} task={task} onComplete={handleComplete} />
        ))
      )}

      <TaskForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAddTask}
      />
    </div>
  );
}

export default TaskList;
