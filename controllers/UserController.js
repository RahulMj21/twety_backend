const cloudinary = require("cloudinary");
const crypto = require("crypto");

const BigPromise = require("../utils/BigPromise");
const CustomErrorHandler = require("../utils/CustomErrorHandler");
const User = require("../services/user.service");
const Session = require("../services/session.service");
class UserController {
  getAllUsers = BigPromise(async (req, res, next) => {
    const users = await User.findAllUsers();
    if (!users) return next(CustomErrorHandler.notFound("users not found"));

    return res.status(200).json({
      success: true,
      users,
    });
  });
  getSingleUser = BigPromise(async (req, res, next) => {
    const _id = req.params.id;
    if (!_id)
      return next(
        CustomErrorHandler.badRequest("user id is not present on the request")
      );

    const user = await User.findUser({ _id });
    if (!user) return next(CustomErrorHandler.notFound("user not found"));

    return res.status(200).json({
      success: true,
      user,
    });
  });
  getCurrentUser = BigPromise(async (req, res, next) => {
    const decodedUser = res.locals.user;

    const user = await User.findUser({ _id: decodedUser._id });
    if (!user) return next(CustomErrorHandler.wentWrong());

    return res.status(200).json({
      success: true,
      user,
    });
  });
  updateProfile = BigPromise(async (req, res, next) => {
    const decodedUser = res.locals.user;

    const avatar = req.body.avatar || req.files.avatar || null;
    const { name, email } = req.body;
    if (!name && !email && !avatar)
      return next(CustomErrorHandler.badRequest("nothing to update"));

    const user = await User.findUser({ _id: decodedUser._id });
    if (!user) return next(CustomErrorHandler.notFound("user not found"));

    if (avatar) {
      if (user.avatar.public_id !== "") {
        const deletedAvatar = await cloudinary.v2.uploader.destroy(
          user.avatar.public_id
        );
        if (!deletedAvatar) return next(CustomErrorHandler.wentWrong());
      }
      const uploadableFile =
        typeof avatar === "object" ? avatar.tempFilePath : avatar;

      const result = await cloudinary.v2.uploader.upload(uploadableFile, {
        width: "200",
        crop: "scale",
      });
      if (!result) return next(CustomErrorHandler.wentWrong());

      user.avatar = {
        public_id: result.public_id,
        secure_url: result.secure_url,
      };
    }
    if (email) user.email = email;
    if (name) user.name = name;

    user.save();

    return res.status(200).json({
      success: true,
      message: "profile updated successfully",
    });
  });
  updatePassword = BigPromise(async (req, res, next) => {
    const decodedUser = res.locals.user;

    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    if (!(currentPassword, newPassword, confirmNewPassword))
      return next(new CustomErrorHandler(422, "all fields are required"));

    if (currentPassword === newPassword)
      return next(CustomErrorHandler.badRequest("nothing to update"));

    if (newPassword !== confirmNewPassword)
      return next(
        CustomErrorHandler.badRequest(
          "confirm new password dosen't matches with the new password"
        )
      );

    const user = await User.findAndUpdateUser(
      { _id: decodedUser._id },
      { password },
      {
        new: true,
      }
    );
    if (!user) return next(CustomErrorHandler.notFound("user not found"));

    return res.status(200).json({
      success: true,
      message: "password updated successfully",
    });
  });
  forgotPassword = BigPromise(async (req, res, next) => {
    const { email } = req.body;
    if (!email)
      return CustomErrorHandler.badRequest("please provide an valid email");

    const user = User.findUser({ email });
    if (!user)
      return next(CustomErrorHandler.badRequest("email not registered"));

    const forgotPasswordToken = user.getForgotPasswordToken();

    //TODO send email logic will goes here
  });
  resetPassword = BigPromise(async (req, res, next) => {
    const { password, confirmPassword } = req.body;
    if (!(password, confirmPassword))
      return next(new CustomErrorHandler(422, "all fields are required"));

    const token = req.params.token;
    if (!token)
      return next(
        CustomErrorHandler.badRequest(
          "reset password token is not present on the request"
        )
      );

    const user = User.findUser({ forgotPasswordToken: token });
    if (!user) return next(CustomErrorHandler.badRequest("invalid token"));

    const hash = crypto
      .createHmac("sha256", process.env.FORGOT_PASSWORD_TOKEN_SECRET)
      .update(`${token}.${user.forgotPasswordExpiry}`)
      .digest("hex");
    if (user.forgotPasswordHash !== hash)
      return next(CustomErrorHandler.badRequest("invalid token"));

    if (user.forgotPasswordExpiry < Date.now())
      return next(CustomErrorHandler.badRequest("token expired"));

    if (password !== confirmPassword)
      return next(
        CustomErrorHandler.badRequest(
          "confirm password dosen't matches with the password field"
        )
      );

    user.password = password;
    user.save();

    return res.status(200).json({
      success: true,
      message: "password updated successfully",
    });
  });
  deleteUser = BigPromise(async (req, res, next) => {
    const decodedUser = res.locals.user;

    const user = await User.findUser({ _id: decodedUser._id });
    if (!user) return next(CustomErrorHandler.notFound("user not found"));

    const session = await Session.findSession({
      user: user._id,
      userAgent: req.get("user-agent") || "",
    });
    if (!session)
      return next(CustomErrorHandler.badRequest("session not found"));

    session.remove();
    user.remove();

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.status(200).json({
      success: true,
      message: "account deleted",
    });
  });
}

module.exports = new UserController();
