import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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

export default function SubmitSolution() {
  const { id } = useParams(); // tournamentId
  const { user } = useAuth();

  const [submission, setSubmission] = useState<any>(null);

  const [github, setGithub] = useState("");
  const [video, setVideo] = useState("");
  const [live, setLive] = useState("");
  const [description, setDescription] = useState("");

  const [deadlinePassed, setDeadlinePassed] = useState(false);

  // 🔍 load team submission
  useEffect(() => {
    const fetch = async () => {
      if (!user || !id) return;

      const q = query(
        collection(db, "teams"),
        where("tournamentId", "==", id),
        where("captain.email", "==", user.email)
      );

      const teamSnap = await getDocs(q);

      if (teamSnap.empty) return;

      const teamId = teamSnap.docs[0].id;

      const subQ = query(
        collection(db, "submissions"),
        where("teamId", "==", teamId),
        where("tournamentId", "==", id)
      );

      const subSnap = await getDocs(subQ);

      if (!subSnap.empty) {
        const data = subSnap.docs[0].data();
        setSubmission({ id: subSnap.docs[0].id, ...data });

        setGithub(data.github || "");
        setVideo(data.video || "");
        setLive(data.live || "");
        setDescription(data.description || "");
      }
    };

    fetch();
  }, [user, id]);

  // 📤 submit
  const handleSubmit = async () => {
    if (!user) return;

    if (!github || !video) {
      alert("GitHub і video обовʼязкові");
      return;
    }

    // знайти team
    const q = query(
      collection(db, "teams"),
      where("tournamentId", "==", id),
      where("captain.email", "==", user.email)
    );

    const teamSnap = await getDocs(q);
    if (teamSnap.empty) return;

    const teamId = teamSnap.docs[0].id;

    if (submission) {
      // update
      await updateDoc(doc(db, "submissions", submission.id), {
        github,
        video,
        live,
        description,
        updatedAt: new Date(),
        status: "submitted"
      });
    } else {
      // create
      await addDoc(collection(db, "submissions"), {
        tournamentId: id,
        teamId,

        github,
        video,
        live,
        description,

        createdAt: new Date(),
        status: "submitted"
      });
    }

    alert("Роботу здано!");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>📤 Submission</h1>

      <input
        placeholder="GitHub URL"
        value={github}
        onChange={(e) => setGithub(e.target.value)}
      />

      <input
        placeholder="Video URL"
        value={video}
        onChange={(e) => setVideo(e.target.value)}
      />

      <input
        placeholder="Live demo (optional)"
        value={live}
        onChange={(e) => setLive(e.target.value)}
      />

      <textarea
        placeholder="Опис"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        style={{
          marginTop: 10,
          padding: 10,
          background: "green",
          color: "white"
        }}
      >
        Submit
      </button>
    </div>
  );
}