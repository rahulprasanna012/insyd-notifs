import { useState } from "react";
import client from "../api/client";

export default function AddUserForm({ onCreated }) {
  const [id, setId] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!id || !username) return alert("_id and username are required");
    await client.post("/users", { _id: id.trim(), username: username.trim(), email: email.trim() || undefined });
    setId(""); setUsername(""); setEmail("");
    onCreated?.();
    alert("User created");
  };

  return (
    <form onSubmit={submit} className="card">
      <h3 style={{ marginTop: 0 }}>Create User</h3>
      <input className="input" placeholder="_id (e.g., userA)" value={id} onChange={(e)=>setId(e.target.value)} />
      <input className="input" placeholder="username (e.g., Alice)" value={username} onChange={(e)=>setUsername(e.target.value)} />
      <input className="input" placeholder="email (optional)" value={email} onChange={(e)=>setEmail(e.target.value)} />
      <div style={{ marginTop: 10 }}>
        <button className="btn" type="submit">Create</button>
      </div>
    </form>
  );
}
