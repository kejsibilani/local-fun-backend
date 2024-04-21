const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();

// GET all users
const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        if (!users || users.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }
        res.status(200).json(users);
    } catch (error) {
        console.error("Error retrieving users:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

//POST new user
const createUser = async (req, res) => {
    try {
        const newUser = new User(req.body);
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

//UPDATE user by email
const updateUser = async (req, res) => {
    try {
        const { email } = req.params; // Assuming email is passed as a parameter
        const updatedUser = await User.findOneAndUpdate({ email }, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

//DELETE user by email
const deleteUser = async (req, res) => {
    try {
        const { email } = req.query; // Extract email from query parameters
        const deletedUser = await User.findOneAndDelete({ email });
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

//LOGIN
const loginUser = async (req, res) => {
    const { email, username, password } = req.body;

    try {
        // Find user by email or username
        const user = await User.findOne({ $or: [{ email }, { username }] });

        // If user not found or password doesn't match, return error
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid email, username, or password" });
        }

        const secretKey = process.env.SECRET_KEY;

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });

        res.status(200).json({ token });
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};



module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    loginUser
};
