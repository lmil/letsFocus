export function TaskDetail() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
        <button className="p-1 text-gray-500">
          <span className="text-lg">←</span>
        </button>
        <h1 className="text-base font-medium text-gray-900">Task</h1>
        <button className="p-1 text-gray-500">⋮</button>
      </div>

      <div className="flex flex-col gap-3 p-4">
        {/* Task card */}
        <div className="flex items-center bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="w-1 self-stretch bg-teal-400" />
          <div className="flex items-center justify-between flex-1 px-4 py-3">
            <span className="text-sm font-medium text-gray-900">
              Create a Design Wireframe
            </span>
          </div>
        </div>

        {/* Info row */}
        <div className="bg-white rounded-xl border border-gray-100 px-4 py-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Pomodoro</span>
            <span className="text-sm font-medium text-gray-900">2 / 4</span>
          </div>
        </div>

        {/* Session history */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <span className="text-sm text-gray-500">Session History</span>
          </div>
          <ul>
            <li className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
              <span className="text-sm text-gray-900">Focus · 25 min</span>
              <span className="text-xs text-green-500">completed</span>
            </li>
            <li className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
              <span className="text-sm text-gray-900">Focus · 31 min</span>
              <span className="text-xs text-green-500">completed</span>
            </li>
            <li className="flex items-center justify-between px-4 py-3">
              <span className="text-sm text-gray-400">Focus · 12 min</span>
              <span className="text-xs text-gray-400">stopped</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
