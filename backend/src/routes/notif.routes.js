const { Router } = require("express");

const { listNotifications, markRead } = require("../controllers/notif.controller");
const r = Router();
r.get("/", listNotifications);
r.post("/mark-read", markRead);

module.exports = r;