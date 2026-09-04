const notFound = (req, res, next) => {
  const error = new Error(`Not Found - Spell / Endpoint [${req.originalUrl}] does not exist.`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  console.error(`🚨 [Server Error] ${err.message}`, err.stack);

  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal Grimoire Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = {
  notFound,
  errorHandler,
};
