import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "jury" | "team";
};

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);

  // 📥 отримати користувачів
  const fetchUsers = async () => {
    const snap = await getDocs(collection(db, "users"));

    const data = snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as User[];

    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔄 змінити роль
  const changeRole = async (id: string, role: User["role"]) => {
    await updateDoc(doc(db, "users", id), { role });
    fetchUsers();
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>👥 Users</h1>

      {users.length === 0 && <p>Немає користувачів</p>}

      {users.map(user => (
        <div
          key={user.id}
          style={{
            border: "1px solid #ccc",
            padding: 15,
            marginBottom: 10,
            borderRadius: 8
          }}
        >
          <h3>{user.name}</h3>
          <p>{user.email}</p>

          <p>
            Роль: <b>{user.role}</b>
          </p>

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => changeRole(user.id, "team")}>
              👥 Team
            </button>

            <button onClick={() => changeRole(user.id, "jury")}>
              ⚖ Jury
            </button>

            <button onClick={() => changeRole(user.id, "admin")}>
              👑 Admin
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}