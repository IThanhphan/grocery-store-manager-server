const mongoose = require('mongoose')
const Counter = require('./counterModel')

const stockIntSchema = new mongoose.Schema({
  stockId: {
    type: String,
    required: true,
    unique: true
  },
  supplierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    required: true
  },
  importDate: {
    type: Date,
    default: Date.now
  },
  totalAmount: {
    type: Number,
    required: true
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    importPrice: {
      type: Number,
      required: true
    }
  }]
}, { timestamps: true })

stockIntSchema.pre('validate', async function (next) {
  if (this.isNew) {
    const counter = await Counter.findOneAndUpdate(
      { model: 'StockInt' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    )
    this.productId = `SP-${counter.seq.toString().padStart(5, '0')}`
  }
  next()
})

module.exports = mongoose.model('StockInt', stockIntSchema)