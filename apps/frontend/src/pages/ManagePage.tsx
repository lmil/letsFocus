import TaskList from "../feature/tasks/TaskList";

function ManagePage() {
  return (
    <div className="flex flex-col flex-1 px-4 py-6">
      <TaskList />
    </div>
  );
}

export default ManagePage;
