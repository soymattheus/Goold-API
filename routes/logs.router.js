const express = require("express");
const { authMiddleware } = require("../middleware/auth.middleware");
const Logs = require("../controllers/logs.controller");

const router = express.Router();

router.get("/", authMiddleware, Logs.getLogs);

module.exports = router;
