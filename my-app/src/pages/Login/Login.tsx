import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { loginUser } from "../../services/auth";
import "./Login.scss";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogging, setIsLogging] = useState(false);

  const { role, user, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setIsLogging(true);
      await loginUser(email, password);
    } catch (e: any) {
      alert(e.message);
      setIsLogging(false);
    }
  };

  // 🔥 ГОЛОВНА ЛОГІКА РЕДІРЕКТУ
  useEffect(() => {
    if (!loading && user) {
      if (role === "admin") navigate("/admin");
      else if (role === "jury") navigate("/jury");
      else navigate("/team");
    }
  }, [role, user, loading, navigate]);

  return (
    <div className="login-wrapper">
      <div className="login-card">

        <h2 className="login-title">🔐 Login</h2>

        <input
          className="login-input"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="login-input"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="login-button" onClick={handleLogin}>
          {isLogging ? "Завантаження..." : "Увійти"}
        </button>

      </div>
    </div>
  );
}