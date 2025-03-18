const mongoose = require('mongoose')
const Counter = require('./counterModel')

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    minLength: 6,
    maxLength: 20,
    unique: true
  },
  email: {
    type: String,
    required: true,
    minLength: 10,
    maxLength: 50,
    unique: true
  },
  phoneNumber: {
    type: String,
    required: true,
    minLength: 10,
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

userSchema.pre('validate', async function (next) {
  if (this.isNew) {
    const counter = await Counter.findOneAndUpdate(
      { model: 'User' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    )
    this.userId = `USR-${counter.seq.toString().padStart(5, '0')}`
  }
  next()
})

module.exports = mongoose.model('Users', userSchema)