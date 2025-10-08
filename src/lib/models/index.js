import mongoose, { Schema } from "mongoose";

// --- Utility function to avoid Mongoose redefinition errors ---
// Note: User model is already handled in src/lib/models/User.js

const defineModel = (name, schema) => 
  mongoose.models[name] || mongoose.model(name, schema);

// --- 1. NONPROFIT MODEL (The core entity being helped) ---
const NonprofitSchema = new Schema({
    name: { type: String, required: true, unique: true },
    mission: { type: String, required: true },
    contactEmail: { type: String, required: true },
    website: String,
    // Reference to the user who created/administers this nonprofit profile
    adminUser: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });
export const Nonprofit = defineModel('Nonprofit', NonprofitSchema);

// --- 2. EVENT MODEL (Volunteer opportunities, meetups, etc.) ---
const EventSchema = new Schema({
    nonprofit: { type: Schema.Types.ObjectId, ref: 'Nonprofit', required: true },
    title: { type: String, required: true },
    description: String,
    date: { type: Date, required: true },
    location: String,
    volunteers: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Users signed up
}, { timestamps: true });
export const Event = defineModel('Event', EventSchema);

// --- 3. DONATION MODEL ---
const DonationSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    nonprofit: { type: Schema.Types.ObjectId, ref: 'Nonprofit', required: true },
    amount: { type: Number, required: true, min: 0.01 },
    currency: { type: String, default: 'USD' },
    transactionRef: String, // Payment processor reference ID
    status: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Completed' },
}, { timestamps: true });
export const Donation = defineModel('Donation', DonationSchema);

// --- 4. TRANSACTION MODEL (Used for broader financial logs, might include Donations) ---
const TransactionSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' }, // Optional: If initiated by a user
    nonprofit: { type: Schema.Types.ObjectId, ref: 'Nonprofit' }, // Optional: If involving a nonprofit
    type: { type: String, enum: ['Donation', 'Fee', 'Payout'], required: true },
    amount: { type: Number, required: true },
    details: Schema.Types.Mixed, // For storing flexible details
}, { timestamps: true });
export const Transaction = defineModel('Transaction', TransactionSchema);

// --- 5. MESSAGE MODEL (For internal user/admin communication or chat) ---
const MessageSchema = new Schema({
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    recipient: { type: Schema.Types.ObjectId, ref: 'User' }, // Could be a user or an admin
    threadId: { type: Schema.Types.ObjectId }, // To group messages into conversations
    content: { type: String, required: true },
    read: { type: Boolean, default: false },
}, { timestamps: true });
export const Message = defineModel('Message', MessageSchema);

// --- 6. FEEDBACK MODEL ---
const FeedbackSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' }, // Optional: Can be anonymous
    type: { type: String, enum: ['Bug', 'Feature Request', 'General'], default: 'General' },
    content: { type: String, required: true },
    status: { type: String, enum: ['New', 'In Progress', 'Resolved'], default: 'New' },
}, { timestamps: true });
export const Feedback = defineModel('Feedback', FeedbackSchema);

// --- 7. NOTIFICATION MODEL ---
const NotificationSchema = new Schema({
    recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true }, // e.g., 'NewDonation', 'EventReminder', 'ReportUpdate'
    message: { type: String, required: true },
    link: String, // Optional URL to click on
    read: { type: Boolean, default: false },
}, { timestamps: true });
export const Notification = defineModel('Notification', NotificationSchema);

// --- 8. BOOKMARK MODEL (User saves a nonprofit or event) ---
const BookmarkSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    targetType: { type: String, enum: ['Nonprofit', 'Event'], required: true },
    targetId: { type: Schema.Types.ObjectId, required: true, index: true },
}, { timestamps: true });
BookmarkSchema.index({ user: 1, targetId: 1 }, { unique: true }); // Prevent duplicate bookmarks
export const Bookmark = defineModel('Bookmark', BookmarkSchema);

// --- 9. EVIDENCE MODEL (Supporting documents/media for reports or nonprofits) ---
const EvidenceSchema = new Schema({
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    url: { type: String, required: true }, // URL to the hosted file (e.g., Firebase Storage)
    fileType: { type: String }, // e.g., 'image/jpeg', 'application/pdf'
    relatedTo: { type: String, enum: ['Nonprofit', 'Report', 'Event'], required: true },
    relatedId: { type: Schema.Types.ObjectId, required: true },
}, { timestamps: true });
export const Evidence = defineModel('Evidence', EvidenceSchema);

// --- 10. REPORT MODEL (User reports an issue with a nonprofit or activity) ---
const ReportSchema = new Schema({
    submittedBy: { type: Schema.Types.ObjectId, ref: 'User' }, // Can be anonymous
    reportedEntity: { type: String, enum: ['Nonprofit', 'User', 'Event'], required: true },
    reportedEntityId: { type: Schema.Types.ObjectId, required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ['Open', 'Under Review', 'Closed'], default: 'Open' },
    resolutionNotes: String,
}, { timestamps: true });
export const Report = defineModel('Report', ReportSchema);

// --- 11. TRUSTLOG MODEL (Tracking trust changes or verification status) ---
const TrustLogSchema = new Schema({
    nonprofit: { type: Schema.Types.ObjectId, ref: 'Nonprofit', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' }, // Admin/user who changed the status
    action: { type: String, required: true }, // e.g., 'Verified', 'Flagged', 'TrustScoreChange'
    scoreChange: { type: Number, default: 0 },
    notes: String,
}, { timestamps: true });
export const TrustLog = defineModel('TrustLog', TrustLogSchema);


// Note: User model is exported from src/lib/models/User.js
// Export all models from this central file for convenience
export default {
    Nonprofit,
    Event,
    Donation,
    Transaction,
    Message,
    Feedback,
    Notification,
    Bookmark,
    Evidence,
    Report,
    TrustLog
};
