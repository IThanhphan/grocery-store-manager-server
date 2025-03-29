const Product = require('../models/productModel')

const productController = {
  // Lấy danh sách tất cả sản phẩm
  getAllProducts: async (req, res) => {
    try {
      const products = await Product.find()
        .populate('categoryId', 'name')
        .populate('supplierId', 'name')

      const formattedProducts = products.map(product => ({
        _id: product._id,
        productId: product.productId,
        name: product.name,
        categoryName: product.categoryId ? product.categoryId.name : 'Unknown',
        supplierName: product.supplierId ? product.supplierId.name : 'Unknown',
        brand: product.brand,
        unit: product.unit,
        importPrice: product.importPrice,
        sellPrice: product.sellPrice,
        stock: product.stock,
        expirationDate: product.expirationDate,
        image: product.image,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      }))

      res.status(200).json(formattedProducts)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  // Lấy thông tin chi tiết sản phẩm theo ID
  getProductById: async (req, res) => {
    try {
      const { id } = req.query
      if (!id) return res.status(404).json({ message: 'Missing product ID' })

      const product = await Product.findById(id)
        .populate('categoryId', 'name')
        .populate('supplierId', 'name')

      if (!product) return res.status(404).json({ message: 'Product not found' })

      res.status(200).json({
        productId: product.productId,
        name: product.name,
        categoryName: product.categoryId ? product.categoryId.name : 'Unknown',
        supplierName: product.supplierId ? product.supplierId.name : 'Unknown',
        brand: product.brand,
        unit: product.unit,
        importPrice: product.importPrice,
        sellPrice: product.sellPrice,
        stock: product.stock,
        expirationDate: product.expirationDate,
        image: product.image,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  // Thêm một sản phẩm mới
  addProduct: async (req, res) => {
    try {
      const { name, categoryId, supplierId, brand, unit, importPrice, sellPrice, stock, expirationDate, image } = req.body

      if (!name || !categoryId || !supplierId || !brand || !unit || !importPrice || !sellPrice || !expirationDate) {
        return res.status(400).json({ message: 'Missing required fields' })
      }

      console.log({ name, categoryId, supplierId, brand, unit, importPrice, sellPrice, stock, expirationDate, image })
      const newProduct = new Product({ name, categoryId, supplierId, brand, unit, importPrice, sellPrice, stock, expirationDate, image })
      await newProduct.save()

      const populatedProduct = await Product.findById(newProduct._id)
        .populate('categoryId', 'name')
        .populate('supplierId', 'name')

      res.status(201).json({
        productId: populatedProduct.productId,
        name: populatedProduct.name,
        categoryName: populatedProduct.categoryId ? populatedProduct.categoryId.name : 'Unknown',
        supplierName: populatedProduct.supplierId ? populatedProduct.supplierId.name : 'Unknown',
        brand: populatedProduct.brand,
        unit: populatedProduct.unit,
        importPrice: populatedProduct.importPrice,
        sellPrice: populatedProduct.sellPrice,
        stock: populatedProduct.stock,
        expirationDate: populatedProduct.expirationDate,
        image: populatedProduct.image,
        createdAt: populatedProduct.createdAt,
        updatedAt: populatedProduct.updatedAt
      })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  // Cập nhật sản phẩm theo ID
  updateProduct: async (req, res) => {
    try {
      const { id } = req.query
      if (!id) return res.status(400).json({ message: 'Missing product ID' })

      const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
        .populate('categoryId', 'name')
        .populate('supplierId', 'name')
      if (!updatedProduct) return res.status(404).json({ message: 'Product not found' })

      res.status(200).json({
        productId: updatedProduct.productId,
        name: updatedProduct.name,
        categoryName: updatedProduct.categoryId ? updatedProduct.categoryId.name : 'Unknown',
        supplierName: updatedProduct.supplierId ? updatedProduct.supplierId.name : 'Unknown',
        brand: updatedProduct.brand,
        unit: updatedProduct.unit,
        importPrice: updatedProduct.importPrice,
        sellPrice: updatedProduct.sellPrice,
        stock: updatedProduct.stock,
        expirationDate: updatedProduct.expirationDate,
        image: updatedProduct.image,
        createdAt: updatedProduct.createdAt,
        updatedAt: updatedProduct.updatedAt
      })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  // Xóa sản phẩm theo ID
  deleteProduct: async (req, res) => {
    try {
      const { id } = req.query
      if (!id) return res.status(400).json({ message: 'Missing product ID' })

      const deletedProduct = await Product.findByIdAndDelete(id)
      if (!deletedProduct) return res.status(404).json({ message: 'Product not found' })

      res.status(200).json({ message: 'Product deleted successfully' })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  // Lấy danh sách sản phẩm theo loại sản phẩm
  getProductsByCategory: async (req, res) => {
    try {
      const { categoryId } = req.query
      if (!categoryId) return res.status(400).json({ message: 'Missing categoryId' })

      const products = await Product.find({ category: categoryId })
      if (products.length === 0) return res.status(404).json({ message: 'No products found in this category' })

      res.status(200).json(products)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  // Lấy danh sách sản phẩm của một nhà cung cấp
  getProductsBySupplier: async (req, res) => {
    try {
      const { supplierId } = req.query
      if (!supplierId) return res.status(400).json({ message: 'Missing supplierId' })

      const products = await Product.find({ supplierId: supplierId })
      if (products.length === 0) return res.status(404).json({ message: 'No products found in this supplier' })

      res.status(200).json(products)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  // Lấy danh sách sản phẩm gần hết hạn
  getNearlyExpiredProducts: async (req, res) => {
    try {
      const { daysLeft } = req.query

      if (!daysLeft || isNaN(daysLeft) || daysLeft <= 0) {
        return res.status(400).json({ message: "Invalid daysLeft value" })
      }

      const today = new Date()
      const deadlineDate = new Date()
      deadlineDate.setDate(today.getDate() + parseInt(daysLeft));

      const nearlyExpiredProducts = await Product.find({
        expirationDate: { $gte: today, $lte: deadlineDate }
      }).populate('supplierId')

      res.status(200).json(nearlyExpiredProducts)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  //Lấy sản phẩm đã hết hạn
  getExpiredProducts: async (req, res) => {
    try {
      const today = new Date()

      const expiredProducts = await Product.find({
        expirationDate: { $lt: today }
      }).populate('supplierId')

      res.status(200).json(expiredProducts)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  // Lấy danh sách sản phẩm theo thương hiệu cụ thể
  getProductsByBrand: async (req, res) => {
    try {
      const { brand } = req.query
      if (!brand) return res.status(400).json({ message: 'Missing brand name' })

      const products = await Product.find({ brand: brand })
      if (products.length === 0) return res.status(404).json({ message: 'No products found for this brand' })

      res.status(200).json(products)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  //Lấy danh sách đơn vị tính của sản phẩm
  getAllUnits: async (req, res) => {
    try {
      const units = await Product.distinct('unit');
      res.status(200).json(units);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Lọc sản phẩm theo đơn vị tính
  getProductsByUnit: async (req, res) => {
    try {
      const { unit } = req.query;
      if (!unit) return res.status(400).json({ message: 'Missing unit name' });

      const products = await Product.find({ unit: unit });
      if (products.length === 0) return res.status(404).json({ message: 'No products found for this unit' });

      res.status(200).json(products);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = productController
