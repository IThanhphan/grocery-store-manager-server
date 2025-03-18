const StockIn = require('../models/stockInModel')

const productController = {
  // Lấy danh sách tất cả kho
  getStockIns: async (req, res) => {
    try {
      const stockIns = await StockIn.find()
      res.status(200).json(stockIns)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  // Lấy thông tin chi tiết kho theo ID
  getStockInById: async (req, res) => {
    try {
      const { id } = req.query
      if (!id) return res.status(404).json({ message: 'Missing stockIn ID' })

      const stockIn = await StockIn.findById(id)
      if (!stockIn) return res.status(404).json({ message: 'StockIn not found' })

      res.status(200).json(stockIn)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  // Thêm một kho mới
  addStockIn : async (req, res) => {
    try {
      const { supplierId, employeeId, totalAmount, items } = req.body

      if (!supplierId || !employeeId || !totalAmount || !items.length) {
        return res.status(400).json({ message: 'Missing required fields' })
      }

      console.log({ supplierId, employeeId, totalAmount, items })
      const newStockIn  = new StockIn({ supplierId, employeeId, totalAmount, items })
      await newStockIn .save()

      res.status(201).json(newStockIn )
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  // Cập nhật kho theo ID
  updateStockIn: async (req, res) => {
    try {
      const { id } = req.query
      if (!id) return res.status(400).json({ message: 'Missing StockIn ID' })

      const updateStockIn = await StockIn.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
      if (!updateStockIn) return res.status(404).json({ message: 'StockIn not found' })

      res.status(200).json(updateStockIn)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  // Xóa kho theo ID
  deleteStockIn: async (req, res) => {
    try {
      const { id } = req.query
      if (!id) return res.status(400).json({ message: 'Missing stockIn ID' })

      const deletedStockIn  = await StockIn.findByIdAndDelete(id)
      if (!deletedStockIn ) return res.status(404).json({ message: 'StockIn not found' })

      res.status(200).json({ message: 'StockIn deleted successfully' })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }
}

module.exports = productController
