const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
   
    _id: { type: String, required: true }, // e.g., "userA"
    username: { type: String, required: true, trim: true, unique: true },
    email: { type: String, trim: true},

    // For POC fanout on new_post: list of userIds that follow THIS user
    // Example: if userA has followers ["userB","userC"] and userA posts,
    //create notifications for B and C.
    followers: { type: [String], default: [] },
  },
  { timestamps: true, versionKey: false }
);

// Handy index for follower lookups (not strictly required for POC)
UserSchema.index({ username: 1 });

module.exports=mongoose.model("User", UserSchema);
