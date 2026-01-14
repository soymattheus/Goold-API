const { AppointmentData } = require("../data/appointment.data");

const AppointmentController = {
  createAppointment: async (req, res) => {
    try {
      const userId = req.userId;
      const { date, room } = req.body;

      const result = await AppointmentData.CreateAppointment({
        date,
        room,
        userId,
      });

      return res.status(201).json(result);
    } catch (error) {
      return res.status(500).json({ message: "Erro ao criar o agendamento" });
    }
  },

  updateAppointment: async (req, res) => {
    try {
      const userId = req.userId;
      const { appointmentId } = req.params;
      const { date, room, status } = req.body;

      console.log(req.typeUser, status);
      if (
        req.typeUser !== "admin" &&
        (status === "scheduled" || status === "canceled")
      ) {
        return res.status(401).json({
          message: "Apenas Administrador pode alterar status.",
        });
      }

      const isOwner = await AppointmentData.CheckAppointmentOwner({
        userId,
        appointmentId,
      });

      if (isOwner.length === 0) {
        return res.status(404).json({
          message: "Agendamento não encontrado",
        });
      }

      const result = await AppointmentData.UpdateAppointment({
        date,
        room,
        status,
        appointmentId,
      });

      return res.status(201).json({ result });
    } catch (error) {
      return res.status(500).json({ message: "Erro ao criar o agendamento" });
    }
  },
};

module.exports = AppointmentController;
