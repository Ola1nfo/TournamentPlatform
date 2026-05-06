import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import "./AdminHome.scss";

export default function AdminHome() {
  const [stats, setStats] = useState({
    users: 0,
    tournaments: 0,
    teams: 0,
    submissions: 0
  });

  const fetchStats = async () => {
    const usersSnap = await getDocs(collection(db, "users"));
    const tournamentsSnap = await getDocs(collection(db, "tournaments"));
    const teamsSnap = await getDocs(collection(db, "teams"));
    const submissionsSnap = await getDocs(collection(db, "submissions"));

    setStats({
      users: usersSnap.size,
      tournaments: tournamentsSnap.size,
      teams: teamsSnap.size,
      submissions: submissionsSnap.size
    });
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="admin-dashboard">

      <h1>📊 Admin Dashboard</h1>

      <div className="stats-grid">

        <div className="card">
          <h3>👥 Users</h3>
          <p>{stats.users}</p>
        </div>

        <div className="card">
          <h3>🏆 Tournaments</h3>
          <p>{stats.tournaments}</p>
        </div>

        <div className="card">
          <h3>⚔ Teams</h3>
          <p>{stats.teams}</p>
        </div>

        <div className="card">
          <h3>📤 Submissions</h3>
          <p>{stats.submissions}</p>
        </div>

      </div>

      <div className="actions">
        <h2>⚡ Quick Actions</h2>

        <button onClick={() => window.location.href = "/admin/tournaments"}>
          ➕ Створити турнір
        </button>

        <button onClick={() => window.location.href = "/admin/users"}>
          👥 Користувачі
        </button>

        <button onClick={() => window.location.href = "/admin/tournaments"}>
          🏆 Турніри
        </button>
      </div>

    </div>
  );
}