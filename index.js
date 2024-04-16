const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const quizRoutes = require("./Routes/quizroutes");
const authRoutes = require("./Routes/authenticationroutes");
const EduRoutes = require("./Routes/EduRoutes");

const app = express();
// Middleware
app.use(bodyparser.json());
app.use(cors());
//Connection to database
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      "mongodb+srv://pratapsinghakshat0:Aps532004@hackmait.r7ehobn.mongodb.net/SmartEd_Database?retryWrites=true&w=majority&appName=HackMAIT",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};
connectDB();
// Routes
// Define your routes here
// Routes
app.use("/api/quiz", quizRoutes);
app.use("/api", authRoutes);
app.use("/", EduRoutes);
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
