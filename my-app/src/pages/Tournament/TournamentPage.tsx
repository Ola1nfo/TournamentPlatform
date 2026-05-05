import "./TournamentPage.scss";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where
} from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";

type Tournament = {
  id: string;
  name: string;
  description: string;
  startDate: string;
  registrationStart: string;
  registrationEnd: string;
  maxTeams: number;
  status: "draft" | "registration" | "running" | "finished";
};

type Team = {
  id: string;
  teamName: string;
};

export default function TournamentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isRegistered, setIsRegistered] = useState(false);

  // 📥 tournament
  const fetchTournament = async () => {
    const snap = await getDoc(doc(db, "tournaments", id!));
    if (snap.exists()) {
      setTournament({ id: snap.id, ...snap.data() } as Tournament);
    }
  };

  // 📥 teams
  const fetchTeams = async () => {
    const q = query(
      collection(db, "teams"),
      where("tournamentId", "==", id)
    );

    const snap = await getDocs(q);

    const data = snap.docs.map(d => ({
      id: d.id,
      ...d.data()
    })) as Team[];

    setTeams(data);
  };

  // 🔍 перевірка реєстрації
  const checkRegistration = async () => {
    if (!user || !id) return;

    const q = query(
      collection(db, "teams"),
      where("tournamentId", "==", id),
      where("captain.email", "==", user.email)
    );

    const snap = await getDocs(q);

    setIsRegistered(!snap.empty);
  };

  useEffect(() => {
    fetchTournament();
    fetchTeams();
    checkRegistration();
  }, [id, user]);

  if (!tournament) return <p>Завантаження...</p>;

  return (
    <div className="tournament-page">

      {/* HEADER */}
      <div className="header">
        <h1>{tournament.name}</h1>

        <span className={`status ${tournament.status}`}>
          {tournament.status}
        </span>
      </div>

      {/* STATUS MESSAGE */}
      {tournament.status === "draft" && (
        <p>📝 Турнір ще не відкритий</p>
      )}

      {tournament.status === "registration" && (
        <p>🟢 Триває реєстрація</p>
      )}

      {tournament.status === "running" && (
        <p>⚔ Турнір у процесі</p>
      )}

      {tournament.status === "finished" && (
        <p>🏁 Турнір завершено</p>
      )}

      {/* DESCRIPTION */}
      <p className="description">
        {tournament.description}
      </p>

      {/* INFO */}
      <div className="info">
        <p>📅 Старт: {tournament.startDate}</p>
        <p>
          📝 Реєстрація:{" "}
          {tournament.registrationStart} — {tournament.registrationEnd}
        </p>
        <p>👥 Макс команд: {tournament.maxTeams}</p>
      </div>

      {/* 🟢 REGISTER */}
      {tournament.status === "registration" && (
        !user ? (
          <button
            className="join-btn"
            onClick={() => navigate("/")}
          >
            🔐 Увійдіть щоб зареєструватись
          </button>
        ) : isRegistered ? (
          <button className="join-btn" disabled>
            ✅ Ви вже зареєстровані
          </button>
        ) : (
          <button
            className="join-btn"
            onClick={() =>
              navigate(`/tournament/${id}/register`)
            }
          >
            🟢 Зареєструвати команду
          </button>
        )
      )}

      {/* 👥 TEAMS (ховаємо під час реєстрації) */}
      {tournament.status !== "registration" && (
        <div className="teams">
          <h3>👥 Команди ({teams.length})</h3>

          {teams.map(team => (
            <div key={team.id} className="team">
              {team.teamName}
            </div>
          ))}
        </div>
      )}

      {/* 🎯 TASK */}
      {tournament.status === "running" && (
        <div className="task">
          <h3>⚔ Завдання активне</h3>

          <button
            onClick={() =>
              navigate(`/tournament/${id}/submit`)
            }
          >
            📤 Подати роботу
          </button>
        </div>
      )}

      {/* 🏆 LEADERBOARD */}
      {tournament.status === "finished" && (
        <div className="leaderboard">
          <h3>🏆 Результати</h3>

          <button
            onClick={() =>
              navigate(`/tournament/${id}/leaderboard`)
            }
          >
            Переглянути рейтинг
          </button>
        </div>
      )}

    </div>
  );
}