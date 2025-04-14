const mysql = require("mysql2");
const dotenv = require("dotenv");
const connection = require("./db"); // ✅ correct

dotenv.config();

connection.connect((err) => {
  if (err) console.error("Error connecting to the database:", err);
  else console.log("Connected to the database");
});

const getAllEvents = (req, res) => {
  connection.query("SELECT * FROM events ORDER BY date ASC", (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Erreur de récupération des événements",
        error: err,
      });
    }
    res.json(results);
  });
};

const getEventById = (req, res) => {
  const { id } = req.params;
  connection.query("SELECT * FROM events WHERE id = ?", [id], (err, result) => {
    if (err || result.length === 0) {
      return res.status(404).json({ message: "Événement non trouvé" });
    }
    res.json(result[0]);
  });
};

const addEvent = (req, res) => {
  console.log("--- Adding Event ---");
  console.log("Request body:", req.body);
  console.log("File:", req.file);

  const { title, description, date, city, period } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  if (!title || !date) {
    console.log("Missing title or date");
    return res.status(400).json({ message: "Titre et date requis" });
  }

  const eventData = [title, description, date, city, period, image];
  console.log("Event data to insert:", eventData);

  connection.query(
    "INSERT INTO events (title, description, date, city, period, image) VALUES (?, ?, ?, ?, ?, ?)",
    eventData,
    (err, result) => {
      if (err) {
        console.error("SQL Error:", err);
        return res
          .status(500)
          .json({ message: "Erreur d'ajout", error: err.message });
      }
      console.log("Event added, ID:", result.insertId);
      res
        .status(201)
        .json({ message: "Événement ajouté", id: result.insertId });
    }
  );
};

const updateEvent = (req, res) => {
  const { id } = req.params;
  const { title, description, date, city, period } = req.body;
  const image = req.file ? `/Uploads/${req.file.filename}` : req.body.image;

  connection.query(
    "UPDATE events SET title = ?, description = ?, date = ?, city = ?, period = ?, image = ? WHERE id = ?",
    [title, description, date, city, period, image, id],
    (err, result) => {
      if (err || result.affectedRows === 0) {
        return res.status(404).json({ message: "Événement non trouvé" });
      }
      res.json({ message: "Événement mis à jour" });
    }
  );
};

const deleteEvent = (req, res) => {
  const { id } = req.params;
  connection.query("DELETE FROM events WHERE id = ?", [id], (err, result) => {
    if (err || result.affectedRows === 0) {
      return res.status(404).json({ message: "Événement non trouvé" });
    }
    res.json({ message: "Événement supprimé avec succès" });
  });
};

const getFilteredEvents = (req, res) => {
  const { date, city, period, theme } = req.query;
  let query = "SELECT * FROM events WHERE 1=1";
  const params = [];

  if (date) {
    query += " AND date = ?";
    params.push(date);
  }
  if (city) {
    query += " AND city LIKE ?";
    params.push(`%${city}%`);
  }
  if (period) {
    query += " AND period LIKE ?";
    params.push(`%${period}%`);
  }
  if (theme) {
    query += " AND (title LIKE ? OR description LIKE ?)";
    params.push(`%${theme}%`, `%${theme}%`);
  }

  query += " ORDER BY date ASC";

  connection.query(query, params, (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Erreur de filtrage", error: err });
    }
    res.json(results);
  });
};

module.exports = {
  getAllEvents,
  getEventById,
  addEvent,
  updateEvent,
  deleteEvent,
  getFilteredEvents,
};
