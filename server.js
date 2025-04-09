require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const mongoURI = process.env.MONGO_URI;


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const SensorData = mongoose.model("SensorData", {
  temperature: Number,
  humidity: Number,
  timestamp: { type: Date, default: Date.now },
});

app.post("/api/data", async (req, res) => {
  const { temperature, humidity } = req.body;
  try {
    const data = new SensorData({ temperature, humidity });
    await data.save();
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send("Error saving data");
  }
});

app.get("/api/data", async (req, res) => {
  const data = await SensorData.find().sort({ timestamp: -1 }).limit(50);
  res.json(data);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
