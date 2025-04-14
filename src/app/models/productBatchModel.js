const mongoose = require('mongoose')
const Counter = require('./counterModel')

const productBatchSchema = new mongoose.Schema({
  productBatchId: {
    type: String,
    required: true,
    unique: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  stockIntId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StockInt',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  importPrice: {
    type: Number,
    required: true,
    min: 0
  },
  sellPrice: {
    type: Number,
    required: true,
    min: 0
  },
  expirationDate: {
    type: Date,
    required: true
  }
}, { timestamps: true })

productBatchSchema.pre('validate', async function (next) {
  if (this.isNew) {
    const counter = await Counter.findOneAndUpdate(
      { model: 'ProductBatch' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    )
    this.productBatchId = `LH-${counter.seq.toString().padStart(5, '0')}`
  }
  next()
})

module.exports = mongoose.model('ProductBatch', productBatchSchema)