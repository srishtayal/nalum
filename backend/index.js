
console.log("Starting backend server...");
const express = require("express");

const app = express();
const authRoutes = require("./routes/auth/index.js");
const cors = require("cors");
const helmet = require("helmet");

const dbConnect = require("./config/database.config.js");

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dbConnect();

app.use("/auth", authRoutes);


// listening to port 5000
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});