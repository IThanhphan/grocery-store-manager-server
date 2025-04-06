const Customer = require('../models/customerModel')
const Order = require('../models/orderModel')

const CustomerController = {
  // Lấy danh sách tất cả khách hàng
  getListOfAllCustomers: async (req, res) => {
    try {
      const Customers = await Customer.find()
      res.status(200).json(Customers)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  // Lấy chi tiết một khách hàng theo ID
  getDetailsOfCustomer: async (req, res) => {
    try {
      const { id } = req.query
      if (!id) return res.status(400).json({ message: 'Missing Customer ID' })

      const customer = await Customer.findById(id)
      if (!customer) return res.status(404).json({ message: 'Customer not found' })

      res.status(200).json(customer)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  // Thêm một khách hàng mới
  addNewCustomer: async (req, res) => {
    try {
      const {
        name,
        gender,
        customerType,
        identityNumber,
        company,
        address,
        phone,
        email,
        note
      } = req.body

      if (!name || gender === undefined || customerType === undefined || !identityNumber || !address || !phone || !email)
        return res.status(400).json({ message: 'Missing required fields' })
      console.log({
        name,
        gender,
        customerType,
        identityNumber,
        company,
        address,
        phone,
        email,
        note
      })
      const newCustomer = new Customer({
        name,
        gender,
        customerType,
        identityNumber,
        company,
        address,
        phone,
        email,
        note
      })

      await newCustomer.save()
      res.status(201).json(newCustomer)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  // Cập nhật thông tin khách hàng
  updateCustomerInformation: async (req, res) => {
    try {
      const { id } = req.query
      if (!id) return res.status(400).json({ message: 'Missing Customer ID' })

      const updatedCustomer = await Customer.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
      if (!updatedCustomer) return res.status(404).json({ message: 'Customer not found' })

      res.status(200).json(updatedCustomer)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  // Xóa một khách hàng
  deleteCustomer: async (req, res) => {
    try {
      const { id } = req.query
      if (!id) return res.status(400).json({ message: 'Missing Customer ID' })

      const deletedCustomer = await Customer.findByIdAndDelete(id)
      if (!deletedCustomer) return res.status(404).json({ message: 'Customer not found' })

      res.status(200).json({ message: 'Customer deleted successfully' })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  // Tính tổng bán của một khách hàng theo customerId
  getTotalSalesByCustomer: async (req, res) => {
    try {
      const { id } = req.query
      if (!id) return res.status(400).json({ message: 'Missing Customer ID' })

      const customer = await Customer.findById(id)
      if (!customer) return res.status(404).json({ message: 'Customer not found' })

      const result = await Order.aggregate([
        { $match: { customerId: customer._id } },
        {
          $group: {
            _id: '$id',
            totalSales: { $sum: '$totalAmount' }
          }
        }
      ])

      const totalSales = result.length > 0 ? result[0].totalSales : 0

      res.status(200).json({
        customerId: customer._id,
        customerName: customer.name,
        totalSales
      })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }
}

module.exports = CustomerController