import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";

export default function Jury() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const navigate = useNavigate();

  // 📥 отримати всі submissions
  useEffect(() => {
    const fetchSubmissions = async () => {
      const snap = await getDocs(collection(db, "submissions"));

      const data = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setSubmissions(data);
    };

    fetchSubmissions();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>🧑‍⚖️ Jury Panel</h1>

      {submissions.length === 0 && (
        <p>Немає робіт для оцінювання</p>
      )}

      {submissions.map(sub => (
        <div
          key={sub.id}
          style={{
            border: "1px solid #ccc",
            padding: 15,
            marginBottom: 10,
            borderRadius: 8
          }}
        >
          <h3>📦 Робота</h3>

          <p>
            🔗 <a href={sub.github} target="_blank">GitHub</a>
          </p>

          <p>
            🎥 <a href={sub.video} target="_blank">Video</a>
          </p>

          {sub.live && (
            <p>
              🌐 <a href={sub.live} target="_blank">Live Demo</a>
            </p>
          )}

          <button
            style={{ marginTop: 10 }}
            onClick={() => navigate(`/jury/${sub.id}`)}
          >
            Оцінити
          </button>
        </div>
      ))}
    </div>
  );
}