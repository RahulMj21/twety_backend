const JWT = require("./JWT");

const createTokenAndSetCookie = (tokenData, res) => {
  const accessToken = JWT.signJwt(tokenData, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: 1000 * 60 * 60,
  });
  const refreshToken = JWT.signJwt(
    tokenData,
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: 1000 * 60 * 60 * 24 * 365,
    }
  );

  const tokenOptions = {
    secure: false,
    path: "/",
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 365,
  };

  res.cookie("accessToken", accessToken, {
    ...tokenOptions,
  });
  res.cookie("refreshToken", refreshToken, {
    ...tokenOptions,
  });
};

module.exports = createTokenAndSetCookie;
