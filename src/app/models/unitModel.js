const mongoose = require('mongoose')
const Counter = require('./counterModel')

const unitSchema   = new mongoose.Schema({
  unitId: {
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

unitSchema.pre('validate', async function (next) {
  if (this.isNew) {
    const counter = await Counter.findOneAndUpdate(
      { model: 'Unit' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    )
    this.unitId = `DV-${counter.seq.toString().padStart(5, '0')}`
  }
  next()
})

module.exports = mongoose.model('Unit', unitSchema)