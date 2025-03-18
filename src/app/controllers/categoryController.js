const Category = require('../models/categoryModel')

const categoryController = {
  // Lấy danh sách tất cả loại hàng
  getListOfAllCategories: async (req, res) => {
    try {
      const categories = await Category.find()
      res.status(200).json(categories)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  // Thêm một loại hàng mới
  addNewCategory: async (req, res) => {
    try {
      const { categoryName } = req.body

      if (!categoryName) return res.status(400).json({ message: 'Missing required fields' })
      console.log({ categoryName })
      const newCategory = new Category({ categoryName })
      await newCategory.save()

      res.status(201).json(newCategory)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  // Xóa một loại hàng
  deleteCategory: async (req, res) => {
    try {
      const { id } = req.query
      if (!id) return res.status(400).json({ message: 'Missing Category ID' })

      const deletedCategory = await Category.findByIdAndDelete(id)
      if (!deletedCategory) return res.status(404).json({ message: 'Category not found' })

      res.status(200).json({ message: 'Category deleted successfully' })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
}

module.exports = categoryController