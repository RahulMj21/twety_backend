class CustomErrorHandler extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
  }
  static unauthorized(message = "unauthorized user", statusCode = 401) {
    return new CustomErrorHandler(statusCode, message);
  }
  static notFound(message = "not found", statusCode = 404) {
    return new CustomErrorHandler(statusCode, message);
  }
  static badRequest(message = "bad request", statusCode = 400) {
    return new CustomErrorHandler(statusCode, message);
  }
  static wentWrong(message = "Oops..Something went wront", statusCode = 500) {
    return new CustomErrorHandler(statusCode, message);
  }
}

module.exports = CustomErrorHandler;
