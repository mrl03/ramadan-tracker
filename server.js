const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5005;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public")); // Serve frontend files

// Route to receive location
app.post("/location", (req, res) => {
  const { latitude, longitude } = req.body;
  console.log(`Received Location: Lat=${latitude}, Lon=${longitude}`);

  res.json({
    message: "Location received successfully",
    latitude,
    longitude,
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
