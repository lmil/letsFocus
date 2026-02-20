import { useEffect, useState } from "react";
import { api } from "./lib/api";

function App() {
  const [backendStatus, setBackendStatus] = useState<string>("Checking...");

  useEffect(() => {
    api
      .get("/api/health")
      .then((res) => {
        setBackendStatus(res.data.message);
      })
      .catch((err) => {
        setBackendStatus("Error: Cannot connect to backend");
        console.error(err);
      });
  }, []);

  return (
    <>
      <div className="min-h-screen bg-[#FF6B6B] flex items-center justify-center flex-col gap-3">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-white mb-4">LetsFocus</h1>
          <p className="text-white text-xl">Your productivity companion</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-2">Backend Status:</h2>
          <p className="text-gray-700">{backendStatus}</p>
        </div>
      </div>
    </>
  );
}

export default App;
