const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./src/config/db");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));
app.use("/api", require("./src/routes/product.routes"));
app.use("/api", require("./src/routes/admin.routes"));

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server start failed:", error.message);
  }
};

startServer();
