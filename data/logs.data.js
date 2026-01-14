const db = require("../database/mysql");

const LogsData = {
  getLogs: async ({ idUser, tokenData }) => {
    try {
      let query = `
      SELECT
        tl.id_logs,
        tl.activity_type,
        tl.module,
        tl.created_at,
        tl.id_user,
        tu.name,
        tu.type_user
      FROM tb_log tl
      JOIN tb_user tu on tu.id_user = tl.id_user
    `;
      const values = [];

      if (tokenData.typeUser !== "admin") {
        query += " WHERE tl.id_user = ?";
        values.push(tokenData.userId);
      } else if (idUser) {
        query += " WHERE tl.id_user = ?";
        values.push(idUser);
      }

      query += " ORDER BY tl.created_at DESC";

      const [logs] = await db.query(query, values);

      return logs;
    } catch (err) {
      return {
        message: "Erro ao buscar logs",
      };
    }
  },
};

module.exports = LogsData;
