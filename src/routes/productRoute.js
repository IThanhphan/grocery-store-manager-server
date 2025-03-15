const express = require('express')
const router = express.Router()
const productController = require('../app/controllers/productController')

router.get('/get-list-of-all-products', productController.getAllProducts)
router.get('/get-detailed-information-of-a-product', productController.getProductById)
router.post('/add-a-new-product', productController.addProduct)
router.put('/update-product-information', productController.updateProduct)
router.delete('/remove-product-from-system', productController.deleteProduct)
router.get('/get-product-list-by-category', productController.getProductsByCategory)
router.get('/get-a-list-of-products-from-a-supplier', productController.getProductsBySupplier)
router.get('/get-nearly-expired-products', productController.getNearlyExpiredProducts)
router.get('/get-expired-products', productController.getExpiredProducts)

module.exports = router