import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../services/auth";
import { useAuth } from "../../context/AuthContext";
import "./Header.scss";

export default function Header() {
  const navigate = useNavigate();
  const { user, role } = useAuth();

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  return (
    <header className="header">
      
      <div className="logo" onClick={() => navigate("/")}>
        🏆 Tournament System
      </div>

      <div className="right">
        {user && (
          <>
            <span className="role">
              {role}
            </span>

            <button className="logout" onClick={handleLogout}>
              🚪 Logout
            </button>
          </>
        )}
      </div>

    </header>
  );
}