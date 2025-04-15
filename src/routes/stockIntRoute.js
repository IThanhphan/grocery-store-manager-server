const express = require('express')
const router = express.Router()
const stockInController = require('../app/controllers/stockInController')

router.get('/get-stock-ints', stockInController.getAllStockInts)
router.get('/get-stock-int-by-id', stockInController.getStockIntById)
router.post('/create-stock-int', stockInController.createStockInt)
router.put('/update-stock-int', stockInController.updateStockInt)
router.delete('/delete-stock-int', stockInController.deleteStockInt)

module.exports = router