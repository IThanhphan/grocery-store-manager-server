const express = require('express')
const router = express.Router()
const orderController = require('../app/controllers/orderController')

router.get('/get-all-orders', orderController.getAllOrders)
router.get('/get-order-by-id', orderController.getOrderById)
router.post('/create-order', orderController.createOrder)
router.put('/update-order', orderController.updateOrder)
router.delete('/delete-order', orderController.deleteOrder)
router.get('/get-orders-by-customer', orderController.getOrdersByCustomer)
router.get('/get-orders-by-user', orderController.getOrdersByUser)
router.get('/get-orders-by-date-range', orderController.getOrdersByDateRange)
router.get('/get-orders-by-payment-method', orderController.getOrdersByPaymentMethod)

module.exports = router