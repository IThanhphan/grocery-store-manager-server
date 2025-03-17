const authRoute = require('./authRoute')
const supplierRoute = require('./supplierRoute')
const productRoute = require('./productRoute')
const customerRoute = require('./customerRoute')
const employeeRoute = require('./employeeRoute')

function route(app) {
  app.use('/auth', authRoute)
  app.use('/supplier', supplierRoute)
  app.use('/product', productRoute)
  app.use('/customer', customerRoute)
  app.use('/employee', employeeRoute)
}

module.exports = route