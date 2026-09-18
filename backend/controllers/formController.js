const Submission = require('../models/Submission');
const timeService = require('../services/timeService');

/**
 * @desc    Submit a new time check form
 * @route   POST /api/forms
 * @access  Private
 */
const createSubmission = async (req, res, next) => {
  try {
    const { name, email, date, preferredTime, purpose } = req.body;

    // Basic validation
    if (!name || !email || !date || !preferredTime || !purpose) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields: name, email, date, preferred time, and purpose',
      });
    }

    // Validate date & time logic via timeService
    const validation = timeService.validateDateTime(date, preferredTime);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.error || 'Invalid date or time provided',
      });
    }

    // Process and confirm the time slot via isolated service
    const { confirmedTime, formattedDate, confirmationMessage } =
      timeService.generateConfirmedTime(date, preferredTime);

    // Persist to MongoDB
    const submission = await Submission.create({
      userId: req.user._id,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      date: date.trim(),
      formattedDate,
      preferredTime: preferredTime.trim(),
      purpose: purpose.trim(),
      confirmedTime,
      status: 'Confirmed',
    });

    return res.status(201).json({
      success: true,
      message: 'Form submitted successfully',
      data: {
        id: submission._id,
        name: submission.name,
        email: submission.email,
        date: submission.date,
        formattedDate: submission.formattedDate || formattedDate,
        preferredTime: submission.preferredTime,
        confirmedTime: submission.confirmedTime,
        purpose: submission.purpose,
        status: submission.status,
        confirmationMessage,
        createdAt: submission.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all submissions for the logged in user
 * @route   GET /api/forms/my
 * @access  Private
 */
const getUserSubmissions = async (req, res, next) => {
  try {
    const submissions = await Submission.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single submission by ID
 * @route   GET /api/forms/:id
 * @access  Private
 */
const getSubmissionById = async (req, res, next) => {
  try {
    const submission = await Submission.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found or unauthorized',
      });
    }

    return res.status(200).json({
      success: true,
      data: submission,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSubmission,
  getUserSubmissions,
  getSubmissionById,
};
