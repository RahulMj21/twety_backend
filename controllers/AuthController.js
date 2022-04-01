const BigPromise = require("../utils/BigPromise");
const CustomErrorHandler = require("../utils/CustomErrorHandler");
const User = require("../services/user.service");
const Session = require("../services/session.service");
const createTokenAndSetCookie = require("../utils/createTokenAndSetCookie");
class AuthController {
  register = BigPromise(async (req, res, next) => {
    const { name, email, password, confirmPassword } = req.body;
    if (!(name, email, password, confirmPassword)) {
      return next(
        CustomErrorHandler.badRequest("all fields are required", 422)
      );
    }

    if (password !== confirmPassword)
      return next(
        CustomErrorHandler.badRequest(
          "confirm password field dosen't matches with the password field"
        )
      );
    const user = await User.createUser({ name, email, password });
    if (!user) return next(new CustomErrorHandler(409, "email already taken"));

    const session = await Session.createSession({
      user: user._id,
      userAgent: req.get("user-agent") || "",
    });
    if (!session) return next(CustomErrorHandler.wentWrong());

    createTokenAndSetCookie({ ...user, session: session._id }, res);

    return res.status(201).json({
      success: true,
      message: "registered successfully",
    });
  });
  login = BigPromise(async (req, res, next) => {
    const { email, password } = req.body;
    if (!(email, password)) {
      return next(
        CustomErrorHandler.badRequest("all fields are required", 422)
      );
    }

    const user = await User.findUser({ email });
    if (!user)
      return next(CustomErrorHandler.badRequest("wrong email or password"));

    const isPasswordMatched = user.comparePassword(password);
    if (!isPasswordMatched)
      return next(CustomErrorHandler.badRequest("wrong email or password"));

    const session = await Session.upsertSession(
      {
        user: user._id,
        userAgent: req.get("user-agent") || "",
      },
      {
        user: user._id,
        userAgent: req.get("user-agent") || "",
      },
      {
        new: true,
        upsert: true,
      }
    );
    if (!session) return next(CustomErrorHandler.wentWrong());

    createTokenAndSetCookie({ ...user, session: session._id }, res);

    return res.status(201).json({
      success: true,
      message: "logged in successfully",
    });
  });
  logout = BigPromise(async (req, res, next) => {
    const decodedUser = res.locals.user;
    const user = await User.findUser({ _id: decodedUser._id });
    if (!user) return next(CustomErrorHandler.unauthorized());

    const session = await Session.findSession({
      user: user._id,
      userAgent: req.get("user-agent") || "",
    });
    if (!session) return next(CustomErrorHandler.unauthorized());

    session.remove();

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return res.status(200).json({
      success: true,
      message: "logged out successfully",
    });
  });
}

module.exports = new AuthController();
