const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/usersModel')

const authController = {
  registerUser: async (req, res) => {
    try {
      const salt = await bcrypt.genSalt()
      const hashed = await bcrypt.hash(req.body.password, salt)

      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        password: hashed
      })

      const user = await newUser.save()
      res.status(200).json(user)
    } catch(err) {
      res.status(500).json(err)
    }
  },

  generateAccessToken: (user) => {
    return jwt.sign({
      id: user.id,
      manager: user.manager
    }, process.env.JWT_ACCESS_KEY, { expiresIn: '30s' })
  },

  generateRefreshToken: (user) => {
    return jwt.sign({
      id: user.id,
      manager: user.manager
    }, process.env.JWT_REFRESH_KEY, { expiresIn: '1d' })
  },

  loginUser: async (req, res) => {
    try {
      const user = await User.findOne({ username: req.body.username })
      if (!user) {
        return res.status(404).json('wrong username')
      }
      const validatePassword = await bcrypt.compare(req.body.password, user.password)

      if (!validatePassword) {
        return res.status(404).json('wrong password')
      }

      const accessToken = authController.generateAccessToken(user)
      const refreshToken = authController.generateRefreshToken(user)
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        path: '/',
        sameSite: 'strict'
      })
      const { password, ...other } = user._doc
      res.status(200).json({ ...other, accessToken })
    } catch(err) {
      res.status(500).json(err)
    }
  },

  requestRefreshToken: async (req, res) => {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) {
      return res.status(401).json('You are not authentication')
    }
    jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
      if (err) {
        return res.status(403).json(err)
      }
      const newAccessToken = authController.generateAccessToken(user)
      const newRefreshToken = authController.generateRefreshToken(user)
      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: false,
        path: '/',
        sameSite: 'strict'
      })
      res.status(200).json({ accessToken: newAccessToken })
    })
  },

  logoutUser: async (req, res) => {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: false,
      path: '/',
      sameSite: 'strict'
    })
    res.status(200).json('Logout successfully')
  }
}

module.exports = authController
