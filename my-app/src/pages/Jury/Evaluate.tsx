import { useState } from "react";
import { useParams } from "react-router-dom";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";

export default function Evaluate() {
  const { id } = useParams(); // submissionId
  const { user } = useAuth();

  const [backend, setBackend] = useState(0);
  const [frontend, setFrontend] = useState(0);
  const [database, setDatabase] = useState(0);
  const [functionality, setFunctionality] = useState(0);
  const [comment, setComment] = useState("");

  const handleSave = async () => {
    const total =
      (backend + frontend + database + functionality) / 4;

    await addDoc(collection(db, "evaluations"), {
      submissionId: id,
      juryId: user?.uid,

      scores: {
        backend,
        frontend,
        database,
        functionality
      },

      comment,
      total,
      createdAt: new Date()
    });

    alert("Оцінка збережена");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>📝 Оцінювання</h1>

      <p>Backend</p>
      <input type="number" onChange={e => setBackend(+e.target.value)} />

      <p>Frontend</p>
      <input type="number" onChange={e => setFrontend(+e.target.value)} />

      <p>Database</p>
      <input type="number" onChange={e => setDatabase(+e.target.value)} />

      <p>Functionality</p>
      <input type="number" onChange={e => setFunctionality(+e.target.value)} />

      <textarea
        placeholder="Коментар"
        onChange={e => setComment(e.target.value)}
      />

      <button onClick={handleSave}>
        Зберегти оцінку
      </button>
    </div>
  );
}