import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import client from "../api/client";
import usePolling from "../hook/usePolling";
import Badge from "./Badge";

export default function NotificationList({ currentUserId }) {
  const [items, setItems] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [selected, setSelected] = useState(new Set());
  const [error, setError] = useState(null);
  const lastTopIdRef = useRef(null); // 👈 track last top notification id we rendered

  const unreadCount = useMemo(
    () => items.reduce((acc, n) => acc + (n?.isRead ? 0 : 1), 0),
    [items]
  );

  const fetchPage = useCallback(async (cursor) => {
    if (!currentUserId) return { items: [], nextCursor: null };
    const params = { userId: currentUserId, limit: 20 };
    if (cursor) params.cursor = cursor;
    const { data } = await client.get("/notifications", { params });
    return data;
  }, [currentUserId]);

  const pollingFn = useCallback(async () => {
    if (!currentUserId) return null;
    return await fetchPage(); // latest page only
  }, [currentUserId, fetchPage]);

  const { data: polled, err: pollErr, refresh: pollNow } = usePolling(pollingFn, {
    intervalMs: 10000,
    immediate: true,
  });

  // ✅ Merge polled items only if something actually changed
  useEffect(() => {
    if (!polled || !Array.isArray(polled.items)) return;

    const incoming = polled.items;
    const newTopId = incoming[0]?._id || null;

    // If top id didn’t change and lengths match our current first-page slice, skip
    if (newTopId && lastTopIdRef.current === newTopId) {
      // extra safety: if the first items are identical sizes and ids, bail
      const sameLength = items.length >= incoming.length;
      if (sameLength) {
        let same = true;
        for (let i = 0; i < incoming.length; i++) {
          if (items[i]?._id !== incoming[i]?._id) { same = false; break; }
        }
        if (same) return; // 👈 prevents unnecessary setState → render loops
      }
    }

    setItems((prev) => {
      const incomingIds = new Set(incoming.map((n) => n._id));
      const older = prev.filter((n) => !incomingIds.has(n._id));
      return [...incoming, ...older];
    });
    setNextCursor(polled.nextCursor || null);
    lastTopIdRef.current = newTopId;
  }, [polled, items]);

  // ✅ Reset when user changes; do NOT depend on pollNow (it’s stable, but keep deps minimal)
  useEffect(() => {
    setItems([]);
    setNextCursor(null);
    setSelected(new Set());
    setError(null);
    if (currentUserId) pollNow(); // fire one immediate poll
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserId]);

  const loadMore = async () => {
    if (!nextCursor || !currentUserId) return;
    const data = await fetchPage(nextCursor);
    setItems((prev) => [...prev, ...(data.items || [])]);
    setNextCursor(data.nextCursor || null);
  };

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const copy = new Set(prev);
      copy.has(id) ? copy.delete(id) : copy.add(id);
      return copy;
    });
  };

  const markSelectedRead = async () => {
    if (selected.size === 0) return;
    const ids = Array.from(selected);
    await client.post("/notifications/mark-read", { ids });
    setItems((prev) => prev.map((n) => (ids.includes(n._id) ? { ...n, isRead: true } : n)));
    setSelected(new Set());
    pollNow(); // optional: refresh first page
  };

  return (
    <div className="card">
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <div className="row" style={{ alignItems: "center", gap: 10 }}>
          <h3 style={{ margin: 0 }}>Notifications</h3>
          <Badge count={unreadCount} />
          <span className="muted">Auto-refresh: 10s</span>
        </div>
        <button className="btn" onClick={markSelectedRead} disabled={selected.size === 0}>
          Mark selected read ({selected.size})
        </button>
      </div>

      {!currentUserId && <p className="muted" style={{ marginTop: 8 }}>Select a “Current User” in the top bar.</p>}
      {(error || pollErr) && <p style={{ color: "crimson" }}>{String((error || pollErr)?.message || "Failed to load")}</p>}
      {items.length === 0 && currentUserId && <p className="muted">No notifications yet.</p>}

      <ul style={{ listStyle: "none", padding: 0, marginTop: 12 }}>
        {items.map((n) => (
          <li key={n._id} style={{
            padding: "8px 10px",
            marginBottom: 8,
            borderRadius: 6,
            border: "1px solid var(--border)",
            background: n.isRead ? "#0d0f13" : "#1b1910",
          }}>
            <label style={{ display: "flex", gap: 10, alignItems: "start" }}>
              <input
                type="checkbox"
                checked={selected.has(n._id)}
                onChange={() => toggleSelect(n._id)}
                style={{ marginTop: 4 }}
              />
              <div>
                <div style={{ fontWeight: 700 }}>{n.content?.title || n.type}</div>
                {n.content?.preview ? <div className="muted">{n.content.preview}</div> : null}
                <div className="muted" style={{ marginTop: 4 }}>
                  {new Date(n.createdAt).toLocaleString()}
                  {!n.isRead && <span style={{ marginLeft: 8, color: "#f0ad4e" }}>• Unread</span>}
                </div>
              </div>
            </label>
          </li>
        ))}
      </ul>

      <div className="row" style={{ justifyContent: "flex-end", gap: 8 }}>
        <button className="btn" onClick={pollNow} disabled={!currentUserId}>Refresh</button>
        <button className="btn" onClick={loadMore} disabled={!nextCursor || !currentUserId}>Load more</button>
      </div>
    </div>
  );
}
