const mongoose = require('mongoose')
const Counter = require('./counterModel')

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true
  },
  address: {
    type: String,
    required: true
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

module.exports = mongoose.model('User', userSchema)