const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    require: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["Student", "Instructor", "Admin"],
    default: "Student",
  },
});
const User = mongoose.model("User", userSchema);
module.exports = User;
