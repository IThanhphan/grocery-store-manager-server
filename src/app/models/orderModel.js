const mongoose = require('mongoose')
const Counter = require('./counterModel')

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer"
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  otherPaidAmount: {
    type: Number,
    default: 0,
  },
  paymentMethod: {
    type: String,
    enum: ["cash", "credit card", "bank transfer"],
    default: "cash",
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      },
      quantity: {
        type: Number,
        required: true
      },
      price: {
        type: Number,
        required: true,
      }
    }
  ]
}, { timestamps: true })

orderSchema.pre('validate', async function (next) {
  if (this.isNew) {
    const counter = await Counter.findOneAndUpdate(
      { model: 'Order' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    )
    this.orderId = `HD-${counter.seq.toString().padStart(5, '0')}`
  }
  next()
})

module.exports = mongoose.model('Order', orderSchema)