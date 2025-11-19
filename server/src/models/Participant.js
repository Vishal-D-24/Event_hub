import mongoose from 'mongoose';

const ParticipantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String },
    college: { type: String },
    yearDept: { type: String },
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    customResponses: { type: Map, of: String }, // Dynamic custom field responses
    certificateSent: { type: Boolean, default: false },
    certificateSentAt: { type: Date },
  },
  { timestamps: true }
);

ParticipantSchema.index({ email: 1, event: 1 }, { unique: true });

export default mongoose.model('Participant', ParticipantSchema);
