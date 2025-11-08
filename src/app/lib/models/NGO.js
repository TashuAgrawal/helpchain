import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

const NGOSchema = new Schema({
  name: {
    type: String,
    required: [true, 'NGO name is required'],
    unique: true,
    trim: true,
  },
  cause: {
    type: String,
    required: [true, 'Cause is required'],
    trim: true,
  },
  submittedDate: {
    type: Date,
    default: Date.now,
  },
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
    select: false, // Do not return password by default
  },
  totalDonations: {
    type: Number,
    default: 0,
    min: 0,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
  },
  registrationNumber: {
    type: String,
    required: [true, 'Registration number is required'],
    unique: true,
    trim: true,
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected' , 'suspend'],
    default: 'pending'
  }
}, {
  timestamps: true,
});

// Pre-save hook to hash password
NGOSchema.pre('save', async function (next) {
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

// Method to compare passwords
NGOSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const NGO = mongoose.models.NGO || mongoose.model('NGO', NGOSchema);

export default NGO;
