const jwt = require('jsonwebtoken');
const users = require('../models/users');

const jwtMiddleware = (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  if (!accessToken) return next();

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
    console.log(`😀 사용자 인증 성공`, decoded);

    req.user = {
      email: decoded.email,
      name: decoded.name,
    };

    if (Date.now() / 1000 - decoded.iat > 60 * 60 * 24 * 6) {
      // 하루보다 덜 남으면 갱신해준다.
      const user = users.findUserByEmail(decoded.email);
      const freshToken = users.generateToken(user.email);

      res.cookies('access_token', freshToken, {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7days
        httpOnly: true,
      });
    }

    return next();
  } catch (e) {
    console.error('😱 사용자 인증 실패..', e);

    return next();
  }
};

module.exports = jwtMiddleware;
