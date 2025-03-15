const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 20,
    unique: true
  },
  email: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 50,
    unique: true
  },
  phoneNumber: {
    type: String,
    required: true,
    minlength: 10,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  manager: {
    type: Boolean,
    default: false
  }
}, { timestamps: true })

module.exports = mongoose.model('Users', userSchema)