const User = require("../models/User");


/**
 * POST /users
 * Body: { _id: "userA", username: "Alice", email?: "a@example.com" }
 * Creates a new user.
 */
 const createUser = async (req, res) => {
  try {
    const { _id, username, email } = req.body || {};
    if (!_id || !username) {
      return res.status(400).json({ error: "_id and username are required" });
    }

    const user = new User({ _id, username, email });
    await user.save();

    return res.status(201).json(user);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[user.createUser] error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * GET /users/:id
 * Fetch a single user by ID.
 */
 const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).lean();
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.status(200).json(user);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[user.getUser] error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * GET /users
 * List all users (limit optional).
 */
 const listUsers = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit || "50", 10), 200);
    const users = await User.find().limit(limit).lean();
    return res.status(200).json(users);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[user.listUsers] error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * POST /users/:id/follow
 * Body: { followerId: "userB" }
 * Add followerId to user’s followers[] array.
 */
 const addFollower = async (req, res) => {
  try {
    const { followerId } = req.body || {};
    if (!followerId) {
      return res.status(400).json({ error: "followerId is required" });
    }

    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { followers: followerId } }, // add only if not present
      { new: true }
    ).lean();

    if (!updated) return res.status(404).json({ error: "User not found" });
    return res.status(200).json(updated);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[user.addFollower] error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


module.exports = {addFollower,createUser,getUser, listUsers};