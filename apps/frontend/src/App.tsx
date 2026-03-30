import { Route, Routes } from "react-router-dom";
import PomodoroPage from "./pages/PomodoroPage";
import ManagePage from "./pages/ManagePage";
import CalendarPage from "./pages/CalendarPage";
import ReportPage from "./pages/ReportPage";
import BottomNav from "./components/BottomNav";

function App() {
  return (
    <>
      <div className="relative h-screen bg-[#FF6B6B] flex flex-col max-w-sm mx-auto">
        <div className="flex-1 flex flex-col overflow-hidden">
          <Routes>
            <Route path="/" element={<PomodoroPage />} />
            <Route path="/manage" element={<ManagePage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/report" element={<ReportPage />} />
            <Route path="/settings" element={<ReportPage />} />
          </Routes>
        </div>
        <BottomNav />
      </div>
    </>
  );
}

export default App;
