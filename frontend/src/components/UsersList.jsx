import { useEffect, useState } from "react";
import client from "../api/client";

export default function UsersList() {
  const [users, setUsers] = useState([]);

  const load = async () => {
    const { data } = await client.get("/users", { params: { limit: 100 } });
    setUsers(data || []);
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>Users</h3>
      <button className="btn" onClick={load} style={{ marginBottom: 10 }}>Refresh</button>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {users.map(u => (
          <li key={u._id} style={{ padding: "6px 8px", borderBottom: "1px solid var(--border)" }}>
            <strong>{u._id}</strong> — {u.username} {u.email ? `• ${u.email}` : ""}
            {Array.isArray(u.followers) && u.followers.length > 0 && (
              <div className="muted">followers: {u.followers.join(", ")}</div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
