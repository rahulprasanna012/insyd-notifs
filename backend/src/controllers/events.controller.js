
const Notification = require("../models/Notification");
const User = require("../models/User");

/**
 * Body:
 * {
 *   type: "like" | "comment" | "follow" | "new_post",
 *   actorId: "userA",
 *   recipientId?: "userB",     // required except for new_post
 * 
 *   data?: { commentPreview?: string }
 * }
 */
const createEvent = async (req, res) => {
  try {
    const { type, actorId, recipientId, entityId, data } = req.body || {};

    if (!type || !actorId) {
      return res.status(400).json({ error: "type and actorId are required" });
    }

    const now = new Date();

    if (type === "new_post") {
      // Fanout to all followers of the actor
      const actor = await User.findById(actorId).lean();
      if (!actor) {
        return res.status(404).json({ error: "actor not found" });
      }
      const followers = Array.isArray(actor.followers) ? actor.followers : [];
      if (followers.length === 0) {
        return res.status(201).json({ status: "ok", created: 0 });
      }

      const notifs = followers
        .filter((uid) => uid && uid !== actorId)
        .map((uid) => ({
          userId: uid,
          type,
          actorId,
          entityId,
          content: { title: `${actor.username || actorId} published a new post`, preview: "" },
          isRead: false,
          createdAt: now,
        }));

      if (notifs.length) await Notification.insertMany(notifs, { ordered: false });
      return res.status(201).json({ status: "ok", created: notifs.length });
    }

    // Single-recipient types: like, comment, follow
    if (!recipientId) {
      return res.status(400).json({ error: "recipientId is required for this event type" });
    }

    
    const actor = await User.findById(actorId).lean();
    const actorName = actor?.username || actorId;

    const title =
      type === "like"
        ? `${actorName} liked your post`
        : type === "comment"
        ? `${actorName} commented on your post`
        : type === "follow"
        ? `${actorName} started following you`
        : "Activity";

    const notif = new Notification({
      userId: recipientId,
      type,
      actorId,
      entityId,
      content: { title, preview: data?.commentPreview || "" },
      isRead: false,
      createdAt: now,
    });

    await notif.save();
    return res.status(201).json({ status: "ok", created: 1 });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[events.createEvent] error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


module.exports = { createEvent };