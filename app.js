const express = require("express");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const protectedRoutes = require("./routes/protected.routes");
const logsRouters = require("./routes/logs.router");
const customerRoutes = require("./routes/customer.routes");
const appointmentRoutes = require("./routes/appointments.routes");

const port = process.env.PORT || 3001;

const app = express();

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/protected", protectedRoutes);
app.use("/logs", logsRouters);
app.use("/customer", customerRoutes);
app.use("/appointment", appointmentRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
