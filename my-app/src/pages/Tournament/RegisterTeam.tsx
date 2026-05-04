import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc
} from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";

export default function RegisterTeam() {
  const { id } = useParams(); // tournamentId
  const navigate = useNavigate();
  const { user } = useAuth();

  const [teamName, setTeamName] = useState("");

  const [member1, setMember1] = useState({ name: "", email: "" });
  const [member2, setMember2] = useState({ name: "", email: "" });

  // 🔍 перевірка дублю
  const checkExistingTeam = async () => {
    const q = query(
      collection(db, "teams"),
      where("tournamentId", "==", id),
      where("captain.email", "==", user?.email)
    );

    const snap = await getDocs(q);
    return !snap.empty;
  };

  const handleRegister = async () => {
    if (!user) {
      alert("Увійдіть у систему");
      return;
    }

    if (!teamName || !member1.email || !member2.email) {
      alert("Заповніть всі поля");
      return;
    }

    // 🚫 дубль
    const exists = await checkExistingTeam();
    if (exists) {
      alert("Ви вже зареєстровані в цьому турнірі");
      return;
    }

    // 📦 перевірка турніру
    const tournamentRef = doc(db, "tournaments", id!);
    const tournamentSnap = await getDoc(tournamentRef);

    if (!tournamentSnap.exists()) {
      alert("Турнір не знайдено");
      return;
    }

    const tournament = tournamentSnap.data();

    if (tournament.status !== "registration") {
      alert("Реєстрація закрита");
      return;
    }

    if ((tournament.currentTeams || 0) >= tournament.maxTeams) {
      alert("Досягнуто ліміт команд");
      return;
    }

    // ➕ створення команди
    await addDoc(collection(db, "teams"), {
      tournamentId: id,

      teamName,

      captain: {
        name: member1.name,
        email: member1.email
      },

      members: [member1, member2],

      createdAt: new Date()
    });

    // 🔼 оновлення лічильника команд
    await updateDoc(tournamentRef, {
      currentTeams: (tournament.currentTeams || 0) + 1
    });

    alert("Команда успішно зареєстрована!");

    navigate(`/tournament/${id}`);
  };

  return (
    <div style={{
      maxWidth: 500,
      margin: "0 auto",
      padding: 30,
      display: "flex",
      flexDirection: "column",
      gap: 10
    }}>
      <h1>👥 Реєстрація команди</h1>

      <input
        placeholder="Назва команди"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
      />

      <h3>Капітан</h3>
      <input
        placeholder="Ім'я"
        value={member1.name}
        onChange={(e) =>
          setMember1({ ...member1, name: e.target.value })
        }
      />
      <input
        placeholder="Email"
        value={member1.email}
        onChange={(e) =>
          setMember1({ ...member1, email: e.target.value })
        }
      />

      <h3>Учасник 2</h3>
      <input
        placeholder="Ім'я"
        value={member2.name}
        onChange={(e) =>
          setMember2({ ...member2, name: e.target.value })
        }
      />
      <input
        placeholder="Email"
        value={member2.email}
        onChange={(e) =>
          setMember2({ ...member2, email: e.target.value })
        }
      />

      <button
        onClick={handleRegister}
        style={{
          marginTop: 10,
          padding: 10,
          background: "#4CAF50",
          color: "white",
          border: "none",
          cursor: "pointer"
        }}
      >
        Зареєструвати команду
      </button>
    </div>
  );
}