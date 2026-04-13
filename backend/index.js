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
app.options("*", cors(corsOptions));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/uploads", express.static("uploads"));
app.use("/api", require("./src/routes/product.routes"));
app.use("/api", require("./src/routes/admin.routes"));

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  console.log("Starting server...");
  console.log("PORT:", process.env.PORT);

  try {
    await connectDB();
    console.log("DB connected");
  } catch (error) {
    console.error("DB FAILED:", error.message);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
