const express = require('express')
const router = express.Router()
const unitController = require('../app/controllers/unitController')

router.get('/get-a-list-of-all-units', unitController.getListOfAllUnits)
router.post('/add-a-new-unit', unitController.addNewUnit)
router.delete('/delete-a-unit', unitController.deleteUnit)

module.exports = router