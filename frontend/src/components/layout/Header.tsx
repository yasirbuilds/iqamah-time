import { LogOut, Home, History } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

const Header = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [avatarError, setAvatarError] = useState(false);

  return (
    <header className="bg-black text-white border-b border-[#FDD535]/70 shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-16">
          <Link to="/" className="flex items-center gap-1">
            <img
              src="/images/prayer-mat.png"
              alt="Logo"
              className="w-10 h-10"
            />
            <h1 className="text-xl font-bold bg-gradient-to-br from-[#62d599] via-[#0ab499] to-[#196f54] bg-clip-text text-transparent">
              Iqamah Time
            </h1>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === "/"
                  ? "bg-[#FDD535]/40 !text-white"
                  : "!text-[#FDD535] hover:bg-[#FDD535]/20"
              }`}
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
            <Link
              to="/prayers"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === "/prayers"
                  ? "bg-[#FDD535]/40 !text-white"
                  : "!text-[#FDD535] hover:bg-[#FDD535]/20"
              }`}
            >
              <History className="w-4 h-4" />
              History
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            {user?.avatar && !avatarError ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full border-2 border-gray-300"
                onError={() => setAvatarError(true)}
              />
            ) : (
              <div className="w-10 h-10 rounded-full border border-gray-300 bg-[#FDD535] flex items-center justify-center text-black font-bold text-lg">
                {user?.name?.charAt(0).toUpperCase() || "?"}
              </div>
            )}
            <span className="hidden sm:block font-medium text-[#FDD535]">
              {user?.name}
            </span>
          </div>
          <button
            onClick={signOut}
            className="hidden md:flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg text-[#FDD535] font-medium transition-colors duration-200"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
