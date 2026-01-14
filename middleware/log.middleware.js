// src/middleware/log.middleware.js
const jwt = require("jsonwebtoken");
const db = require("../database/mysql");
const { v4: uuidv4 } = require("uuid");

module.exports = (options = {}) => {
  return (req, res, next) => {
    res.on("finish", async () => {
      try {
        let userId = "SYSTEM"; // fallback para rotas não autenticadas

        const authHeader = req.headers.authorization;
        if (authHeader) {
          const [, token] = authHeader.split(" ");
          try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            userId = decoded.idUser;
          } catch {
            // token inválido → mantém SYSTEM
          }
        }

        const activityType =
          options.activityType || `${req.method} ${req.originalUrl}`;

        const module =
          options.module || req.originalUrl.split("/")[1] || "unknown";

        await db.query(
          `INSERT INTO tb_log (
            id_logs,
            activity_type,
            module,
            created_at,
            id_user
          ) VALUES (?, ?, ?, ?, ?)`,
          [uuidv4(), activityType, module.substring(0, 15), new Date(), userId]
        );
      } catch (err) {
        console.error("Erro ao registrar log:", err.message);
      }
    });

    next();
  };
};
