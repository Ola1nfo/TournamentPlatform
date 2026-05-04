import './AdminTournaments.scss';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc
} from "firebase/firestore";
import { db } from "../../firebase";

type Tournament = {
  id?: string;
  name: string;
  description: string;

  startDate: string;
  registrationStart: string;
  registrationEnd: string;

  maxTeams: number;

  status: "draft" | "registration" | "running" | "finished";
};

export default function AdminTournaments() {
  const navigate = useNavigate(); // 👈 ОЦЕ ВАЖЛИВО

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [startDate, setStartDate] = useState("");
  const [registrationStart, setRegistrationStart] = useState("");
  const [registrationEnd, setRegistrationEnd] = useState("");

  const [maxTeams, setMaxTeams] = useState(10);

  const [tournaments, setTournaments] = useState<Tournament[]>([]);

  const fetchTournaments = async () => {
    const snap = await getDocs(collection(db, "tournaments"));
    const data = snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Tournament[];

    setTournaments(data);
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  const createTournament = async () => {
    if (!name || !startDate || !registrationStart || !registrationEnd) {
      alert("Заповни всі поля");
      return;
    }

    await addDoc(collection(db, "tournaments"), {
      name,
      description,
      startDate,
      registrationStart,
      registrationEnd,
      maxTeams,
      status: "draft",
      createdAt: new Date()
    });

    fetchTournaments();
  };

  const updateStatus = async (id: string, status: Tournament["status"]) => {
    await updateDoc(doc(db, "tournaments", id), { status });
    fetchTournaments();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft": return "gray";
      case "registration": return "green";
      case "running": return "orange";
      case "finished": return "red";
      default: return "white";
    }
  };

  return (
    <div className="admin-tournaments">
      <h1>🏆 Турніри</h1>

      {/* FORM */}
      <div className="form">
        <h3>➕ Створити турнір</h3>

        <input placeholder="Назва" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Опис" value={description} onChange={(e) => setDescription(e.target.value)} />

        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <input type="datetime-local" value={registrationStart} onChange={(e) => setRegistrationStart(e.target.value)} />
        <input type="datetime-local" value={registrationEnd} onChange={(e) => setRegistrationEnd(e.target.value)} />

        <input type="number" value={maxTeams} onChange={(e) => setMaxTeams(Number(e.target.value))} />

        <button onClick={createTournament}>
          Створити
        </button>
      </div>

      {/* LIST */}
      <div className="tournaments-list">
        {tournaments.map((t) => (
          <div
            key={t.id}
            className="card"
            onClick={() => navigate(`/tournament/${t.id}`)} // 👈 ПЕРЕХІД
          >
            <h3>{t.name}</h3>
            <p>{t.description}</p>

            <p>📅 {t.startDate}</p>
            <p>📝 {t.registrationStart} — {t.registrationEnd}</p>
            <p>👥 Макс: {t.maxTeams}</p>

            <div style={{ color: getStatusColor(t.status) }}>
              {t.status}
            </div>

            <div className="buttons">
              <button
                className="reg"
                onClick={(e) => {
                  e.stopPropagation();
                  updateStatus(t.id!, "registration");
                }}
              >
                Реєстрація
              </button>

              <button
                className="run"
                onClick={(e) => {
                  e.stopPropagation();
                  updateStatus(t.id!, "running");
                }}
              >
                Старт
              </button>

              <button
                className="finish"
                onClick={(e) => {
                  e.stopPropagation();
                  updateStatus(t.id!, "finished");
                }}
              >
                Фініш
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}