import { useEffect, useState } from "react";
import { api } from "../../services/api";

const NotificationList = () => {
  const [items, setItems] = useState(null);
  const [error, setError] = useState(null);

  const load = async () => {
    const res = await api.get("/notifications");
    setItems(res.data);
  };

  useEffect(() => {
    load().catch((err) => setError(err?.response?.data?.error || err.message));
  }, []);

  const markRead = async (id) => {
    await api.put(`/notifications/read/${id}`);
    await load();
  };

  const markAll = async () => {
    await api.put(`/notifications/read-all`);
    await load();
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Notifications</h2>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      <button onClick={markAll} disabled={!items?.length}>
        Mark all as read
      </button>

      {!items && !error && <p>Loading...</p>}
      {items && !items.length && <p>No notifications.</p>}

      {items && items.length > 0 && (
        <ul>
          {items.map((n) => (
            <li key={n._id} style={{ marginBottom: "0.75rem" }}>
              <div>
                <b>{n.title}</b> {n.isRead ? "(read)" : "(new)"}
              </div>
              <div>{n.message}</div>
              {!n.isRead && (
                <button onClick={() => markRead(n._id)}>Mark as read</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationList;
