const mongoose = require('mongoose')
const Counter = require('./counterModel')

const brandSchema  = new mongoose.Schema({
  brandId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    unique: true
  }
}, { timestamps: true })

brandSchema.pre('validate', async function (next) {
  if (this.isNew) {
    const counter = await Counter.findOneAndUpdate(
      { model: 'Brand' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    )
    this.brandId = `TH-${counter.seq.toString().padStart(5, '0')}`
  }
  next()
})

module.exports = mongoose.model('Brand', brandSchema)