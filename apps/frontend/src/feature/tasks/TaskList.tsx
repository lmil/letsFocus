import { useState } from "react";
import TaskCard from "./TaskCard";
import TaskForm from "./TaskForm";
import { useTasks } from "../../hooks/useTasks";
import { type Task } from "../../services/task.service";

function TaskList() {
  const TASK_COLORS = ["#EF4444", "#3B82F6", "#10B981", "#F97316", "#8B5CF6", "#14B8A6"];
  const { tasks, isLoading, isError, createTask, completeTask, deleteTask } = useTasks();
  const [activeFilter, setActiveFilter] = useState<"all" | "active" | "completed">("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const visibleTasks = tasks
    .filter((task) => {
      if (activeFilter === "active") return !task.isCompleted;
      if (activeFilter === "completed") return task.isCompleted;
      return true;
    })
    .sort((a, b) => {
      if (a.isCompleted === b.isCompleted) return 0;
      return a.isCompleted ? 1 : -1;
    });

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
        {(["all", "active", "completed"] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-1.5 rounded-full ${activeFilter === filter ? "bg-white text-[#FF6B6B]" : "bg-white/20 text-white"}`}
          >
            {filter}
          </button>
        ))}
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
