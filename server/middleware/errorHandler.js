function errorHandler(err, req, res, next) {
  console.error('[Error Handler]', err);
  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    error: true,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
}

module.exports = errorHandler;
