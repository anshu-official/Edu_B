const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  questions: [{
    question: {
      type: String,
      required: true
    },
    options: [String],
    correctAnswerIndex: {
      type: Number,
      required: true
    }
  }],
  link: {
    type: String,
    required: true
  }
});

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;