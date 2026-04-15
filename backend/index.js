import "dotenv/config";

import "./src/config/cloudinary.js";
import express from "express";
import cors from "cors";
import connectDB from "./src/config/mongodb.js";
import routes from "./src/routes/routes.js";

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
app.use("/api", routes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  console.log("STEP 1: Starting server...");
  console.log("PORT:", process.env.PORT);
  console.log("MONGO_URL:", process.env.MONGO_URL);
  console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
  console.log("API Key:", process.env.CLOUDINARY_API_KEY);

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
