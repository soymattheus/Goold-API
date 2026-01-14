const db = require("../database/mysql");
const { v4: uuidv4 } = require("uuid");

exports.AppointmentData = {
  CreateAppointment: async ({ date, room, userId }) => {
    try {
      const idAppointment = uuidv4();

      const [result] = await db.query(
        `INSERT INTO tb_appointment (
        id_appointment,
        date,
        room,
        id_user
      ) VALUES (?, ?, ?, ?)`,
        [idAppointment, date || null, room || null, userId]
      );

      return result;
    } catch (err) {
      return {
        message: "Erro ao criar agendamento",
      };
    }
  },

  CheckAppointmentOwner: async ({ userId, appointmentId }) => {
    try {
      const [existing] = await db.query(
        `SELECT * FROM tb_appointment 
            WHERE id_appointment = ? AND id_user = ?`,
        [appointmentId, userId]
      );

      return existing;
    } catch (error) {
      return { message: "Erro ao verificar vínculo do agendamento" };
    }
  },

  UpdateAppointment: async ({ appointmentId, date, room, status }) => {
    try {
      const fields = [];
      const values = [];

      if (date !== undefined) {
        fields.push("date = ?");
        values.push(date);
      }

      if (room !== undefined) {
        fields.push("room = ?");
        values.push(room);
      }

      if (status !== undefined) {
        fields.push("status = ?");
        values.push(status);
      }

      if (fields.length === 0) {
        return res.status(400).json({
          message: "Nenhum campo informado para atualização",
        });
      }

      values.push(appointmentId);

      const [result] = await db.query(
        `UPDATE tb_appointment 
       SET ${fields.join(", ")}
       WHERE id_appointment = ?`,
        values
      );

      return result;
    } catch (err) {
      console.error(err);
      return {
        message: "Erro ao atualizar agendamento",
      };
    }
  },
};
