// Error middleware
// 404 handler
const notFound = (req, res) => {
  res.status(404).json({ message: "Route not found" });
};

// Global error handler
const errorHandler = (error, req, res, next) => {
  console.error(error.stack);

  if (error.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation Error",
      errors: Object.values(error.errors).map((e) => e.message),
    });
  }

  if (error.name === "CastError") {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  if (error.code === 11000) {
    return res.status(400).json({ message: "Duplicate field value" });
  }

  res.status(500).json({ message: "Internal server error" });
};

module.exports = { notFound, errorHandler };
