const express = require('express');
const router = express.Router();
const { submitScroll, getScrolls } = require('../controllers/contactController');
const { contactLimiter } = require('../middleware/rateLimiter');

// POST /api/contact - Cast a scroll (rate-limited)
router.post('/', contactLimiter, submitScroll);

// GET /api/contact/messages - Read scrolls (for developer / admin inspection)
router.get('/messages', getScrolls);

module.exports = router;
