const StockInt = require('../models/stockIntModel')
const Supplier = require('../models/supplierModel')
const User = require('../models/userModel')
const Product = require('../models/productModel')

const productController = {
  // Lấy danh sách tất cả kho
  getAllStockInts: async (req, res) => {
    try {
      const stockInts = await StockInt.find()
        .populate('supplierId', 'name')
        .populate('userId', 'name')
        .populate('items.productId', 'name')

      const formattedStockInts = stockInts.map(stockInt => ({
        _id: stockInt._id,
        stockIntId: stockInt.stockIntId,
        name: stockInt.name,
        supplierName: stockInt.supplierId ? stockInt.supplierId.name : 'Unknown',
        userName: stockInt.userId ? stockInt.userId.name : 'Unknown',
        importDate: stockInt.importDate,
        totalAmount: stockInt.totalAmount,
        items: stockInt.items.map(item => ({
          productName: item.productId ? item.productId.name : 'Unknown',
          quantity: item.quantity,
          importPrice: item.importPrice,
          sellPrice: item.sellPrice,
          expirationDate: item.expirationDate
        })),
        createdAt: stockInt.createdAt,
        updatedAt: stockInt.updatedAt
      }))

      res.status(200).json(formattedStockInts)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  // Lấy thông tin chi tiết kho theo ID
  getStockIntById: async (req, res) => {
    try {
      const { id } = req.query
      if (!id) return res.status(400).json({ message: 'Missing stockInt ID' })

      const stockInt = await StockInt.findById(id)
        .populate('supplierId', 'name')
        .populate('userId', 'name')
        .populate('items.productId', 'name')

      if (!stockInt) return res.status(404).json({ message: 'stockInt not found' })

      res.status(200).json({
        stockIntId: stockInt.stockIntId,
        supplierName: stockInt.supplierId ? stockInt.supplierId.name : 'Unknown',
        userName: stockInt.userId ? stockInt.userId.name : 'Unknown',
        importDate: stockInt.importDate,
        totalAmount: stockInt.totalAmount,
        items: stockInt.items.map(item => ({
          productName: item.productId ? item.productId.name : 'Unknown',
          quantity: item.quantity,
          importPrice: item.importPrice,
          sellPrice: item.sellPrice,
          expirationDate: item.expirationDate
        })),
      })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  // Thêm một kho mới
  createStockInt: async (req, res) => {
    try {
      const { supplierName, userName, items } = req.body

      if (!supplierName || !userName || items.length === 0) {
        return res.status(400).json({ message: 'Missing required fields' })
      }

      const supplier = await Supplier.findOne({ name: supplierName })
      if (!supplier) return res.status(404).json({ message: 'Supplier not found' })
      const supplierId = supplier._id

      let userId = null
      if (userName) {
        const user = await User.findOne({ name: userName })
        if (!user) return res.status(404).json({ message: 'User not found' })
        userId = user._id
      }

      let totalAmount = 0

      const processedItems = await Promise.all(items.map(async (item) => {
        const product = await Product.findOne({ name: item.productName })
        if (!product) throw new Error(`Product not found: ${item.productName}`)

        const { quantity, importPrice, sellPrice, expirationDate } = item

        if (!quantity || !importPrice || !expirationDate) {
          throw new Error(`Missing fields for product: ${item.productName}`)
        }

        const totalPrice = quantity * importPrice
        totalAmount += totalPrice

        return {
          productId: product._id,
          quantity,
          importPrice,
          sellPrice,
          expirationDate
        }
      }))

      console.log({ customerName, userName, paymentMethod, items: processedItems })

      const newStockInt = new StockInt({
        supplierId: supplier._id,
        userId: user._id,
        totalAmount,
        items: processedItems
      })

      await newStockInt.save()

      res.status(201).json(newStockInt)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  // Cập nhật kho theo ID
  updateStockInt: async (req, res) => {
    try {
      const { id } = req.query
      const { supplierName, userName, items } = req.body

      if (!id || !supplierName || !userName || !items || !items.length) {
        return res.status(400).json({ message: 'Missing required fields' })
      }

      const stockInt = await StockInt.findById(id)
      if (!stockInt) return res.status(404).json({ message: 'StockIn not found' })

      const supplier = await Supplier.findOne({ name: supplierName })
      if (!supplier) return res.status(404).json({ message: 'Supplier not found' })

      const user = await User.findOne({ name: userName })
      if (!user) return res.status(404).json({ message: 'User not found' })

      let totalAmount = 0
      const updatedItems = await Promise.all(items.map(async item => {
        const product = await Product.findOne({ name: item.productName })
        if (!product) throw new Error(`Product not found: ${item.productName}`)

        const { quantity, importPrice, sellPrice, expirationDate } = item
        const totalPrice = quantity * importPrice
        totalAmount += totalPrice

        return {
          productId: product._id,
          quantity,
          importPrice,
          sellPrice,
          expirationDate
        }
      }))

      await ProductBatch.deleteMany({ stockIntId: stockInt._id })

      stockInt.supplierId = supplier._id
      stockInt.userId = user._id
      stockInt.totalAmount = totalAmount
      stockInt.items = updatedItems

      await stockInt.save()

      res.status(200).json(stockInt)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  // Xóa kho theo ID
  deleteStockInt: async (req, res) => {
    try {
      const { id } = req.query
      if (!id) return res.status(400).json({ message: 'Missing stockIn ID' })

      const stockInt = await StockInt.findById(id)
      if (!stockInt) return res.status(404).json({ message: 'StockIn not found' })

      await ProductBatch.deleteMany({ stockIntId: stockInt._id })

      await StockInt.findByIdAndDelete(id)

      res.status(200).json({ message: 'StockIn deleted successfully' })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }
}

module.exports = productController
