// ./database/testConnection.js
const db = require("./mysql");

async function test() {
  const [rows] = await db.query("SELECT 1");
  console.log("✅ MySQL conectado:", rows);
}

test();
