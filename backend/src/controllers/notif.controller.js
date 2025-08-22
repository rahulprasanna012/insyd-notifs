const Notification = require("../models/Notification");



/**
 * GET /notifications?userId=<id>&limit=20&cursor=<ISO or ObjectId>
 * - Sort: newest first
 * - Cursor: createdAt (ISO) preferred; fallback to ObjectId if you pass one
 */
 const listNotifications = async (req, res) => {
  try {
    const userId = String(req.query.userId || "").trim();
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const limit = Math.min(Math.max(parseInt(req.query.limit || "20", 10), 1), 100);

    // Build cursor filter
    const cursor = req.query.cursor ? String(req.query.cursor) : null;
    const filter = { userId };
    if (cursor) {
      const asDate = new Date(cursor);
      // If valid date string, use createdAt cursor
      if (!isNaN(asDate.getTime())) {
        filter.createdAt = { $lt: asDate };
      }
    }

    const items = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit + 1) // fetch one extra to know if there's a next page
      .lean();

    let nextCursor = null;
    if (items.length > limit) {
      const last = items[limit - 1];
      nextCursor = last.createdAt.toISOString();
      items.splice(limit); // trim extra
    }

    return res.status(200).json({ items, nextCursor });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[notif.listNotifications] error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * POST /notifications/mark-read
 * Body: { ids: string[] }
 */
 const markRead = async (req, res) => {
  try {
    const ids = Array.isArray(req.body?.ids) ? req.body.ids.filter(Boolean) : [];
    if (!ids.length) {
      return res.status(400).json({ error: "ids array is required" });
    }

    const result = await Notification.updateMany(
      { _id: { $in: ids } },
      { $set: { isRead: true } }
    );

    return res.status(200).json({ updated: result.modifiedCount || 0 });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[notif.markRead] error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


module.exports={markRead,listNotifications}