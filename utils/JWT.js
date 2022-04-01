const jwt = require("jsonwebtoken");
const User = require("../services/user.service");
const Session = require("../services/session.service");
class JWT {
  signJwt(payload, secret, options = {}) {
    return jwt.sign(payload, secret, {
      ...(options && options),
    });
  }

  verifyJwt(token, secret) {
    const decoded = jwt.verify(token, secret);
    if (decoded) {
      return {
        decoded,
        expired: false,
      };
    } else {
      return {
        decoded: null,
        expired: true,
      };
    }
  }

  async getNewAccessToken(refreshToken, refreshTokenSecret) {
    const { decoded, expired } = this.verifyJwt(
      refreshToken,
      refreshTokenSecret
    );
    if (!decoded && expired) return false;

    const user = await User.findOne({ _id: decoded._id });
    if (!user) return false;

    const session = await session.findOne({ _id: decoded.session });
    if (!session) return false;

    const accessToken = this.signJwt(
      { ...user, session: session._id },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: 1000 * 60 * 60,
      }
    );
    return accessToken;
  }
}

module.exports = new JWT();
