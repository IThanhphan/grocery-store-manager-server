const mongoose = require('mongoose')
const Counter = require('./counterModel')

const attendanceSalarySchema = new mongoose.Schema({
  attendanceSalaryId:{
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  date: { 
    type: Date, 
    required: true 
  },
  checkIn: { 
    type: Date, 
    required: true 
  },
  checkOut: { 
    type: Date 
  },
  status: { 
    type: String, 
    enum: ["Present", "Absent", "Late", "Left Early"], 
    required: true 
  },
  hourlyRate: { 
    type: Number, 
    required: true 
  },
  bonus: { 
    type: Number, 
    default: 0 
  },
  deductions: { 
    type: Number, 
    default: 0 
  },
  workingHours: {
    type: Number,
    default: 0,
  },
  totalSalary: {
    type: Number,
    default: 0,
  },
  finalSalary: {
    type: Number,
    default: 0,
  }
}, { timestamps: true })

attendanceSalarySchema.pre('validate', async function (next) {
  if (this.isNew) {
    const counter = await Counter.findOneAndUpdate(
      { model: 'AttendanceSalary' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    )
    this.attendanceSalaryId = `CC&TL-${counter.seq.toString().padStart(5, '0')}`
  }
  next()
})

module.exports = mongoose.model('AttendanceSalary', attendanceSalarySchema)