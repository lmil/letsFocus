import { useNavigate, useParams } from "react-router-dom";
import { useTask } from "../hooks/useTask";

export function TaskDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: task, isLoading, isError } = useTask(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-sm text-gray-400">Loading...</span>
      </div>
    );
  }

  if (isError || !task) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-sm text-red-400">Task not found.</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
        <button className="p-1 text-gray-500" onClick={() => navigate(-1)}>
          <span className="text-lg">←</span>
        </button>
        <h1 className="text-base font-medium text-gray-900">Task</h1>
        <button className="p-1 text-gray-500">⋮</button>
      </div>

      <div className="flex flex-col gap-3 p-4">
        {/* Task card */}
        <div className="flex items-center bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="w-1 self-stretch" style={{ backgroundColor: task.color }} />
          <div className="flex items-center flex-1 px-4 py-3">
            <span className="text-sm font-medium text-gray-900">{task.title}</span>
          </div>
        </div>

        {/* Info row */}
        <div className="bg-white rounded-xl border border-gray-100 px-4 py-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Pomodoro</span>
            <span className="text-sm font-medium text-gray-900">
              {task.completedSessions} / {task.estimatedSessions}
            </span>
          </div>
        </div>

        {/* Session history */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <span className="text-sm text-gray-500">Session History</span>
          </div>
          {task.sessions.length === 0 ? (
            <p className="px-4 py-3 text-sm text-gray-400">No sessions yet.</p>
          ) : (
            <ul>
              {task.sessions.map((session, index) => {
                const minutes = Math.round(
                  (session.actualDuration ?? session.duration) / 60,
                );
                const isLast = index === task.sessions.length - 1;
                return (
                  <li
                    key={session.id}
                    className={`flex items-center justify-between px-4 py-3 ${!isLast ? "border-b border-gray-50" : ""}`}
                  >
                    <span
                      className={`text-sm ${session.isCompleted ? "text-gray-900" : "text-gray-400"}`}
                    >
                      Focus · {minutes} min
                    </span>
                    <span
                      className={`text-xs ${session.isCompleted ? "text-green-500" : "text-gray-400"}`}
                    >
                      {session.isCompleted ? "completed" : "stopped"}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
