const authRoute = require('./authRoute')
const supplierRoute = require('./supplierRoute')
const productRoute = require('./productRoute')
const customerRoute = require('./customerRoute')
const orderRoute = require('./orderRoute')
const categoryRoute = require('./categoryRoute')
const stockInRoute = require('./stockIntRoute')
const attendanceSalaryRoute = require('./attendanceSalaryRoute')
const brandRoute = require('./brandRoute')
const unitRoute = require('./unitRoute')

function route(app) {
  app.use('/auth', authRoute)
  app.use('/supplier', supplierRoute)
  app.use('/product', productRoute)
  app.use('/customer', customerRoute)
  app.use('/order', orderRoute)
  app.use('/category', categoryRoute)
  app.use('/stock-in', stockInRoute) 
  app.use('/attendance-salary', attendanceSalaryRoute)
  app.use('/brand', brandRoute)
  app.use('/unit', unitRoute)
}

module.exports = route