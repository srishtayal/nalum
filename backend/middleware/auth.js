const sessions = require("../controllers/session.controller.js");

exports.protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      err: true,
      code: 401,
      message: "Not authorized to access this route",
    });
  }

  const fingerprint = req.headers["x-fingerprint"];

  if (!fingerprint) {
    return res.status(401).json({
      err: true,
      code: 401,
      message: "Not authorized to access this route",
    });
  }

  try {
    const decoded = await sessions.validateAccessToken(token, fingerprint);

    if (decoded.error) {
      return res.status(401).json({
        err: true,
        code: 401,
        message: "Not authorized to access this route",
      });
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      err: true,
      code: 401,
      message: "Not authorized to access this route",
    });
  }
};
