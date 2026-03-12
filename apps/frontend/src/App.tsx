import { useEffect, useState } from "react";
import { api } from "./lib/api";
import Timer from "./feature/timer/Timer";

function App() {
  const [backendStatus, setBackendStatus] = useState<string>("Checking...");

  useEffect(() => {
    api
      .get("/health")
      .then(() => {
        setBackendStatus("connected ✅");
      })
      .catch((err) => {
        setBackendStatus("disconnected ❌");
        console.error(err);
      });
  }, []);

  return (
    <>
      <div className="min-h-screen bg-[#FF6B6B] flex items-center justify-center flex-col gap-3">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-white mb-4">LetsFocus</h1>
          <Timer />
        </div>
      </div>
    </>
  );
}

export default App;
