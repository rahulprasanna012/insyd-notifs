import { useState } from "react";
import AddUserForm from "../components/AddUserForm";
import FollowUserForm from "../components/FollowUserForm";
import UsersList from "../components/UsersList";
import EventTriggerPanel from "../components/EventTriggerPanel";
import NotificationList from "../components/NotificationList";
import UserContextBar from "../components/UserContextBar";
import Badge from "../components/Badge";

export default function DemoPage() {
  const [actorId, setActorId] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  return (
    <div style={{ maxWidth: 1200, margin: "24px auto", padding: "0 16px" }}>
      <h2 style={{ margin: "0 0 12px" }}>Insyd Notifications — POC</h2>

    
      {/* Top selector bar */}
      <UserContextBar
        actorId={actorId}
        setActorId={setActorId}
        currentUserId={currentUserId}
        setCurrentUserId={setCurrentUserId}
      />

      {/* Users section */}
      <div className="grid-3" style={{ marginTop: 16 }}>
        <AddUserForm />
       
        <UsersList />
      </div>

      {/* Events + Notifications */}
      <div className="grid-2" style={{ marginTop: 16 }}>
        <EventTriggerPanel actorId={actorId} currentUserId={currentUserId} />
        <NotificationList currentUserId={currentUserId} />
      </div>
    </div>
  );
}
