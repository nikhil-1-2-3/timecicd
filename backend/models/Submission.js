const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
    },
    date: {
      type: String,
      required: [true, 'Date is required'],
      trim: true,
    },
    preferredTime: {
      type: String,
      required: [true, 'Preferred time is required'],
      trim: true,
    },
    purpose: {
      type: String,
      required: [true, 'Purpose / reason is required'],
      trim: true,
      minlength: [3, 'Purpose must be at least 3 characters'],
      maxlength: [500, 'Purpose cannot exceed 500 characters'],
    },
    confirmedTime: {
      type: String,
      required: [true, 'Confirmed time is required'],
      trim: true,
    },
    formattedDate: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['Confirmed', 'Pending', 'Rescheduled'],
      default: 'Confirmed',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Submission', submissionSchema);
