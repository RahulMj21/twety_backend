const User = require("../models/user.model");

class UserService {
  async createUser(input) {
    try {
      return await User.create(input);
    } catch (err) {
      return false;
    }
  }
  async findUser(query) {
    try {
      const user = await User.findOne(query);
      if (!user) return false;
      return user;
    } catch (err) {
      return false;
    }
  }
  async findAllUsers() {
    try {
      const users = await User.find();
      if (!users) return false;
      return users;
    } catch (err) {
      return false;
    }
  }
  async findAndUpdateUser(query, input, options) {
    try {
      return await User.findOneAndUpdate(query, input, {
        ...(options && options),
      });
    } catch (error) {
      return false;
    }
  }
}

module.exports = UserService;
