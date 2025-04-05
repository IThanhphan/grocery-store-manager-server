const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const authController = {
  addNewUser: async (req, res) => {
    try {
      const salt = await bcrypt.genSalt()
      const hashed = await bcrypt.hash(req.body.password, salt)

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: hashed,
        dob: req.body.dob,
        address: req.body.address,
        gender: req.body.gender,           
        citizenId: req.body.citizenId
      })

      const user = await newUser.save()
      res.status(201).json(user)
    } catch (err) {
      res.status(500).json(err)
    }
  },

  generateAccessToken: (user) => {
    return jwt.sign({
      id: user.id,
      manager: user.manager
    }, process.env.JWT_ACCESS_KEY, { expiresIn: '5m' })
  },

  generateRefreshToken: (user) => {
    return jwt.sign({
      id: user.id,
      manager: user.manager
    }, process.env.JWT_REFRESH_KEY, { expiresIn: '1d' })
  },

  loginUser: async (req, res) => {
    try {
      const user = await User.findOne({ name: req.body.name })
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
    } catch (err) {
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
  },

  getListOfAllUsers: async (req, res) => {
    try {
      const Users = await User.find()
      res.status(200).json(Users)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  // Lấy chi tiết một nhân viên theo ID
  getDetailsOfUser: async (req, res) => {
    try {
      const { id } = req.query
      if (!id) return res.status(400).json({ message: 'Missing User ID' })

      const user = await User.findById(id)
      if (!user) return res.status(404).json({ message: 'User not found' })

      res.status(200).json(user)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  // Cập nhật thông tin nhân viên
  updateUserInformation: async (req, res) => {
    try {
      const { id } = req.query
      if (!id) return res.status(400).json({ message: 'Missing User ID' })

      let updateData = { ...req.body };

      if (req.body.password) {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        updateData.password = hashedPassword;
      }

      const updatedUser = await User.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true
      });

      if (!updatedUser) return res.status(404).json({ message: 'User not found' })

      res.status(200).json(updatedUser)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  // Xóa một nhân viên
  deleteUser: async (req, res) => {
    try {
      const { id } = req.query
      if (!id) return res.status(400).json({ message: 'Missing User ID' })

      const deletedUser = await User.findByIdAndDelete(id)
      if (!deletedUser) return res.status(404).json({ message: 'User not found' })

      res.status(200).json({ message: 'User deleted successfully' })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
}

module.exports = authController
