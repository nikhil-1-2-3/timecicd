const express = require('express');
const router = express.Router();
const {
  createSubmission,
  getUserSubmissions,
  getSubmissionById,
} = require('../controllers/formController');
const { protect } = require('../middleware/authMiddleware');

// All form routes are protected by JWT auth
router.use(protect);

router.post('/', createSubmission);
router.get('/my', getUserSubmissions);
router.get('/:id', getSubmissionById);

module.exports = router;
