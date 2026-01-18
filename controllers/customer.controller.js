const bcrypt = require("bcryptjs");
const { User } = require("../models");

const CustomerController = {
  getCustomerList: async (req, res) => {
    try {
      const typeUser = req.typeUser;

      if (typeUser !== "admin") {
        return res.status(401).json({
          message: "Apenas administradores podem consultar a lista de clientes",
        });
      }

      const users = await User.findAll({
        where: { type_user: "customer" },
        attributes: {
          exclude: ["password", "decrypted_password"],
        },
        order: [["created_at", "DESC"]],
      });

      const formatted = users.map((item) => {
        const user = item.get();

        return {
          ...user,
          full_name: `${user.name} ${user.last_name}`,
        };
      });

      return res.status(200).json(formatted);
    } catch (error) {
      return res.status(500).json({
        message: "Erro ao buscar clientes",
      });
    }
  },

  updateProfile: async (req, res) => {
    try {
      let userId = "";

      if (req.typeUser !== "admin") {
        userId = req.userId;
      } else {
        const { idUser } = req.params;
        userId = idUser;
      }

      if (
        req.typeUser === "customer" &&
        (req.body.permission_appointments !== undefined ||
          req.body.permission_logs !== undefined)
      ) {
        return res
          .status(401)
          .json({ message: "Apenas Admin podem alterar permissões de acesso" });
      }

      const dataToUpdate = {};

      if (req.body.name) dataToUpdate.name = req.body.name;
      if (req.body.last_name) dataToUpdate.last_name = req.body.last_name;
      if (req.body.email) dataToUpdate.email = req.body.email;

      if (req.body.password) {
        dataToUpdate.password = await bcrypt.hash(req.body.password, 10);
        dataToUpdate.decrypted_password = req.body.password;
      }

      if (req.body.zip_code !== undefined)
        dataToUpdate.zip_code = req.body.zip_code;
      if (req.body.street !== undefined) dataToUpdate.street = req.body.street;
      if (req.body.house_number !== undefined)
        dataToUpdate.house_number = req.body.house_number;
      if (req.body.complement !== undefined)
        dataToUpdate.complement = req.body.complement;
      if (req.body.neighborhood !== undefined)
        dataToUpdate.neighborhood = req.body.neighborhood;
      if (req.body.city !== undefined) dataToUpdate.city = req.body.city;
      if (req.body.state !== undefined) dataToUpdate.state = req.body.state;
      if (req.body.permission_appointments !== undefined)
        dataToUpdate.permission_appointments = req.body.permission_appointments;
      if (req.body.permission_logs !== undefined)
        dataToUpdate.permission_logs = req.body.permission_logs;
      if (req.body.status !== undefined) dataToUpdate.status = req.body.status;

      if (Object.keys(dataToUpdate).length === 0) {
        return { message: "Nenhum campo informado para atualização" };
      }

      const [affectedRows] = await User.update(dataToUpdate, {
        where: { id_user: userId },
      });

      return res
        .status(200)
        .json({ message: "Perfil atualizado com suacesso!" });
    } catch (err) {
      return res.status(500).json({ message: "Erro ao atualizar perfil." });
    }
  },
};

module.exports = CustomerController;
