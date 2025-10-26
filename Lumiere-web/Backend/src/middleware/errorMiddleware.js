// src/middleware/errorMiddleware.js
export function notFound(req, res, _next) {
  res.status(404).json({ message: `Not Found: ${req.originalUrl}` });
}

export function errorHandler(err, _req, res, _next) {
  const status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(status).json({
    message: err?.message || "Server error",
    stack: process.env.NODE_ENV === "production" ? undefined : err?.stack
  });
}
