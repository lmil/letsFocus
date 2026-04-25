import { useNavigate } from "react-router-dom";
import { type Task } from "../../services/task.service";

type TaskCardProps = {
  task: Task;
  onComplete: (id: string) => void;
};
function TaskCard({ task, onComplete }: TaskCardProps) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/tasks/${task.id}`)}
      className="flex items-center rounded-2xl px-4 py-3 gap-3 cursor-pointer"
      style={{
        background: task.isCompleted ? "rgba(255,255,255,0.8)" : "white",
        opacity: task.isCompleted ? 0.7 : 1,
      }}
    >
      <div
        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
        style={{
          background: task.isCompleted ? `${task.color}60` : task.color,
        }}
      />
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm mb-1.5 truncate ${task.isCompleted ? "line-through text-black/30" : "text-gray-800"}`}
        >
          {task.title}
        </p>
        <div className="flex items-center gap-2">
          <div className="h-1 bg-gray-100 rounded-full overflow-hidden flex-1">
            {/* the bar */}
            <div
              className="h-full rounded-full"
              style={{
                width: `${(task.completedSessions / task.estimatedSessions) * 100}%`,
                background: task.isCompleted ? `${task.color}60` : task.color,
              }}
            />
          </div>
          <span className="text-xs text-gray-400 whitespace-nowrap">
            {task.completedSessions} / {task.estimatedSessions}
          </span>
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onComplete(task.id);
        }}
        className="w-5 h-5 border-2 rounded-full flex-shrink-0 flex items-center justify-center"
        style={{
          borderColor: task.isCompleted ? `${task.color}60` : "#e5e7eb",
          background: task.isCompleted ? `${task.color}20` : "transparent",
        }}
      >
        {task.isCompleted && (
          <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
            <polyline
              points="2,5 4,7.5 8,3"
              stroke={`${task.color}90`}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
export default TaskCard;
