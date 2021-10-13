async function generateToken(userID) {
  return new Promise((resolve, reject) => {
    jwt.sign({ userID }, settings.secret, { expiresIn: '30d' }, (err, token) => {
      if (err) reject(err);
      resolve(token);
    });
  });
}

module.exports = {
  register: async (req, res) => {},
  login: async (res, res) => {},
};
