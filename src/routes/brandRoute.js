const express = require('express')
const router = express.Router()
const brandController = require('../app/controllers/brandController')

router.get('/get-a-list-of-all-brands', brandController.getListOfAllBrands)
router.post('/add-a-new-brand', brandController.addNewBrand)
router.delete('/delete-a-brand', brandController.deleteBrand)

module.exports = router