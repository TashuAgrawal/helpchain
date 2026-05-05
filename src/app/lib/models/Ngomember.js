import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

const NGOMemberSchema = new Schema({
 userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ngoId: {
      type: Schema.Types.ObjectId,
      ref: "NGO",
      required: true,
    },
    role:{
        type:String
    }
}, {
  timestamps: true,
});

const NGOMember = mongoose.models.NGOMember || mongoose.model('NGOMember', NGOMemberSchema);

export default NGOMember;
