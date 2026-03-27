import TaskCard from "./TaskCard";

type Task = {
  id: string;
  title: string;
  estimatedSessions: number;
  completedSessions: number;
  color: string;
  isCompleted: boolean;
};
const MOCK_TASKS: Task[] = [
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
];
function TaskList() {
  function handleComplete(id: string) {
    console.log("complete tapped: ", id);
  }

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-white font-bold text-lg">Tasks</h2>
        <button className="px-4 py-1.5 bg-white/20 hover:bg-white/30 text-white text-sm font-semibold rounded-full transition-colors">
          + Add Task
        </button>
      </div>
      {MOCK_TASKS.map((task) => (
        <TaskCard key={task.id} task={task} onComplete={handleComplete} />
      ))}
    </div>
  );
}

export default TaskList;
