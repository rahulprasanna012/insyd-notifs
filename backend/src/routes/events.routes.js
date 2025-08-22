import { Router } from "express";
import { createEvent } from "../controllers/events.controller.js";
const r = Router();
r.post("/", createEvent);
export default r;
