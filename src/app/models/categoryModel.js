const mongoose = require('mongoose')
const Counter = require('./counterModel')

const categorySchema = new mongoose.Schema({
  categoryId: {
    type: String,
    required: true,
    unique: true
  },
  categoryName: {
    type: String,
    required: true
  }
}, { timestamps: true })

categorySchema.pre('validate', async function (next) {
  if (this.isNew) {
    const counter = await Counter.findOneAndUpdate(
      { model: 'Category' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    )
    this.categoryId = `NCC-${counter.seq.toString().padStart(5, '0')}`
  }
  next()
})

module.exports = mongoose.model('Category', categorySchema)