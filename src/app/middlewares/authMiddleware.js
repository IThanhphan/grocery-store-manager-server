const jwt = require('jsonwebtoken')

const authMiddleware = {
  verifyToken: async (req, res, next) => {
    try {
      const token = req.headers.token;
      if (!token) return res.status(401).json("You're not authenticated");
      const accessToken = token.split(" ")[1];
      jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
        if (err) {
          return res.status(403).json('Token is not valid')
        }
        req.user = user
        next()
      })
    } catch (err) {
      res.status(401).json(err)
    }
  },

  verifyTokenAndManagerAuth: async (req, res, next) => {
    authMiddleware.verifyToken(req, res, () => {
      if (req.user.id == req.params.id || req.user.manager) {
        next()
      } else {
        res.status(403).json('You are not allowed')
      }
    })
  }
}

module.exports = authMiddleware
