const db = require("../database/mysql");
const { v4: uuidv4 } = require("uuid");

exports.AuthData = {
  getUser: async (email) => {
    const [user] = await db.query("SELECT * FROM tb_user WHERE email = ?", [
      email,
    ]);
    return user;
  },

  createUser: async ({
    name,
    lastName,
    email,
    passwordHash,
    typeUser,
    zipCode,
    street,
    houseNumber,
    complement,
    neighborhood,
    city,
    state,
    permissionAppointments,
    permissionLogs,
  }) => {
    const [result] = await db.query(
      `
            INSERT INTO tb_user (
                id_user,
                name,
                last_name,
                email,
                password,
                type_user,
                zip_code,
                street,
                house_number,
                complement,
                neighborhood,
                city,
                state,
                permission_appointments,
                permission_logs,
                status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        uuidv4(),
        name,
        lastName,
        email,
        passwordHash,
        typeUser || "customer",
        zipCode || "",
        street || "",
        houseNumber,
        complement,
        neighborhood,
        city,
        state,
        permissionAppointments,
        permissionLogs,
        "0",
      ]
    );

    return result;
  },

  insertTokenAtBlacklist: async ({ token, expiresAt }) => {
    try {
      const [result] = await db.query(
        `INSERT INTO tb_token_blacklist (token, expires_at)
         VALUES (?, ?)`,
        [token, expiresAt]
      );

      return result;
    } catch (error) {
      return { message: "Erro ao inserir token na lista negra" };
    }
  },

  getlacklistToken: async ({ token }) => {
    try {
      const [rows] = await db.query(
        "SELECT token FROM tb_token_blacklist WHERE token = ?",
        [token]
      );

      return rows;
    } catch (error) {
      return { message: "Erro ao consultar token na lista negra" };
    }
  },
};
