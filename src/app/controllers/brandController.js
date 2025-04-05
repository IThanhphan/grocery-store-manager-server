const Brand = require('../models/brandModel')

const brandController = {
  // Lấy danh sách tất cả thương hiệu
  getListOfAllBrands: async (req, res) => {
    try {
      const brands = await Brand.find()
      res.status(200).json(brands)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  // Thêm một thương hiệu mới
  addNewBrand: async (req, res) => {
    try {
      const { name } = req.body

      if (!name) return res.status(400).json({ message: 'Missing required fields' })
      console.log({ name })
      const newBrand = new Brand({ name })
      await newBrand.save()

      res.status(201).json(newBrand)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  // Xóa một thương hiệu
  deleteBrand: async (req, res) => {
    try {
      const { id } = req.query
      if (!id) return res.status(400).json({ message: 'Missing Brand ID' })

      const deletedBrand = await Brand.findByIdAndDelete(id)
      if (!deletedBrand) return res.status(404).json({ message: 'Brand not found' })

      res.status(200).json({ message: 'Brand deleted successfully' })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
}

module.exports = brandController