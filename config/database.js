require("dotenv").config();

const host = process.env.DB_PASSWORD;

module.exports = {
  dialect: "mysql",
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  logging: false, // desliga logs SQL

  define: {
    timestamps: false,
    underscored: true,
  },
};
