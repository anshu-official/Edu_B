// models/Student.js

const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  quizzesTaken: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "QuizResult",
    },
  ],
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
