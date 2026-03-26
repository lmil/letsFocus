import { NavLink } from "react-router-dom";
import {
  ClockIcon,
  Squares2X2Icon,
  CalendarDaysIcon,
  ChartBarIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

const tabs = [
  { to: "/", label: "Pomodoro", icon: ClockIcon },
  { to: "/manage", label: "Manage", icon: Squares2X2Icon },
  { to: "/calendar", label: "Calendar", icon: CalendarDaysIcon },
  { to: "/report", label: "Report", icon: ChartBarIcon },
  { to: "/settings", label: "Settings", icon: Cog6ToothIcon },
];

function BottomNav() {
  return (
    <nav className="bg-white border-t border-gray-100 px-2 py-2">
      <div className="flex justify-around items-center">
        {tabs.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors ${
                isActive
                  ? "text-[#FF6B6B]"
                  : "text-gray-400 hover:text-gray-600"
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span className="text-xs font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export default BottomNav;
