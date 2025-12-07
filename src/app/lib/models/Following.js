// following.schema.js
import mongoose, { Schema } from "mongoose";


const followingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ngoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NGO',
        required: true
    }
}, {
    timestamps: true
});

// ✅ Compound index: One user can follow MULTIPLE NGOs, but NOT the same NGO twice
followingSchema.index({ userId: 1, ngoId: 1 }, { unique: true });

const Following = mongoose.models.Following || mongoose.model("Following", followingSchema);
export default Following;
