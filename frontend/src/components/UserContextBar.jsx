import { useEffect, useState } from "react";
import client from "../api/client";

export default function UserContextBar({ actorId, setActorId, currentUserId, setCurrentUserId }) {
  const [users, setUsers] = useState([]);

  const loadUsers = async () => {
    const { data } = await client.get("/users", { params: { limit: 200 } });
    setUsers(data || []);
  };

  useEffect(() => { loadUsers(); }, []);

  return (
    <div className="card" style={{ display: "grid", gap: 10 }}>
      <div className="row" style={{ gap: 12 }}>
        <label style={{ flex: 1 }}>
          <div className="muted">Actor (who performs events)</div>
          <select className="input" value={actorId || ""} onChange={(e)=>setActorId(e.target.value || null)}>
            <option value="">-- select actor --</option>
            {users.map(u => <option key={u._id} value={u._id}>{u._id} — {u.username}</option>)}
          </select>
        </label>
        <label style={{ flex: 1 }}>
          <div className="muted">Current User (whose notifications to show)</div>
          <select className="input" value={currentUserId || ""} onChange={(e)=>setCurrentUserId(e.target.value || null)}>
            <option value="">-- select current user --</option>
            {users.map(u => <option key={u._id} value={u._id}>{u._id} — {u.username}</option>)}
          </select>
        </label>
        <button className="btn" onClick={loadUsers}>Refresh users</button>
      </div>
      <div className="muted">
        Tip: Create users below, then refresh & select them here. “Actor” triggers events; “Current User” owns the inbox.
      </div>
    </div>
  );
}
