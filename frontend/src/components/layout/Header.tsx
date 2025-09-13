import { Building2, LogOut } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const Header = () => {
  const { user, signOut } = useAuth();
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Building2 className="w-8 h-8 text-indigo-600" />
          <h1 className="text-xl font-bold text-gray-900">Iqamah Time</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            {user?.avatar && (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full border-2 border-gray-300"
              />
            )}
            <span className="hidden sm:block font-medium text-gray-700">
              {user?.name}
            </span>
          </div>
          <button
            onClick={signOut}
            className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg text-gray-700 font-medium transition-colors duration-200"
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
