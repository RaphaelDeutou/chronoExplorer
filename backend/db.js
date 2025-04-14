const mysql = require("mysql2");
const dotenv = require("dotenv");
// Connexion à la base de données
const connection = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "louvre",
});

connection.connect((err) => {
  if (err) {
    console.error("Erreur de connexion à la base de données: " + err.stack);
    return;
  }
  console.log("Connecté à la base de données MySQL");
});

module.exports = connection;
