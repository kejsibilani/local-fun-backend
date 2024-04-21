const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure email is unique
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  type: {
    type: Number,
    required: true,
  }
}, { versionKey: false });

// Hash the password before saving
userSchema.pre('save', async function(next) {
  const user = this;
  if (!user.isModified('password')) {
    return next(); // Skip if password is not modified
  }
  
  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Hash the password with the salt
    const hashedPassword = await bcrypt.hash(user.password, salt);
    // Replace the plain password with the hashed password
    user.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model('users', userSchema);

module.exports = User;
