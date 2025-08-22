import { Router } from "express";
import {
  createUser,
  getUser,
  listUsers,
  addFollower,
} from "../controllers/user.controller.js";

const r = Router();

r.post("/", createUser);             // POST /users
r.get("/", listUsers);               // GET /users
r.get("/:id", getUser);              // GET /users/:id
r.post("/:id/follow", addFollower);  // POST /users/:id/follow

export default r;
