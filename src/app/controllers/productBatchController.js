const ProductBatch = require('../models/productBatchModel')
const Product = require('../models/productModel')
const StockInt = require('../models/stockIntModel')

const productBatchController = {
  // Lấy danh sách tất cả các lô sản phẩm
  getAllProductBatches: async (req, res) => {
    try {
      const productBatches = await ProductBatch.find()
        .populate('productId', 'name')
        .populate('stockIntId', 'name')

      const formattedProductBatches = productBatches.map(batch => ({
        productBatchId: batch.productBatchId,
        productName: batch.productId ? batch.productId.name : 'Unknown',
        stockIntName: batch.stockIntId ? batch.stockIntId.name : 'Unknown',
        quantity: batch.quantity,
        importPrice: batch.importPrice,
        sellPrice: batch.sellPrice,
        expirationDate: batch.expirationDate,
        createdAt: batch.createdAt,
        updatedAt: batch.updatedAt
      }))

      res.status(200).json(formattedProductBatches)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  // Lấy thông tin chi tiết một lô sản phẩm theo ID
  getProductBatchById: async (req, res) => {
    try {
      const { id } = req.query
      if (!id) return res.status(400).json({ message: 'Missing productBatch ID' })

      const productBatch = await ProductBatch.findById(id)
        .populate('productId', 'name')
        .populate('stockIntId', 'name')

      if (!productBatch) return res.status(404).json({ message: 'ProductBatch not found' })

      res.status(200).json({
        productBatchId: productBatch.productBatchId,
        productName: productBatch.productId ? productBatch.productId.name : 'Unknown',
        stockIntName: productBatch.stockIntId ? productBatch.stockIntId.name : 'Unknown',
        quantity: productBatch.quantity,
        importPrice: productBatch.importPrice,
        sellPrice: productBatch.sellPrice,
        expirationDate: productBatch.expirationDate
      })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  // Thêm một lô sản phẩm mới
  createProductBatch: async (req, res) => {
    try {
      const { productId, stockIntId, quantity, importPrice, sellPrice, expirationDate } = req.body

      if (!productId || !stockIntId || !quantity || !importPrice || !sellPrice || !expirationDate) {
        return res.status(400).json({ message: 'Missing required fields' })
      }

      const product = await Product.findById(productId)
      if (!product) return res.status(404).json({ message: 'Product not found' })

      const stockInt = await StockInt.findById(stockIntId)
      if (!stockInt) return res.status(404).json({ message: 'StockInt not found' })

      const newProductBatch = new ProductBatch({
        productId,
        stockIntId,
        quantity,
        importPrice,
        sellPrice,
        expirationDate
      })

      await newProductBatch.save()

      res.status(201).json(newProductBatch)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  // Cập nhật lô sản phẩm theo ID
  updateProductBatch: async (req, res) => {
    try {
      const { id } = req.query
      const { productId, stockIntId, quantity, importPrice, sellPrice, expirationDate } = req.body

      if (!id || !productId || !stockIntId || !quantity || !importPrice || !sellPrice || !expirationDate) {
        return res.status(400).json({ message: 'Missing required fields' })
      }

      const productBatch = await ProductBatch.findById(id)
      if (!productBatch) return res.status(404).json({ message: 'ProductBatch not found' })

      const product = await Product.findById(productId)
      if (!product) return res.status(404).json({ message: 'Product not found' })

      const stockInt = await StockInt.findById(stockIntId)
      if (!stockInt) return res.status(404).json({ message: 'StockInt not found' })

      productBatch.productId = productId
      productBatch.stockIntId = stockIntId
      productBatch.quantity = quantity
      productBatch.importPrice = importPrice
      productBatch.sellPrice = sellPrice
      productBatch.expirationDate = expirationDate

      await productBatch.save()

      res.status(200).json(productBatch)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  // Xóa lô sản phẩm theo ID
  deleteProductBatch: async (req, res) => {
    try {
      const { id } = req.query
      if (!id) return res.status(400).json({ message: 'Missing productBatch ID' })

      const productBatch = await ProductBatch.findById(id)
      if (!productBatch) return res.status(404).json({ message: 'ProductBatch not found' })

      await ProductBatch.findByIdAndDelete(id)

      res.status(200).json({ message: 'ProductBatch deleted successfully' })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  // Lấy số lượng của 1 sản phẩm
  getProductQuantity: async (req, res) => {
    try {
      const { productName } = req.query;
      if (!productName) return res.status(400).json({ message: 'Missing productName' });
  
      const product = await Product.findOne({ name: productName });
      if (!product) return res.status(404).json({ message: 'Product not found' });
  
      const batches = await ProductBatch.find({ productId: product._id });
      const totalQuantity = batches.reduce((sum, batch) => sum + batch.quantity, 0);
  
      res.status(200).json({
        productId: product.productId,
        productName: product.name,
        stockQuantity: totalQuantity
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = productBatchController