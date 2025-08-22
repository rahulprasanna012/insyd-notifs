const { Router } = require("express");
const { createUser, listUsers, getUser, addFollower } = require("../controllers/user.controller");

const r = Router();

r.post("/", createUser);             // POST /users
r.get("/", listUsers);               // GET /users
r.get("/:id", getUser);              // GET /users/:id
r.post("/:id/follow", addFollower);  // POST /users/:id/follow

module.exports=r;
