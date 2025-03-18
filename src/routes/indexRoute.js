const authRoute = require('./authRoute')
const supplierRoute = require('./supplierRoute')
const productRoute = require('./productRoute')
const customerRoute = require('./customerRoute')
const employeeRoute = require('./employeeRoute')
const orderRoute = require('./orderRoute')
const categoryRoute = require('./categoryRoute')

function route(app) {
  app.use('/auth', authRoute)
  app.use('/supplier', supplierRoute)
  app.use('/product', productRoute)
  app.use('/customer', customerRoute)
  app.use('/employee', employeeRoute)
  app.use('/order', orderRoute)
  app.use('/category', categoryRoute)
}

module.exports = route