const express = require('express')
const router = express.Router()
const categoryController = require('../app/controllers/categoryController')

router.get('/get-a-list-of-all-categories', categoryController.getListOfAllCategories)
router.post('/add-a-new-category', categoryController.addNewCategory)
router.delete('/delete-a-category', categoryController.deleteCategory)

module.exports = router