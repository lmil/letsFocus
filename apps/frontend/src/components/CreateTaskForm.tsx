import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { api } from "../lib/api";

function CreateTaskForm() {
  const [title, setTitle] = useState("");

  const createTask = useMutation({
    mutationFn: async (taskTitle: string) => {
      const response = await api.post("/api/tasks", {
        title: taskTitle,
        userId: "2fd7af93-3f08-4c3b-a18d-d2cac3996f86",
      });
      return response.data;
    },
    onSuccess: (data) => {
      console.log("Task created!", data);
      setTitle("");
    },
    onError: (error) => {
      console.error("Failed to create task: ", error);
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    createTask.mutate(title);
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
          disabled={createTask.isPending}
          className="bg-[#FF6B6B] text-white rounded-lg px-4 py-2 font-semibold hover:bg-[#ff5252] transition-colors"
        >
          {createTask.isPending ? "Creating..." : "Create Task"}
        </button>
        {createTask.isError && (
          <p className="text-red-500 text-sm">
            Failed to create task. Try again.
          </p>
        )}
        {createTask.isSuccess && (
          <p className="text-green-500 text-sm">Task created successfully!</p>
        )}
      </form>
    </div>
  );
}

export default CreateTaskForm;
