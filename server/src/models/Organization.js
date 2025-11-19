import mongoose from 'mongoose';

const OrganizationSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    organizationName: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    role: { type: String, default: 'organization', immutable: true },
  },
  { timestamps: true }
);

export default mongoose.model('Organization', OrganizationSchema);
