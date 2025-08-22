const mongoose = require("mongoose");
const EventSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["like", "comment", "follow", "new_post"],
      required: true,
    },

    // who performed the action
    actorId: { type: String, required: true },

    // who should receive the notification (not needed for new_post fanout)
    recipientId: { type: String },

    entityId: { type: String },
    // extra small payload: e.g., { commentPreview: "Nice!" }
    data: { type: mongoose.Schema.Types.Mixed },

    createdAt: { type: Date, default: () => new Date() },
  },
  { versionKey: false }
);

// Helps query recent events 
EventSchema.index({ createdAt: -1 });

module.exports= mongoose.model("Event", EventSchema);
