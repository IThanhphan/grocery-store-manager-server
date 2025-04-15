const Product = require('../models/productModel')
const Category = require('../models/categoryModel')
const Supplier = require('../models/supplierModel')
const Brand = require('../models/brandModel')
const Unit = require('../models/unitModel')

const productController = {
  // Lấy danh sách tất cả sản phẩm
  getAllProducts: async (req, res) => {
    try {
      const products = await Product.find()
        .populate('categoryId', 'name')
        .populate('supplierId', 'name')
        .populate('brandId', 'name')
        .populate('unitId', 'name')

      const formattedProducts = products.map(product => ({
        _id: product._id,
        productId: product.productId,
        name: product.name,
        categoryName: product.categoryId ? product.categoryId.name : 'Unknown',
        supplierName: product.supplierId ? product.supplierId.name : 'Unknown',
        brand: product.brandId ? product.brandId.name : 'Unknown',
        unit: product.unitId ? product.unitId.name : 'Unknown',
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
        .populate('brandId', 'name')
        .populate('unitId', 'name')

      if (!product) return res.status(404).json({ message: 'Product not found' })

      res.status(200).json({
        productId: product.productId,
        name: product.name,
        categoryName: product.categoryId ? product.categoryId.name : 'Unknown',
        supplierName: product.supplierId ? product.supplierId.name : 'Unknown',
        brand: product.brandId ? product.brandId.name : 'Unknown',
        unit: product.unitId ? product.unitId.name : 'Unknown',
        brand: product.brand,
        unit: product.unit,
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
      console.log('req.body:', req.body)
      console.log('req.file:', req.file)
      const { name, categoryName, supplierName, brandName, unitName } = req.body

      if (!name || !categoryName || !supplierName || !brandName || !unitName) {
        return res.status(400).json({ message: 'Missing required fields' })
      }

      const category = await Category.findOne({ name: categoryName })
      if (!category) return res.status(404).json({ message: 'Category not found' })

      const supplier = await Supplier.findOne({ name: supplierName })
      if (!supplier) return res.status(404).json({ message: 'Supplier not found' })

      const brand = await Brand.findOne({ name: brandName })
      if (!brand) return res.status(404).json({ message: 'Brand not found' })

      const unit = await Unit.findOne({ name: unitName })
      if (!unit) return res.status(404).json({ message: 'Unit not found' })

      // Lấy đường dẫn ảnh từ multer
      const image = req.file ? `/uploads/${req.file.filename}` : null

      console.log({ name, categoryName, supplierName, brandName, unitName, image })

      const newProduct = new Product({
        name,
        categoryId: category._id,
        supplierId: supplier._id,
        brandId: brand._id,
        unitId: unit._id,
        image
      })

      await newProduct.save()

      const populatedProduct = await Product.findById(newProduct._id)
        .populate('categoryId', 'name')
        .populate('supplierId', 'name')
        .populate('brandId', 'name')
        .populate('unitId', 'name')

      res.status(201).json({
        productId: populatedProduct.productId,
        name: populatedProduct.name,
        categoryName: populatedProduct.categoryId ? populatedProduct.categoryId.name : 'Unknown',
        supplierName: populatedProduct.supplierId ? populatedProduct.supplierId.name : 'Unknown',
        brandName: populatedProduct.brandId ? populatedProduct.brandId.name : 'Unknown',
        unitName: populatedProduct.unitId ? populatedProduct.unitId.name : 'Unknown',
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

      let updateData = { ...req.body }

      // Nếu có categoryName, tìm categoryId
      if (req.body.categoryName) {
        const category = await Category.findOne({ name: req.body.categoryName })
        if (!category) return res.status(404).json({ message: 'Category not found' })
        updateData.categoryId = category._id
      }

      // Nếu có supplierName, tìm supplierId
      if (req.body.supplierName) {
        const supplier = await Supplier.findOne({ name: req.body.supplierName })
        if (!supplier) return res.status(404).json({ message: 'Supplier not found' })
        updateData.supplierId = supplier._id
      }

      // Nếu có brandName, tìm brandId
      if (req.body.brandName) {
        const brand = await Brand.findOne({ name: req.body.brandName })
        if (!brand) return res.status(404).json({ message: 'Supplier not found' })
        updateData.brandId = brand._id
      }

      // Nếu có unitName, tìm unitId
      if (req.body.unitName) {
        const unit = await Unit.findOne({ name: req.body.unitName })
        if (!unit) return res.status(404).json({ message: 'Unit not found' })
        updateData.unitId = unit._id
      }

      const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
        .populate('categoryId', 'name')
        .populate('supplierId', 'name')
        .populate('brandId', 'name')
        .populate('unitId', 'name')
      if (!updatedProduct) return res.status(404).json({ message: 'Product not found' })
      console.log(updatedProduct)

      res.status(200).json({
        productId: updatedProduct.productId,
        name: updatedProduct.name,
        categoryName: updatedProduct.categoryId ? updatedProduct.categoryId.name : 'Unknown',
        supplierName: updatedProduct.supplierId ? updatedProduct.supplierId.name : 'Unknown',
        brandName: updatedProduct.brandId ? updatedProduct.brandId.name : 'Unknown',
        unitName: updatedProduct.unitId ? updatedProduct.unitId.name : 'Unknown',
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

      const products = await Product.find({ categoryId })
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

  // Lấy danh sách sản phẩm theo thương hiệu cụ thể
  getProductsByBrand: async (req, res) => {
    try {
      const { brand } = req.query
      if (!brand || brand.trim() === "") {
        return res.status(400).json({ message: "Missing or empty brand name" })
      }

      const brandDoc = await Brand.findOne({ name: brand.trim() })
      if (!brandDoc) {
        return res.status(404).json({ message: "Brand not found" })
      }

      const products = await Product.find({ brandId: brandDoc._id })
        .populate('categoryId', 'name')
        .populate('supplierId', 'name')
        .populate('brandId', 'name')
        .populate('unitId', 'name')

      if (products.length === 0) {
        return res.status(404).json({ message: "No products found for this brand" })
      }

      const formattedProducts = products.map(product => ({
        _id: product._id,
        productId: product.productId,
        name: product.name,
        categoryName: product.categoryId ? product.categoryId.name : 'Unknown',
        supplierName: product.supplierId ? product.supplierId.name : 'Unknown',
        brandName: product.brandId ? product.brandId.name : 'Unknown',
        unitName: product.unitId ? product.unitId.name : 'Unknown',
        image: product.image,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      }))

      res.status(200).json(formattedProducts)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  // Lọc sản phẩm theo đơn vị tính
  getProductsByUnit: async (req, res) => {
    try {
      const { unit } = req.query
      if (!unit || unit.trim() === "") {
        return res.status(400).json({ message: "Missing or empty unit name" })
      }

      const unitDoc = await Unit.findOne({ name: unit.trim() })
      if (!unitDoc) {
        return res.status(404).json({ message: "Unit not found" })
      }

      const products = await Product.find({ unitId: unitDoc._id })
        .populate('categoryId', 'name')
        .populate('supplierId', 'name')
        .populate('brandId', 'name')
        .populate('unitId', 'name')

      if (products.length === 0) {
        return res.status(404).json({ message: "No products found for this brand" })
      }

      const formattedProducts = products.map(product => ({
        _id: product._id,
        productId: product.productId,
        name: product.name,
        categoryName: product.categoryId ? product.categoryId.name : 'Unknown',
        supplierName: product.supplierId ? product.supplierId.name : 'Unknown',
        brandName: product.brandId ? product.brandId.name : 'Unknown',
        unitName: product.unitId ? product.unitId.name : 'Unknown',
        brand: product.brand,
        unit: product.unit,
        image: product.image,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      }))

      res.status(200).json(formattedProducts)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },
}

module.exports = productController
