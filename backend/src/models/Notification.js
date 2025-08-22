import mongoose from "mongoose";

const ContentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },  // e.g., "Aditi liked your post"
    preview: { type: String, default: "" },   // e.g., comment snippet
  },
  { _id: false }
);

const NotificationSchema = new mongoose.Schema(
  {
    // the recipient (who sees this in their inbox)
    userId: { type: String, required: true, index: true },

    type: {
      type: String,
      enum: ["like", "comment", "follow", "new_post"],
      required: true,
    },

    // actor who triggered the event (who liked/commented/followed)
    actorId: { type: String, required: true },

   
    content: { type: ContentSchema, required: true },

    isRead: { type: Boolean, default: false },

    createdAt: { type: Date, default: () => new Date(), index: true },
  },
  { versionKey: false }
);

// Critical compound index for "my notifications newest first"
NotificationSchema.index({ userId: 1, createdAt: -1 });

// OPTIONAL (enable later when you add idempotency):
// Example unique key prevents exact duplicates for same moment/window
// NotificationSchema.index(
//   { userId: 1, type: 1, actorId: 1, entityId: 1, createdAt: 1 },
//   { unique: true, partialFilterExpression: { createdAt: { $exists: true } } }
// );

export default mongoose.model("Notification", NotificationSchema);
