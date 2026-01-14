const express = require("express");
const { authMiddleware } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Acesso permitido",
    userId: req.userId,
    email: req.userEmail,
  });
});

module.exports = router;
