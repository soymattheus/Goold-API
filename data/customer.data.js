const db = require("../database/mysql");
const { v4: uuidv4 } = require("uuid");

exports.CustomerData = {
  getCustomerList: async (email) => {
    const [user] = await db.query(
      "SELECT * FROM tb_user WHERE type_user = 'customer'"
    );
    return user;
  },

  updateUser: async ({
    userId,
    name,
    lastName,
    email,
    password,
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
    try {
      const fields = [];
      const values = [];

      if (name) {
        fields.push("name = ?");
        values.push(name);
      }

      if (lastName) {
        fields.push("last_name = ?");
        values.push(lastName);
      }

      if (email) {
        fields.push("email = ?");
        values.push(email);
      }

      if (password) {
        const passwordHash = await bcrypt.hash(password, 10);
        fields.push("password = ?");
        values.push(passwordHash);
      }

      if (zipCode !== undefined) {
        fields.push("zip_code = ?");
        values.push(zipCode);
      }

      if (street !== undefined) {
        fields.push("street = ?");
        values.push(street);
      }

      if (houseNumber !== undefined) {
        fields.push("house_number = ?");
        values.push(houseNumber);
      }

      if (complement !== undefined) {
        fields.push("complement = ?");
        values.push(complement);
      }

      if (neighborhood !== undefined) {
        fields.push("neighborhood = ?");
        values.push(neighborhood);
      }

      if (city !== undefined) {
        fields.push("city = ?");
        values.push(city);
      }

      if (state !== undefined) {
        fields.push("state = ?");
        values.push(state);
      }

      if (permissionAppointments !== undefined) {
        fields.push("permission_appointments = ?");
        values.push(permissionAppointments);
      }

      if (permissionLogs !== undefined) {
        fields.push("permission_logs = ?");
        values.push(permissionLogs);
      }

      if (fields.length === 0) {
        return { message: "Nenhum campo informado para atualização" };
      }

      values.push(userId);

      const [user] = await db.query(
        `UPDATE tb_user SET ${fields.join(", ")} WHERE id_user = ?`,
        values
      );

      return user;
    } catch (err) {
      console.error(err);
      return { message: "Erro ao atualizar perfil" };
    }
  },
};
