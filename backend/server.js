const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const authService = require("./authService");
const eventService = require("./eventService");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Configuration de multer pour stocker les images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "event-" + uniqueSuffix + path.extname(file.originalname)); // Corrigé ici
  },
});
const upload = multer({ storage });

// Servir les fichiers statiques (images)
app.use("/uploads", express.static("uploads"));

// Routes d’authentification
app.post("/api/register", authService.registerUser);
app.post("/api/login", authService.loginUser);

// Routes pour les événements
app.get("/api/events", eventService.getAllEvents);
app.get("/api/events/:id", eventService.getEventById);
app.post("/api/events", upload.single("image"), eventService.addEvent);
app.put("/api/events/:id", upload.single("image"), eventService.updateEvent);
app.delete("/api/events/:id", eventService.deleteEvent);
app.get("/api/events/filter", eventService.getFilteredEvents);

app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
