import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where
} from "firebase/firestore";
import { db } from "../../firebase";
import { useParams } from "react-router-dom";

type TeamScore = {
  teamId: string;
  teamName: string;
  avgScore: number;
};

export default function Leaderboard() {
  const { id } = useParams(); // tournamentId

  const [data, setData] = useState<TeamScore[]>([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      // 📥 teams
      const teamsSnap = await getDocs(
        query(collection(db, "teams"), where("tournamentId", "==", id))
      );

      const teams = teamsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as any[];

      // 📥 submissions
      const subsSnap = await getDocs(
        query(collection(db, "submissions"), where("tournamentId", "==", id))
      );

      const subs = subsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as any[];

      // 📥 evaluations
      const evalSnap = await getDocs(collection(db, "evaluations"));

      const evaluations = evalSnap.docs.map(doc => doc.data());

      // 🧠 РАХУЄМО
      const result: TeamScore[] = teams.map(team => {
        const teamSubs = subs.filter(s => s.teamId === team.id);

        let allScores: number[] = [];

        teamSubs.forEach(sub => {
          const subEvals = evaluations.filter(
            e => e.submissionId === sub.id
          );

          subEvals.forEach(e => {
            allScores.push(e.total);
          });
        });

        const avg =
          allScores.length > 0
            ? allScores.reduce((a, b) => a + b, 0) / allScores.length
            : 0;

        return {
          teamId: team.id,
          teamName: team.teamName,
          avgScore: Math.round(avg)
        };
      });

      // 🔥 сортування
      result.sort((a, b) => b.avgScore - a.avgScore);

      setData(result);
    };

    fetchLeaderboard();
  }, [id]);

  return (
    <div style={{ padding: 20 }}>
      <h1>🏆 Leaderboard</h1>

      {data.map((team, index) => (
        <div
          key={team.teamId}
          style={{
            border: "1px solid #ccc",
            padding: 15,
            marginBottom: 10,
            borderRadius: 8,
            display: "flex",
            justifyContent: "space-between"
          }}
        >
          <div>
            <strong>#{index + 1}</strong> {team.teamName}
          </div>

          <div>⭐ {team.avgScore}</div>
        </div>
      ))}
    </div>
  );
}