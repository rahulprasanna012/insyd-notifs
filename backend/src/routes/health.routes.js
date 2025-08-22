
const { Router} = require("express");
const healthz = require("../controllers/health.controller");


const r = Router();
r.get("/healthz", healthz);

module.exports = r;