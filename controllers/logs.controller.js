const LogsData = require("../data/logs.data");

const Logs = {
  getLogs: async (req, res) => {
    try {
      const { idUser } = req.query;
      const tokenData = req.tokenData;

      const logs = await LogsData.getLogs({ idUser, tokenData });

      return res.status(200).json(logs);
    } catch (error) {
      return res.status(500).json({ message: "Erro ao consultar os logs" });
    }
  },
};

module.exports = Logs;
