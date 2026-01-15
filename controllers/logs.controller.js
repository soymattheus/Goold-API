const { Log, User } = require("../models");

const Logs = {
  getLogs: async (req, res) => {
    try {
      const { idUser } = req.query;
      const tokenData = req.tokenData;

      const where = {};

      if (tokenData.typeUser !== "admin") {
        where.id_user = tokenData.userId;
      } else if (idUser) {
        where.id_user = idUser;
      }

      const logs = await Log.findAll({
        where,
        attributes: [
          "id_logs",
          "activity_type",
          "module",
          "created_at",
          "id_user",
        ],
        include: [
          {
            model: User,
            attributes: ["name", "type_user"],
          },
        ],
        order: [["created_at", "DESC"]],
      });

      return res.status(200).json(logs);
    } catch (error) {
      return res.status(500).json({ message: "Erro ao consultar os logs" });
    }
  },
};

module.exports = Logs;
