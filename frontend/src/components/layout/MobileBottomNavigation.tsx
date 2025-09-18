import React from "react";
import { Home, History, LogOut } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useLocation } from "react-router-dom";

const MobileBottomNavigation: React.FC = () => {
  const { signOut } = useAuth();
  const location = useLocation();

  const navItems = [
    {
      path: "/",
      label: "Home",
      icon: Home,
    },
    {
      path: "/prayers",
      label: "History",
      icon: History,
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-[#FDD535]/70 shadow-lg z-50">
      <div className="flex items-center justify-around py-2 px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-[#FDD535]/40 !text-white"
                  : "!text-[#FDD535] hover:bg-[#FDD535]/20"
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}

        {/* Sign Out Button */}
        <button
          onClick={signOut}
          className="flex flex-col items-center justify-center py-2 px-3 rounded-lg text-[#FDD535] hover:bg-[#FDD535]/10 transition-colors"
          title="Sign Out"
        >
          <LogOut className="w-5 h-5 mb-1" />
          <span className="text-xs font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default MobileBottomNavigation;
