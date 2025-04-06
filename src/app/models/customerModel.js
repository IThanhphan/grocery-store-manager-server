const mongoose = require('mongoose')
const Counter = require('./counterModel')

const customerSchema = new mongoose.Schema({
  customerId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  gender: {
    type: Boolean,
    required: true
  },
  customerType: {
    type: Boolean,
    required: true
  },
  identityNumber: {
    type: String,
    required: true,
    unique: true
  },
  company: {
    type: String, // Tên công ty (nếu có)
    default: ''
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  note: {
    type: String,
    default: ''
  }
}, { timestamps: true })

customerSchema.pre('validate', async function (next) {
  if (this.isNew) {
    const counter = await Counter.findOneAndUpdate(
      { model: 'Customer' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    )
    this.customerId = `KH-${counter.seq.toString().padStart(5, '0')}`
  }
  next()
})

module.exports = mongoose.model('Customer', customerSchema)