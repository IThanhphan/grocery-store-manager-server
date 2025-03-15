const express = require('express')
const router = express.Router()
const supplierController = require('../app/controllers/supplierController')

router.get('/get-list-of-all-suppliers', supplierController.getListOfAllSuppliers)
router.get('/get-details-of-a-supplier', supplierController.getDetailsOfSupplier)
router.post('/add-a-new-supplier', supplierController.addNewSupplier)
router.put('/update-supplier-information', supplierController.updateSupplierInformation)
router.delete('/delete-a-supplier', supplierController.deleteSupplier)

module.exports = router