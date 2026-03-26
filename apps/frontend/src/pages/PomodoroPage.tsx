import Timer from "../feature/timer/Timer";

function PomodoroPage() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-8 py-8 px-4">
      <h1 className="text-5xl font-bold text-white">LetsFocus</h1>
      <Timer />
    </div>
  );
}

export default PomodoroPage;
