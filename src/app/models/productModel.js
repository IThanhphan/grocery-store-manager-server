const mongoose = require('mongoose')
const Counter = require('./counterModel')

const productSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  supplierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    required: true
  },
  brandId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
    required: true
  },
  unitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Unit',
    required: true
  },
  image: {
    type: String,
    required: false
  }
}, { timestamps: true })

productSchema.pre('validate', async function (next) {
  if (this.isNew) {
    const counter = await Counter.findOneAndUpdate(
      { model: 'Product' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    )
    this.productId = `SP-${counter.seq.toString().padStart(5, '0')}`
  }
  next()
})

module.exports = mongoose.model('Product', productSchema)