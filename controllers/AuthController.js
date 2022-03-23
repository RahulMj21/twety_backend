const BigPromise = require("../utils/BigPromise");

class AuthController {
  register = BigPromise(async (req, res, next) => {});
  login = BigPromise(async (req, res, next) => {});
  logout = BigPromise(async (req, res, next) => {});
}

module.exports = new AuthController();
