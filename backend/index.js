const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./src/config/db");

const app = express();

const corsOptions = {
  origin: ["https://www.ayrahealthmix.com", "http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/uploads", express.static("uploads"));
app.use("/api", require("./src/routes/routes"));

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  console.log("STEP 1: Starting server...");
  console.log("PORT:", process.env.PORT);
  console.log("MONGO_URL:", process.env.MONGO_URL);

  // 🔥 START SERVER FIRST
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`STEP 2: Server running on port ${PORT}`);
  });

  try {
    console.log("STEP 3: Connecting DB...");
    await connectDB();
    console.log("STEP 4: DB connected");
  } catch (error) {
    console.error("DB FAILED:", error.message);
  }
};

startServer();
