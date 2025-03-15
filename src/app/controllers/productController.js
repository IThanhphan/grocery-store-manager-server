const Product = require('../models/productModel')

const productController = {
  // Lấy danh sách tất cả sản phẩm
  getAllProducts: async (req, res) => {
    try {
      const products = await Product.find();
      res.status(200).json(products);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Lấy thông tin chi tiết sản phẩm theo ID
  getProductById: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).json({ message: "Product not found" });
      res.status(200).json(product);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Thêm một sản phẩm mới
  addProduct: async (req, res) => {
    try {
      const { name, category, supplierId, importPrice, sellPrice, stock, expirationDate } = req.body;
      if (!name || !category || !supplierId || !importPrice || !sellPrice || !expirationDate) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const newProduct = new Product({ name, category, supplierId, importPrice, sellPrice, stock, expirationDate });
      await newProduct.save();

      res.status(201).json({ message: "Product added successfully", data: newProduct });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Cập nhật sản phẩm theo ID
  updateProduct: async (req, res) => {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!updatedProduct) return res.status(404).json({ message: "Product not found" });

      res.status(200).json({ message: "Product updated successfully", data: updatedProduct });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Xóa sản phẩm theo ID
  deleteProduct: async (req, res) => {
    try {
      const deletedProduct = await Product.findByIdAndDelete(req.params.id);
      if (!deletedProduct) return res.status(404).json({ message: "Product not found" });

      res.status(200).json({ message: "Product deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Lấy danh sách sản phẩm theo danh mục
  getProductsByCategory: async (req, res) => {
    try {
      const products = await Product.find({ category: req.params.categoryId }).populate("category supplierId");
      res.status(200).json(products);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Lấy danh sách sản phẩm của một nhà cung cấp
  getProductsBySupplier: async (req, res) => {
    try {
      const products = await Product.find({ supplierId: req.params.supplierId }).populate("category supplierId");
      res.status(200).json(products);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Lấy danh sách sản phẩm hết hạn
  getExpiredProducts: async (req, res) => {
    try {
      const today = new Date();
      const expiredProducts = await Product.find({ expirationDate: { $lt: today } }).populate("category supplierId");
      res.status(200).json(expiredProducts);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = productController