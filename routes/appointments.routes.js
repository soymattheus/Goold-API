const express = require("express");
const { authMiddleware } = require("../middleware/auth.middleware");
const logMiddleware = require("../middleware/log.middleware");
const AppointmentController = require("../controllers/appointment.controller");

const router = express.Router();

router.get("/", authMiddleware, AppointmentController.getAppointments);

router.post(
  "/",
  authMiddleware,
  logMiddleware({
    activityType: "Criação de agendamento",
    module: "Agendamento",
  }),
  AppointmentController.createAppointment
);

router.put(
  "/:appointmentId",
  authMiddleware,
  logMiddleware({
    activityType: "Atualização de Agendamento",
    module: "Agendamento",
  }),
  AppointmentController.updateAppointment
);

module.exports = router;
