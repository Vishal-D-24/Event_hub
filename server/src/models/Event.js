import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    description: { type: String },

    category: {
      type: String,
      enum: ['Seminar', 'Webinar', 'Workshop', 'Hackathon', 'Other'],
      default: 'Other',
    },

    mode: {
      type: String,
      enum: ['online', 'offline'],
      required: true,
    },

    startDateTime: { type: Date, required: true },
    endDateTime: { type: Date, required: true },

    location: { type: String },
    posterUrl: { type: String },

    certTemplateUrl: { type: String },

    posterPublicId: { type: String },
    certTemplatePublicId: { type: String },
    signaturePublicId: { type: String },

    registrationLink: { type: String },

    shareId: {
      type: String,
      unique: true,
      index: true,
      default: () => Math.random().toString(36).substring(2, 10)
    },

    certificatesSent: { type: Boolean, default: false },

    customFields: [
      {
        label: { type: String, required: true },
        fieldType: {
          type: String,
          enum: ['text', 'email', 'phone', 'number', 'textarea', 'select', 'checkbox'],
          default: 'text',
        },
        required: { type: Boolean, default: false },
        options: [{ type: String }],
        placeholder: { type: String },
      },
    ],

    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'createdByModel',
    },

    createdByModel: {
      type: String,
      enum: ['Organization', 'EventManager'],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Event', EventSchema);
