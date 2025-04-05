const Unit = require('../models/unitModel')

const unitController = {
  // Lấy danh sách tất cả đơn vị
  getListOfAllUnits: async (req, res) => {
    try {
      const Units = await Unit.find()
      res.status(200).json(Units)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  // Thêm một đơn vị mới
  addNewUnit: async (req, res) => {
    try {
      const { name } = req.body

      if (!name) return res.status(400).json({ message: 'Missing required fields' })
      console.log({ name })
      const newUnit = new Unit({ name })
      await newUnit.save()

      res.status(201).json(newUnit)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  // Xóa một đơn vị
  deleteUnit: async (req, res) => {
    try {
      const { id } = req.query
      if (!id) return res.status(400).json({ message: 'Missing Unit ID' })

      const deletedUnit = await Unit.findByIdAndDelete(id)
      if (!deletedUnit) return res.status(404).json({ message: 'Unit not found' })

      res.status(200).json({ message: 'Unit deleted successfully' })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
}

module.exports = unitController