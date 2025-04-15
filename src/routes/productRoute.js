const express = require('express')
const router = express.Router()
const productController = require('../app/controllers/productController')
const upload = require('../app/middlewares/uploadMiddleware')

router.get('/get-list-of-all-products', productController.getAllProducts)
router.get('/get-detailed-information-of-a-product', productController.getProductById)
router.post('/add-a-new-product', upload.single('image'), productController.addProduct)
router.put('/update-product-information', productController.updateProduct)
router.delete('/remove-product-from-system', productController.deleteProduct)
router.get('/get-product-list-by-category', productController.getProductsByCategory)
router.get('/get-products-by-brand', productController.getProductsByBrand)
router.get('/get-products-by-unit', productController.getProductsByUnit)

module.exports = router