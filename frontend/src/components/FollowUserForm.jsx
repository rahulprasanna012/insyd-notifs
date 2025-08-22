import { useState } from "react";
import client from "../api/client";

export default function FollowUserForm() {
  const [targetId, setTargetId] = useState("userA");
  const [followerId, setFollowerId] = useState("userB");

  const submit = async (e) => {
    e.preventDefault();
    if (!targetId || !followerId) return alert("Both ids required");
    await client.post(`/users/${encodeURIComponent(targetId)}/follow`, { followerId });
    alert(`${followerId} now follows ${targetId}`);
  };

  return (
    <form onSubmit={submit} className="card">
      <h3 style={{ marginTop: 0 }}>Add Follower</h3>
      <input className="input" placeholder="Target user id (followed)" value={targetId} onChange={(e)=>setTargetId(e.target.value)} />
      <input className="input" placeholder="Follower user id" value={followerId} onChange={(e)=>setFollowerId(e.target.value)} />
      <div style={{ marginTop: 10 }}>
        <button className="btn" type="submit">Add Follower</button>
      </div>
    </form>
  );
}
