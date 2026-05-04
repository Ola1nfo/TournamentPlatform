import { useState, useEffect } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

type Tournament = {
  id?: string;
  name: string;
  description: string;
  date: string;
};

export default function AdminTournaments() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  const [tournaments, setTournaments] = useState<Tournament[]>([]);

  // 📥 отримати турніри
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

  // ➕ створити турнір
  const createTournament = async () => {
    if (!name || !date) return;

    await addDoc(collection(db, "tournaments"), {
      name,
      description,
      date,
      createdAt: new Date()
    });

    setName("");
    setDescription("");
    setDate("");

    fetchTournaments();
  };

  return (
    <div>
      <h1>🏆 Турніри</h1>

      {/* CREATE FORM */}
      <div style={{ marginBottom: 20 }}>
        <h3>➕ Створити турнір</h3>

        <input
          placeholder="Назва"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <br />

        <input
          placeholder="Опис"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <br />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <br />

        <button onClick={createTournament}>
          Створити
        </button>
      </div>

      {/* LIST */}
      <h3>📋 Список турнірів</h3>

      {tournaments.map(t => (
        <div
          key={t.id}
          style={{
            border: "1px solid #ccc",
            padding: 10,
            marginBottom: 10
          }}
        >
          <h4>{t.name}</h4>
          <p>{t.description}</p>
          <p>📅 {t.date}</p>
        </div>
      ))}
    </div>
  );
}