const User = require('../models/User');
const jwt = require('jsonwebtoken');

async function generateToken(userID) {
  return new Promise((resolve, reject) => {
    jwt.sign({ userID }, process.env.TOKEN_SECRET, { expiresIn: '30d' }, (err, token) => {
      if (err) reject(err);
      resolve(token);
    });
  });
}

module.exports = {
  register: async (req, res) => {
    const { email, password } = req.body;

    if (!email) return res.status(400).json({ errors: { email: 'Email is required' } });
    if (!password) return res.status(400).json({ errors: { password: 'Password is required' } });

    try {
      const [user, created] = await User.findOrCreate({
        where: { email },
        defaults: {
          email,
          password,
        },
      });

      if (created) {
        const token = await generateToken(user.id);
        res.json({
          id: user.id,
          email: user.email,
          token,
        });
      } else {
        res.status(409).json({ errors: { email: 'Email is already used' } });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ errors: { error: err.message } });
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;

    if (!email) return res.status(400).json({ errors: { email: 'Email is required' } });
    if (!password) return res.status(400).json({ errors: { password: 'Password is required' } });

    try {
      const user = await User.findOne({ where: { email } });
      if (user) {
        const isValid = await user.verifyPassword(password);
        if (isValid) {
          const token = await generateToken(user.id);
          return res.json({
            id: user.id,
            email: user.email,
            token,
          });
        }
        res.sendStatus(401);
      } else {
        res.sendStatus(404);
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ errors: { error: err.message } });
    }
  },
  generateToken,
};
