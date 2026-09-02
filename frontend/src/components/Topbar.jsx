import { MdMenu, MdLogout } from "react-icons/md";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Topbar = ({ title, onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Just take the first letter of the user's name for the avatar circle
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <header className="topbar">
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <button className="sidebar-toggle" onClick={onToggleSidebar}>
          <MdMenu />
        </button>
        <h1 className="topbar-title">{title}</h1>
      </div>

      <div className="topbar-right">
        <div className="user-chip">
          <div className="user-avatar">{initial}</div>
          <div className="user-info-text">
            <div className="name">{user?.name}</div>
            <div className="role">{user?.role}</div>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          <MdLogout /> Logout
        </button>
      </div>
    </header>
  );
};

export default Topbar;
