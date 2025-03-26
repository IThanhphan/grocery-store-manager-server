const express = require('express')
const router = express.Router()
const stockInController = require('../app/controllers/stockInController')

router.get('/get-stock-ins', stockInController.getStockIns)
router.get('/get-stock-in-by-id', stockInController.getStockInById)
router.post('/add-stock-in', stockInController.addStockIn)
router.put('/update-stock-in', stockInController.updateStockIn)
router.delete('/delete-stock-in', stockInController.deleteStockIn)

module.exports = router