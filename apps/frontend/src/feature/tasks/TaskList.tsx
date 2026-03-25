type Task = {
  id: string;
  title: string;
  estimatedSessions: number;
  completedSessions: number;
  color: string;
  isCompleted: boolean;
};

function TaskList() {
  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-white font-bold text-lg">Tasks</h2>
        <button className="px-4 py-1.5 bg-white/20 hover:bg-white/30 text-white text-sm font-semibold rounded-full transition-colors">
          + Add Task
        </button>
      </div>
    </div>
  );
}

export default TaskList;
