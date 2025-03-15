const mongoose = require('mongoose')

async function connect() {
  try {
    await mongoose.connect(process.env.MONGODB_URL)
    console.log('Connected to database')
  } catch (err) {
    console.error('Database connection error: ', err)
  }
}

module.exports = { connect }