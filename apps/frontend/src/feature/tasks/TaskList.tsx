import { useState } from "react";
import TaskCard from "./TaskCard";
import TaskForm from "./TaskForm";

type Task = {
  id: string;
  title: string;
  estimatedSessions: number;
  completedSessions: number;
  color: string;
  isCompleted: boolean;
};
function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Build timer UI",
      estimatedSessions: 5,
      completedSessions: 4,
      color: "#EF4444",
      isCompleted: false,
    },
    {
      id: "2",
      title: "Write tests",
      estimatedSessions: 4,
      completedSessions: 1,
      color: "#3B82F6",
      isCompleted: false,
    },
    {
      id: "3",
      title: "Design landing page",
      estimatedSessions: 6,
      completedSessions: 6,
      color: "#8B5CF6",
      isCompleted: true,
    },
  ]);
  const [activeFilter, setActiveFilter] = useState<
    "all" | "active" | "completed"
  >("all");
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
  function handleComplete(id: string) {
    console.log("handleComplete clicked!");

    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, isCompleted: !task.isCompleted } : task,
      ),
    );
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

      {visibleTasks.length === 0 ? (
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
        onSubmit={(title, estimatedSession) => {
          console.log("submit: ", title, estimatedSession);
          setIsFormOpen(false);
        }}
      />
    </div>
  );
}

export default TaskList;
