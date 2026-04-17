import { useState } from "react";
import Timer from "../feature/timer/Timer";
import type { Task } from "../services/task.service";
import TaskSelector from "../tasks/TaskSelector";

function PomodoroPage() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskSelectorOpen, setIsTaskSelectorOpen] = useState(false);

  function handleSelectTask(task: Task | null) {
    setSelectedTask(task);
  }

  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-8 py-8 px-4">
      <h1 className="text-5xl font-bold text-white">LetsFocus</h1>
      <button
        onClick={() => setIsTaskSelectorOpen(true)}
        className="bg-white/20 px-4 py-1.5 rounded-full text-white hover:bg-white/30 text-sm font-semibold transition-colors"
      >
        {selectedTask ? selectedTask.title : "+ Select Task"}
      </button>
      <Timer selectedTask={selectedTask} />
      <TaskSelector
        isOpen={isTaskSelectorOpen}
        selectedTask={selectedTask}
        onSelect={handleSelectTask}
        onClose={() => setIsTaskSelectorOpen(false)}
      />
    </div>
  );
}

export default PomodoroPage;
