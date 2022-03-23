const BigPromise = require("../utils/BigPromise");

class UserController {
  getAllUsers = BigPromise(async (req, res, next) => {});
  getSingleUser = BigPromise(async (req, res, next) => {});
  getCurrentUser = BigPromise(async (req, res, next) => {});
  updateProfile = BigPromise(async (req, res, next) => {});
  updatePassword = BigPromise(async (req, res, next) => {});
  forgotPassword = BigPromise(async (req, res, next) => {});
  resetPassword = BigPromise(async (req, res, next) => {});
  deleteUser = BigPromise(async (req, res, next) => {});
}

module.exports = new UserController();
