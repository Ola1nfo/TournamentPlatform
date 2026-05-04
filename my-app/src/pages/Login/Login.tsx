import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { loginUser } from "../../services/auth";
import "./Login.scss";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { role } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await loginUser(email, password);

      setTimeout(() => {
        if (role === "admin") navigate("/admin");
        else if (role === "jury") navigate("/jury");
        else navigate("/team");
      }, 500);

    } catch (e: any) {
      alert(e.message);
    }
  };

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
          Увійти
        </button>

      </div>
    </div>
  );
}