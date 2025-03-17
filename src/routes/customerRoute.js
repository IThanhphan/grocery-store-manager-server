const express = require('express')
const router = express.Router()
const customerController = require('../app/controllers/customerController')

router.get('/get-a-list-of-all-customers', customerController.getListOfAllCustomers)
router.get('/get-details-of-a-customer', customerController.getDetailsOfCustomer)
router.post('/add-a-new-customer', customerController.addNewCustomer)
router.put('/update-customer-information', customerController.updateCustomerInformation)
router.delete('/delete-a-customer', customerController.deleteCustomer)

module.exports = router