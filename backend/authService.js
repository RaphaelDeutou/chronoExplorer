const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const connection = require("./db");
const mysql = require("mysql2");
// const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();

// const connection = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
// });

// connection.connect((err) => {
//   if (err) {
//     console.error("Error connecting to the database:", err);
//     return;
//   }
//   console.log("Connected to the database");
// });

// Fonction pour s'inscrire
const registerUser = (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);
  connection.query(
    "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
    [username, email, hashedPassword],
    (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Erreur d'inscription", error: err });
      }
      res.status(201).json({ message: "Utilisateur créé avec succès" });
    }
  );
};

// Fonction pour se connecter
const loginUser = (req, res) => {
  const { email, password } = req.body;
  connection.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    (err, results) => {
      if (err || results.length === 0) {
        return res.status(400).json({ message: "Utilisateur non trouvé" });
      }

      const user = results[0];
      const isPasswordValid = bcrypt.compareSync(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Mot de passe incorrect" });
      }

      const token = jwt.sign({ id: user.id, role: user.role }, "secretKey", {
        expiresIn: "1h",
      });
      res.json({ message: "Connexion réussie", token });
    }
  );
};

module.exports = { registerUser, loginUser };
