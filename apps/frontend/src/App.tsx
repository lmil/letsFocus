import { Route, Routes } from "react-router-dom";
import PomodoroPage from "./pages/PomodoroPage";
import ManagePage from "./pages/ManagePage";
import CalendarPage from "./pages/CalendarPage";
import ReportPage from "./pages/ReportPage";

function App() {
  return (
    <>
      <div className="min-h-screen bg-[#FF6B6B] flex items-center justify-center flex-col gap-3">
        <Routes>
          <Route path="/" element={<PomodoroPage />} />
          <Route path="/manage" element={<ManagePage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/settings" element={<ReportPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
