const { CustomerData } = require("../data/customer.data");

const CustomerController = {
  getCustomerList: async (req, res) => {
    const curtomerList = await CustomerData.getCustomerList();
    return curtomerList;
  },

  updateProfile: async (req, res) => {
    try {
      const userId = req.userId;
      if (
        req.typeUser === "customer" &&
        (req.body.permissionAppointments !== undefined ||
          req.body.permissionLogs !== undefined)
      ) {
        return res
          .status(401)
          .json({ message: "Apenas Admin podem alterar permissões de acesso" });
      }

      const data = { userId, ...req.body };

      await CustomerData.updateUser(data);

      return res.status(200).json({ message: "Perfil atualizado com sucesso" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Erro ao atualizar perfil" });
    }
  },
};

module.exports = CustomerController;
