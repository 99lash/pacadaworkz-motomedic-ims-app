import { LogOut } from "lucide-react"
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../features/auth/authSlice";

const SidebarFooter = ({ user, expanded }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="border-t flex p-3">
      <img
        src={`https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true&name=${user?.name}`}
        alt=""
        className="w-10 h-10 rounded-md"
      />
      <div
        className={`
          flex justify-between items-center
          overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}
      `}
      >
        <div className="leading-4">
          <h4 className="font-semibold">{user?.name}</h4>
          <span className="text-xs text-gray-600">{user?.role}</span>
        </div>
        <button onClick={handleLogout} className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100">
          <LogOut size={20} />
        </button>
      </div>
    </div>
  )
}

export default SidebarFooter;