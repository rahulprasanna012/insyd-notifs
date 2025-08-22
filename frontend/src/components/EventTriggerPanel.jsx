import { useState } from "react";
import client from "../api/client";

export default function EventTriggerPanel({ actorId, currentUserId }) {
  const [recipientId, setRecipientId] = useState(currentUserId || "");
  const [entityId, setEntityId] = useState("post123");
  const [commentPreview, setCommentPreview] = useState("Nice!");

  const send = async (payload) => {
    if (!actorId) return alert("Select an Actor in the top bar first.");
    if (["like","comment","follow"].includes(payload.type) && !payload.recipientId) {
      return alert("Recipient is required for this event type.");
    }
    await client.post("/events", payload);
    alert("Event sent!");
  };

  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>Create Event</h3>

      <div className="muted" style={{ marginBottom: 8 }}>
        Actor: <strong>{actorId || "(not selected)"}</strong>
      </div>

      <div style={{ display: "grid", gap: 8, marginBottom: 12 }}>
        <input className="input" placeholder="Recipient user id" value={recipientId} onChange={(e)=>setRecipientId(e.target.value)} />
        <input className="input" placeholder="EntityId (post id)" value={entityId} onChange={(e)=>setEntityId(e.target.value)} />
        <input className="input" placeholder="Comment preview" value={commentPreview} onChange={(e)=>setCommentPreview(e.target.value)} />
      </div>

      <div className="row" style={{ flexWrap: "wrap" }}>
        <button className="btn" onClick={() => send({ type: "like", actorId, recipientId, entityId })}>Like</button>
        <button className="btn" onClick={() => send({ type: "comment", actorId, recipientId, entityId, data: { commentPreview } })}>Comment</button>
        <button className="btn" onClick={() => send({ type: "follow", actorId, recipientId })}>Follow</button>
        <button className="btn" onClick={() => send({ type: "new_post", actorId, entityId })}>New Post (fanout)</button>
      </div>
    </div>
  );
}
