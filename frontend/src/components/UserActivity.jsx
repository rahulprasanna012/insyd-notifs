import { useEffect, useState } from "react";
import client from "../api/client";

export default function UserActivity({ actorId }) {
  const [items, setItems] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);

  const fetchPage = async (cursor) => {
    const params = { actorId, limit: 10 };
    if (cursor) params.cursor = cursor;
    const { data } = await client.get("/activity", { params });
    return data;
  };

  useEffect(() => {
    (async () => {
      const data = await fetchPage();
      setItems(data.items || []);
      setNextCursor(data.nextCursor || null);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actorId]);

  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>User Activity (actor: {actorId})</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {items.map((e) => (
          <li key={e._id} style={{ padding: "8px 10px", borderBottom: "1px solid #23242a" }}>
            <div style={{ fontWeight: 700 }}>{e.type}</div>
            <div className="muted">entity: {e.entityId || "-"} • {new Date(e.createdAt).toLocaleString()}</div>
          </li>
        ))}
      </ul>
      <button className="btn" onClick={async () => {
        if (!nextCursor) return;
        const data = await fetchPage(nextCursor);
        setItems((prev) => [...prev, ...(data.items || [])]);
        setNextCursor(data.nextCursor || null);
      }} disabled={!nextCursor}>
        Load more
      </button>
    </div>
  );
}
