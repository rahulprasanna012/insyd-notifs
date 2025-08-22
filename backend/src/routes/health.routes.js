import { Router } from "express";
import { healthz } from "../controllers/health.controller.js";
const r = Router();
r.get("/healthz", healthz);
export default r;