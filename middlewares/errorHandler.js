const errorHandler = async (err, req, res, next) => {
  let statusCode = 500;
  let message = "internal server error";

  if (err.statusCode) {
    statusCode = err.statusCode;
    message = err.message;
  }

  return res.status(statusCode).json(message);
};

module.exports = errorHandler;
