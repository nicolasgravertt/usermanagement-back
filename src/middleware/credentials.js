const allowedUrls = require("../config/AllowedUrls");

const credentials = (req, res, next) => {
  const origin = req.headers.origin;
  if (allowedUrls.includes(origin)) {
    res.header("Access-Control-Allow-Credentials", true);
  }
  next();
};

module.exports = credentials;
