const Supplier = require('../models/supplierModel')

const supplierController = {
  // Lấy danh sách tất cả nhà cung cấp
  getListOfAllSuppliers: async (req, res) => {
    try {
      const suppliers = await Supplier.find()
      res.status(200).json(suppliers)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  // Lấy chi tiết một nhà cung cấp theo ID
  getDetailsOfSupplier: async (req, res) => {
    try {
      const { id } = req.query
      if (!id) return res.status(400).json({ message: 'Missing supplier ID' })

      const supplier = await Supplier.findById(id)
      if (!supplier) return res.status(404).json({ message: 'Supplier not found' })

      res.status(200).json(supplier)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  // Thêm một nhà cung cấp mới
  addNewSupplier: async (req, res) => {
    try {
      const { name, address, phone, email } = req.body

      if (!name || !address || !phone || !email) return res.status(400).json({ message: 'Missing required fields' })
      console.log({ name, address, phone, email })
      const newSupplier = new Supplier({ name, address, phone, email })
      await newSupplier.save()

      res.status(201).json(newSupplier)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  // Cập nhật thông tin nhà cung cấp
  updateSupplierInformation: async (req, res) => {
    try {
      const { id } = req.query
      if (!id) return res.status(400).json({ message: 'Missing supplier ID' })

      const updatedSupplier = await Supplier.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
      if (!updatedSupplier) return res.status(404).json({ message: 'Supplier not found' })

      res.status(200).json(updatedSupplier)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  // Xóa một nhà cung cấp
  deleteSupplier: async (req, res) => {
    try {
      const { id } = req.query
      if (!id) return res.status(400).json({ message: 'Missing supplier ID' })

      const deletedSupplier = await Supplier.findByIdAndDelete(id)
      if (!deletedSupplier) return res.status(404).json({ message: 'Supplier not found' })

      res.status(200).json({ message: 'Supplier deleted successfully' })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
}

module.exports = supplierController