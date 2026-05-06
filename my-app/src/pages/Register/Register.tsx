import "./Register.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/auth";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!email || !password || !name) {
      alert("Заповніть всі поля");
      return;
    }

    if (password.length < 6) {
      alert("Пароль має бути мінімум 6 символів");
      return;
    }

    try {
      setLoading(true);

      await registerUser(email, password, name);

      alert("Користувач створений!");
      navigate("/");

    } catch (e: any) {
      if (e.code === "auth/email-already-in-use") {
        alert("Цей email вже використовується");
      } else if (e.code === "auth/invalid-email") {
        alert("Невірний email");
      } else if (e.code === "auth/weak-password") {
        alert("Слабкий пароль");
      } else {
        alert(e.message || "Помилка реєстрації");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">

        <h2 className="register-title">Реєстрація</h2>

        <input
          className="register-input"
          placeholder="Ім’я"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="register-input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="register-input"
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleRegister();
          }}
        />

        <button
          className="register-button"
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? "Створення..." : "Зареєструватися"}
        </button>

      </div>
    </div>
  );
}