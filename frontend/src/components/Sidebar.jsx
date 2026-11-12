import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar({ admin = false }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const links = admin
    ? [{ to: "/admin", label: "Overview" }]
    : [
        { to: "/employee", label: "Overview" },
        { to: "/rooms", label: "Find rooms" },
        { to: "/my-bookings", label: "My bookings" },
      ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark small">M</span>
        <span>MeetSpace</span>
      </div>

      <p className="nav-caption">
        {admin ? "ADMINISTRATION" : "WORKSPACE"}
      </p>

      <nav>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="user-chip">
          <div className="avatar">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div>
            <strong>{user?.username}</strong>
            <small>{admin ? "Administrator" : "Employee"}</small>
          </div>
        </div>

        <button className="logout-button" onClick={handleLogout}>
          Sign out
        </button>
      </div>
    </aside>
  );
}