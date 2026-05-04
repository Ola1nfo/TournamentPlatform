import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminLayout() {
  const { role } = useAuth();

  if (role !== "admin") {
    return <h2>⛔ Нема доступу</h2>;
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>

      {/* SIDEBAR */}
      <div
        style={{
          width: "220px",
          background: "#1e1e2f",
          color: "white",
          padding: "20px"
        }}
      >
        <h2>👑 Admin</h2>

        <nav style={{ display: "flex", flexDirection: "column", gap: 10 }}>

          <NavLink to="/admin" style={{ color: "white" }}>
            Dashboard
          </NavLink>

          <NavLink to="/admin/users" style={{ color: "white" }}>
            Users
          </NavLink>

          <NavLink to="/admin/tournaments" style={{ color: "white" }}>
            Tournaments
          </NavLink>

        </nav>
      </div>

      {/* CONTENT */}
      <div style={{ flex: 1, padding: 20 }}>
        <Outlet />
      </div>

    </div>
  );
}