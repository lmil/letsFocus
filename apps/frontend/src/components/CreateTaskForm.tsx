import { useState } from "react";

function CreateTaskForm() {
  const [title, setTitle] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("Submitting task: ", title);
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md">
      <h2 className="text-xl font-semibold mb-4">Create a Task</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Task title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
        />
        <button
          type="submit"
          className="bg-[#FF6B6B] text-white rounded-lg px-4 py-2 font-semibold hover:bg-[#ff5252] transition-colors"
        >
          Create Task
        </button>
      </form>
    </div>
  );
}

export default CreateTaskForm;
