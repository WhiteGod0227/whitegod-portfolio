const rateLimit = require('express-rate-limit');

// Rate limiter for general API requests
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 150, // Limit each IP to 150 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many requests from this IP seal, please try again in 15 minutes.',
  },
});

// Strict rate limiter for Contact Form (Scroll Casting)
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 scroll submissions per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many scrolls cast in a short timeframe! Please wait a few minutes before casting another message.',
  },
});

module.exports = {
  generalLimiter,
  contactLimiter,
};
