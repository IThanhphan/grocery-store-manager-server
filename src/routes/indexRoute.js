const authRoute = require('./authRoute')
const supplierRoute = require('./supplierRoute')
const productRoute = require('./productRoute')
const customerRoute = require('./customerRoute')

function route(app) {
  app.use('/auth', authRoute)
  app.use('/supplier', supplierRoute)
  app.use('/product', productRoute)
  app.use('/customer', customerRoute)
}

module.exports = route