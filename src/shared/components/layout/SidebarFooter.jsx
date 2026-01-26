import { useState, useRef, useEffect } from "react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "../../../features/auth";

const UserAvatar = ({ user }) => (
  <img
    src={`https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true&name=${user?.name}`}
    alt=""
    className="w-10 h-10 rounded-md cursor-pointer"
  />
);

UserAvatar.propTypes = {
  user: PropTypes.object,
};

const UserDetails = ({ user }) => (
  <div className="leading-4 overflow-hidden">
    <div className="flex items-center gap-2 mb-1">
      <h4
        className="font-semibold text-sm truncate max-w-[100px]"
        title={user?.name}
      >
        {user?.name}
      </h4>
      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 font-bold uppercase tracking-wider whitespace-nowrap">
        {user?.role?.role_name}
      </span>
    </div>
    <p
      className="text-xs text-gray-500 dark:text-gray-400 truncate w-40"
      title={user?.email}
    >
      {user?.email}
    </p>
  </div>
);

UserDetails.propTypes = {
  user: PropTypes.object,
};

const SidebarFooter = ({ user, expanded }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch {
      // Even if logout fails, navigate to login
      navigate("/login");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="border-t relative p-3 bg-white dark:bg-gray-950 dark:border-gray-800"
      ref={dropdownRef}
    >
      <div
        className={`flex items-center ${!expanded ? "justify-center" : ""}`}
        onClick={() => !expanded && setShowDropdown(!showDropdown)}
      >
        <UserAvatar user={user} />

        <div
          className={`
            flex justify-between items-center
            overflow-hidden transition-all duration-300
            ${expanded ? "w-52 ml-3" : "w-0"}
          `}
        >
          <UserDetails user={user} />
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleLogout();
            }}
            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {/* Collapsed Mode Dropdown */}
      {!expanded && showDropdown && (
        <div className="absolute left-full bottom-0 ml-2 w-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-4 z-50">
          <div className="flex items-center gap-3 mb-4">
            {/* <UserAvatar user={user} /> */}
            <div className="overflow-hidden">
              <div className="flex items-center gap-2 mb-1">
                <h4
                  className="font-semibold text-sm truncate max-w-[120px]"
                  title={user?.name}
                >
                  {user?.name}
                </h4>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 font-bold uppercase tracking-wider whitespace-nowrap">
                  {user?.role?.role_name}
                </span>
              </div>
              <p
                className="text-xs text-gray-500 dark:text-gray-400 truncate w-44"
                title={user?.email}
              >
                {user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 p-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

SidebarFooter.propTypes = {
  user: PropTypes.object,
  expanded: PropTypes.bool,
};

export default SidebarFooter;
