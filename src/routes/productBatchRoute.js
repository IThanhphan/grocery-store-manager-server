const express = require('express')
const router = express.Router()
const productBatchController = require('../app/controllers/productBatchController')

router.get('/get-product-batches', productBatchController.getAllProductBatches)
router.get('/get-product-batch-by-id', productBatchController.getProductBatchById)
router.post('/create-product-batch', productBatchController.createProductBatch)
router.put('/update-product-batch', productBatchController.updateProductBatch)
router.delete('/delete-product-batch', productBatchController.deleteProductBatch)

module.exports = router