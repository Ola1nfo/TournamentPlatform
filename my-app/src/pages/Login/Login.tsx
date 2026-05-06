import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/auth";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import "./Login.scss";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogging, setIsLogging] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Введіть email і пароль");
      return;
    }

    try {
      setIsLogging(true);
      setError("");

      // 🔐 login
      const userCred = await loginUser(email, password);

      // 📥 отримуємо роль з Firestore
      const userDoc = await getDoc(doc(db, "users", userCred.uid));

      if (!userDoc.exists()) {
        setError("Користувач не знайдений у базі");
        return;
      }

      const userData = userDoc.data();

      // 🔥 редірект по ролі
      if (userData.role === "admin") navigate("/admin");
      else if (userData.role === "jury") navigate("/jury");
      else navigate("/team");

    } catch (e: any) {
      // 🔥 нормальні повідомлення
      if (e.code === "auth/user-not-found") {
        setError("Користувач не знайдений");
      } else if (e.code === "auth/wrong-password") {
        setError("Невірний пароль");
      } else if (e.code === "auth/invalid-email") {
        setError("Невірний email");
      } else {
        setError("Помилка входу");
      }
    } finally {
      setIsLogging(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">

        <h2 className="login-title">🔐 Login</h2>

        <input
          className="login-input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="login-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleLogin();
          }}
        />

        {/* ❌ ПОМИЛКА */}
        {error && <p className="error">{error}</p>}

        <div className="actions">

          <button
            className="login-button"
            onClick={handleLogin}
            disabled={isLogging}
          >
            {isLogging ? "Завантаження..." : "Увійти"}
          </button>

          <button
            className="login-button secondary"
            onClick={() => navigate("/register")}
          >
            Зареєструватися
          </button>

        </div>

      </div>
    </div>
  );
}