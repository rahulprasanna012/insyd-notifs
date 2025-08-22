import { Router } from "express";
import { listNotifications, markRead } from "../controllers/notif.controller.js";
const r = Router();
r.get("/", listNotifications);
r.post("/mark-read", markRead);
export default r;