const jwt = require('jsonwebtoken');

const tokenFor = (userForToken) => {
  const token = jwt.sign(
    userForToken,
    process.env.SECRET,
    {
      expiresIn: 60 * 60,
      algorithm: 'HS256' // will disallow algorithm:none when checking
    }
  );
  return token;
};

module.exports = {
  tokenFor
};