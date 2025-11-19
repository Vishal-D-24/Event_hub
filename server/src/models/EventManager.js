import mongoose from 'mongoose';

const EventManagerSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
    role: { type: String, default: 'eventManager', immutable: true },
    permissions: {
      canCreateEvents: { type: Boolean, default: true },
      canEditEvents: { type: Boolean, default: true },
      canDeleteEvents: { type: Boolean, default: false },
      canManageRegistrations: { type: Boolean, default: true },
      canGenerateCertificates: { type: Boolean, default: true },
      canViewAnalytics: { type: Boolean, default: false },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Compound index to ensure email uniqueness within organization context
EventManagerSchema.index({ email: 1, organization: 1 });

export default mongoose.model('EventManager', EventManagerSchema);
