
const Router = require("express");
const { createEvent } = require("../controllers/events.controller");


const r = Router();
r.post("/", createEvent);

module.exports = r;
