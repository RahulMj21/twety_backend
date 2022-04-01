const Session = require("../models/session.model");

class UserService {
  async createSession(input) {
    try {
      return await Session.create(input);
    } catch (err) {
      return false;
    }
  }
  async findSession(query) {
    try {
      const session = await Session.findOne(query);
      if (!session) return false;
      return session;
    } catch (err) {
      return false;
    }
  }
  async upsertSession(query, input, options) {
    try {
      return await Session.findOneAndUpdate(query, input, {
        ...(options && options),
      });
    } catch (error) {
      return false;
    }
  }
}

module.exports = UserService;
