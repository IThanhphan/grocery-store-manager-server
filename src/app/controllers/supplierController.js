const Supplier = require('../models/supplierModel')
// const StockInt = require('../models/stockIntModel')

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
      const { name, address, phone, email, company, note } = req.body

      if (!name || !address || !phone || !email) return res.status(400).json({ message: 'Missing required fields' })
      console.log({ name, address, phone, email, company, note })
      const newSupplier = new Supplier({ name, address, phone, email, company, note })
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
  },

  // Tính tổng bán của nhà cung cấp (tổng giá trị nhập hàng từ nhà cung cấp đó)
  getTotalImportBySupplier: async (req, res) => {
    try {
      const { id } = req.query
      if (!id) return res.status(400).json({ message: 'Missing supplier ID' })

      // Tính tổng `totalAmount` của tất cả các StockInt có supplierId này
      const result = await StockInt.aggregate([
        {
          $match: {
            supplierId: new mongoose.Types.ObjectId(id)
          }
        },
        {
          $group: {
            _id: '$supplierId',
            totalImportAmount: { $sum: '$totalAmount' }
          }
        }
      ])

      const total = result.length > 0 ? result[0].totalImportAmount : 0

      res.status(200).json({ supplierId: id, totalImportAmount: total })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }
}

module.exports = supplierController