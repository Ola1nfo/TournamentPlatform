import "./Register.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/auth";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const navigate = useNavigate(); // 👈 ДОДАЛИ

  const handleRegister = async () => {
    try {
      await registerUser(email, password, name);

      alert("Користувач створений!");

      // 👉 РЕДІРЕКТ ПІСЛЯ РЕЄСТРАЦІЇ
      navigate("/"); // або "/login"

    } catch (e: any) {
      alert(e.message || "Помилка реєстрації");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">

        <h2 className="register-title">Реєстрація</h2>

        <input
          className="register-input"
          placeholder="Ім’я"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="register-input"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="register-input"
          type="password"
          placeholder="Пароль"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="register-button"
          onClick={handleRegister}
        >
          Зареєструватися
        </button>

      </div>
    </div>
  );
}