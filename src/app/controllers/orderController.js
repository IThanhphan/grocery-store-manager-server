const Order = require('../models/orderModel')

const orderController = {
  // Lấy danh sách tất cả hóa đơn
  getAllOrders: async (req, res) => {
    try {
      const Orders = await Order.find()
      res.status(200).json(Orders)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  // Lấy chi tiết một hóa đơn theo ID
  getOrderById: async (req, res) => {
    try {
      const { id } = req.query
      if (!id) return res.status(400).json({ message: 'Missing Order ID' })

      const order = await Order.findById(id)
      if (!order) return res.status(404).json({ message: 'Order not found' })

      res.status(200).json(order)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  // Thêm một hóa đơn mới
  createOrder: async (req, res) => {
    try {
      const { customerId, employeeId, paymentMethod, items } = req.body

      if (!customerId || !items || items.length === 0) {
        return res.status(400).json({ message: 'Missing required fields' })
      }
      console.log({ customerId, employeeId, paymentMethod, items })

      const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

      const newOrder = new Order({
        customerId,
        employeeId,
        totalAmount,
        paymentMethod,
        items,
      })

      await newOrder.save()

      res.status(201).json(newOrder)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  // Cập nhật đơn hàng
  updateOrder: async (req, res) => {
    try {
      const { id } = req.query
      if (!id) return res.status(400).json({ message: 'Missing Order ID' })

      const updatedOrder = await Order.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
      if (!updatedOrder) return res.status(404).json({ message: 'Order not found' })

      res.status(200).json(updatedOrder)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  // Xóa một đơn hàng
  deleteOrder: async (req, res) => {
    try {
      const { id } = req.query
      if (!id) return res.status(400).json({ message: 'Missing Order ID' })

      const deletedOrder = await Order.findByIdAndDelete(id)
      if (!deletedOrder) return res.status(404).json({ message: 'Order not found' })

      res.status(200).json({ message: 'Order deleted successfully' })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  //Lấy danh sách đơn hàng theo khách hàng
  getOrdersByCustomer: async (req, res) => {
    try {
      const { customerId } = req.query
      if (!customerId) return res.status(400).json({ message: 'Missing customerId' })

      const orders = await Order.find({ customerId })
      if (orders.length === 0) return res.status(404).json({ message: 'No orders found' });

      res.status(200).json(orders)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  // Lấy danh sách đơn hàng theo nhân viên
  getOrdersByEmployee: async (req, res) => {
    try {
      const { employeeId } = req.query
      if (!employeeId) return res.status(400).json({ message: 'Missing EmployeeId' })

      const orders = await Order.find({ employeeId })
      if (orders.length === 0) return res.status(404).json({ message: 'No orders found' });

      res.status(200).json(orders)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  // Lấy danh sách đơn hàng theo khoảng thời gian
  getOrdersByDateRange: async (req, res) => {
    try {
      const { startDate, endDate } = req.query
      if (!startDate || !endDate) {
        return res.status(400).json({ message: 'Missing startDate or endDate' })
      }

      const orders = await Order.find({
        orderDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
      })
      if (orders.length === 0) return res.status(404).json({ message: 'No orders found' });

      res.status(200).json(orders)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  //Lấy danh sách đơn hàng theo phương thức thanh toán
  getOrdersByPaymentMethod: async (req, res) => {
    try {
      const { paymentMethod } = req.query;
      if (!paymentMethod) return res.status(400).json({ message: 'Missing paymentMethod' })

      const orders = await Order.find({ paymentMethod })
      if (orders.length === 0) return res.status(404).json({ message: 'No orders found' });

      res.status(200).json(orders);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = orderController