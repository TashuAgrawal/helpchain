import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs"; // Import bcrypt for hashing

// Define the schema for a User (only 'user' and 'admin' roles)
const UserSchema = new Schema({
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    unique: true, 
    trim: true,
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'], 
    minlength: [6, 'Password must be at least 6 characters'],
    select: false, // IMPORTANT: Never return the password field by default
  },
  username: { 
    type: String, 
    unique: true,
    required: [true, 'Username is required'],
  },
  // Only user and admin roles
  role: {
    type: String,
    enum: ['user', 'admin'], 
    default: 'user',
  }
}, { 
  timestamps: true // Adds createdAt and updatedAt fields
});

// PRE-SAVE HOOK: Hash the password before saving a new User or if the password field is modified
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// METHOD: Add a method to compare passwords (used during login)
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Check if the model already exists to prevent Mongoose redefinition errors
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;
