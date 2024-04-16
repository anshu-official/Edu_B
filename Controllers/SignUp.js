const User = require("../models/User");

exports.signup = async (req, res) => {
  try {
    // Extract user input from request body
    const { email, firstName, lastName, role } = req.body;

    // Validate user input (e.g., check if required fields are provided)

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // Create a new user instance
    const newUser = new User({
      email,
      firstName,
      lastName,
      role: role || "Student", // Default role to "Student" if not provided
    });

    // Save the new user to the database
    await newUser.save();

    // Respond with success message
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    // Handle errors
    console.error("Error in signup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
