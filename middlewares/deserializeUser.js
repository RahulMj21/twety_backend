const CustomErrorHandler = require("../utils/CustomErrorHandler");

const deserializeUser = async (req, res, next) => {
  const accessToken =
    req.cookies.accessToken ||
    req.headers.authorization.replace(/^Bearer\s/) ||
    null;
  const refreshToken =
    req.cookies.refreshToken || req.headers.x - refresh || null;

  if (!(accessToken && refreshToken))
    return next(CustomErrorHandler.unauthorized());

  const { decoded, expired } = JWT.verifyJwt(accessToken);
  if (decoded && !expired) {
    res.locals.user = decoded;
    return next();
  } else {
    const newAccessToken = JWT.getNewAccessToken(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    if (!newAccessToken) return next(CustomErrorHandler.unauthorized());

    const { decoded, expired } = JWT.verifyJwt(newAccessToken);
    if (decoded && !expired) {
      res.locals.user = decoded;
      res.setHeader("x-access-token", newAccessToken);
      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: false,
        path: "/",
      });
      next();
    } else {
      return next(CustomErrorHandler.unauthorized());
    }
  }
};

module.exports = deserializeUser;
