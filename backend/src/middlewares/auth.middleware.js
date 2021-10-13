module.exports = function authMiddleware(req, res, next) {
  const authHeader = req.header('Authorization')?.split(' ');
  if (authHeader?.length > 1 && authHeader[0] === 'Bearer') {
    const token = authHeader[1];
    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
      if (err) return res.sendStatus(401);
      req.userID = decoded.userID;
      next();
    });
  } else {
    return res.sendStatus(401);
  }
};
