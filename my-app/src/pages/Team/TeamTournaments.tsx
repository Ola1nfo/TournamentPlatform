import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";

type Tournament = {
  id: string;
  name: string;
  status: "draft" | "registration" | "running" | "finished";
  description?: string;
};

export default function TeamTournaments() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTournaments = async () => {
      const snap = await getDocs(collection(db, "tournaments"));

      const data = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Tournament[];

      setTournaments(data);
    };

    fetchTournaments();
  }, []);

  const getColor = (status: string) => {
    switch (status) {
      case "registration":
        return "green";
      case "running":
        return "orange";
      case "finished":
        return "red";
      default:
        return "gray";
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>🏆 Турніри</h1>

      {tournaments.map(t => (
        <div
          key={t.id}
          style={{
            border: "1px solid #ddd",
            padding: 15,
            marginBottom: 10,
            borderRadius: 8
          }}
        >
          <h3>{t.name}</h3>

          <p style={{ color: getColor(t.status) }}>
            {t.status}
          </p>

          <button
            onClick={() => navigate(`/tournament/${t.id}`)}
            style={{
              padding: "6px 12px",
              cursor: "pointer"
            }}
          >
            Відкрити
          </button>
        </div>
      ))}
    </div>
  );
}