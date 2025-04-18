const Order = require('../models/orderModel')
const Product = require('../models/productModel')
const Customer = require('../models/customerModel')
const User = require('../models/userModel')
const handleFifo = require('../middlewares/handleFifo')

const orderController = {
  // Lấy danh sách tất cả hóa đơn
  getAllOrders: async (req, res) => {
    try {
      const Orders = await Order.find()
        .populate('customerId', 'name')
        .populate('userId', 'name')
        .populate('items.productId', 'name')

      const formattedOrders = Orders.map(order => ({
        _id: order._id,
        orderId: order.orderId,
        customerName: order.customerId ? order.customerId.name : 'Unknown',
        userName: order.userId ? order.userId.name : 'Unknown',
        orderDate: order.orderDate,
        totalAmount: order.totalAmount,
        otherPaidAmount: order.otherPaidAmount,
        paymentMethod: order.paymentMethod,
        items: order.items.map(item => ({
          productId: item.productId ? item.productId._id : 'Unknown',
          name: item.productId ? item.productId.name : 'Unknown',
          quantity: item.quantity,
          sellPrice: item.sellPrice,
        }))
      }))
      res.status(200).json(formattedOrders)
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
        .populate('customerId', 'name')
        .populate('userId', 'name')
        .populate('items.productId', 'name')

      if (!order) return res.status(404).json({ message: 'Order not found' })

      res.status(200).json({
        orderId: order.orderId,
        customerName: order.customerId ? order.customerId.name : 'Unknown',
        userName: order.userId ? order.userId.name : 'Unknown',
        orderDate: order.orderDate,
        totalAmount: order.totalAmount,
        otherPaidAmount: order.otherPaidAmount,
        paymentMethod: order.paymentMethod,
        items: order.items.map(item => ({
          productId: item.productId ? item.productId._id : 'Unknown',
          name: item.productId ? item.productId.name : 'Unknown',
          quantity: item.quantity,
          sellPrice: item.sellPrice,
        }))
      })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  // Thêm một hóa đơn mới
  createOrder: async (req, res) => {
    try {
      const { customerName, userName, paymentMethod, items, otherPaidAmount = 0 } = req.body

      if (!customerName || !userName || items.length === 0) {
        return res.status(400).json({ message: 'Missing required fields' })
      }

      const customer = await Customer.findOne({ name: customerName });
      if (!customer) return res.status(404).json({ message: 'Customer not found' });
      const customerId = customer._id;

      const user = await User.findOne({ name: userName });
      if (!user) return res.status(404).json({ message: 'User not found' });
      const userId = user._id;

      const orderItems = []
      let totalAmount = 0

      for (const item of items) {
        const product = await Product.findOne({ name: item.productName });
        if (!product) throw new Error(`Product not found: ${item.productName}`);

        const usedBatches = await handleFifo(product._id, item.quantity);

        let remainingQty = item.quantity;
        for (const batch of usedBatches) {
          const useQty = Math.min(batch.usedQuantity, remainingQty);
          const itemTotal = batch.sellPrice * useQty;

          orderItems.push({
            productId: product._id,
            quantity: useQty,
            sellPrice: batch.sellPrice,
            totalPrice: itemTotal
          });

          totalAmount += useQty * batch.sellPrice;
          remainingQty -= useQty;
        }
      }

      console.log({ customerName, userName, paymentMethod, items: orderItems })

      const newOrder = new Order({
        customerId,
        userId,
        totalAmount,
        paymentMethod,
        items: orderItems,
      });

      await newOrder.save()

      res.status(201).json(newOrder)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  // Cập nhật đơn hàng
  updateOrder: async (req, res) => {
    try {
      const { id } = req.query;
      if (!id) return res.status(400).json({ message: 'Missing Order ID' });

      const oldOrder = await Order.findById(id);
      if (!oldOrder) return res.status(404).json({ message: 'Order not found' });

      for (const item of oldOrder.items) {
        const batches = await ProductBatch.find({
          productId: item.productId,
          sellPrice: item.sellPrice
        });

        let remaining = item.quantity;
        for (const batch of batches) {
          if (remaining <= 0) break;
          const canReturn = Math.min(item.quantity, remaining);
          batch.quantity += canReturn;
          remaining -= canReturn;
          await batch.save();
        }
      }

      let updateData = {};

      // Nếu có customerName, tìm customerId
      if (req.body.customerName) {
        const customer = await Customer.findOne({ name: req.body.customerName });
        if (!customer) return res.status(404).json({ message: 'Customer not found' });
        updateData.customerId = customer._id;
      }

      // Nếu có userName, tìm userId
      if (req.body.userName) {
        const user = await User.findOne({ name: req.body.userName });
        if (!user) return res.status(404).json({ message: 'User not found' });
        updateData.userId = user._id;
      }

      const items = [];
      let totalAmount = 0;

      for (const item of req.body.items) {
        const product = await Product.findOne({ name: item.productName });
        if (!product) throw new Error(`Product not found: ${item.productName}`);

        const usedBatches = await handleFifo(product._id, item.quantity);
        let remainingQty = item.quantity;

        for (const batch of usedBatches) {
          const useQty = Math.min(batch.usedQuantity, remainingQty);
          const totalPrice = batch.sellPrice * useQty;

          items.push({
            productId: product._id,
            quantity: useQty,
            sellPrice: batch.sellPrice,
            totalPrice
          });

          totalAmount += totalPrice;
          remainingQty -= useQty;
        }
      }

      updateData.items = items;
      updateData.totalAmount = totalAmount;
      if (req.body.paymentMethod) updateData.paymentMethod = req.body.paymentMethod;
      if (req.body.otherPaidAmount !== undefined) updateData.otherPaidAmount = req.body.otherPaidAmount;

      const updatedOrder = await Order.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

      res.status(200).json(updatedOrder);
    } catch (error) {
      res.status(400).json({ error: error.message });
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
  getOrdersByUser: async (req, res) => {
    try {
      const { userId } = req.query
      if (!userId) return res.status(400).json({ message: 'Missing userId' })

      const orders = await Order.find({ userId })
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
  },

  // Tính doanh thu theo tháng
  getMonthlyRevenue: async (req, res) => {
    try {
      const { year, month } = req.query;
      if (!year || !month) {
        return res.status(400).json({ message: 'Missing year or month' });
      }

      const startDate = new Date(`${year}-${month}-01T00:00:00.000Z`);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);

      const orders = await Order.find({
        orderDate: { $gte: startDate, $lt: endDate },
      });

      const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

      res.status(200).json({ month, year, totalRevenue });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  //Tính doanh thu của từng tháng trong năm
  getYearlyRevenueByMonth: async (req, res) => {
    try {
      const { year } = req.query;
      if (!year) {
        return res.status(400).json({ message: 'Missing year' });
      }

      let monthlyRevenue = Array(12).fill(0); // Mảng lưu doanh thu từng tháng

      for (let month = 1; month <= 12; month++) {
        const startDate = new Date(`${year}-${month}-01T00:00:00.000Z`);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);

        const orders = await Order.find({
          orderDate: { $gte: startDate, $lt: endDate },
        });

        monthlyRevenue[month - 1] = orders.reduce((sum, order) => sum + order.totalAmount, 0);
      }

      res.status(200).json({ year, monthlyRevenue });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  //10 sản phẩm bán chạy nhất trong tháng
  getTopSellingProductsMonthly: async (req, res) => {
    try {
      const { year, month } = req.query;
      if (!year || !month) {
        return res.status(400).json({ message: 'Missing year or month' });
      }

      const startDate = new Date(`${year}-${month}-01T00:00:00.000Z`);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);

      const orders = await Order.find({
        orderDate: { $gte: startDate, $lt: endDate },
      });

      let productSales = {};

      orders.forEach(order => {
        order.items.forEach(item => {
          if (!productSales[item.productId]) {
            productSales[item.productId] = { productId: item.productId, name: item.name, quantity: 0 };
          }
          productSales[item.productId].quantity += item.quantity;
        });
      });

      const topProducts = Object.values(productSales)
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 10);

      res.status(200).json(topProducts);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  //10 sản phẩm bán chạy nhất trong năm
  getTopSellingProductsYearly: async (req, res) => {
    try {
      const { year } = req.query;
      if (!year) {
        return res.status(400).json({ message: 'Missing year' });
      }

      const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
      const endDate = new Date(`${year}-12-31T23:59:59.999Z`);

      const orders = await Order.find({
        orderDate: { $gte: startDate, $lte: endDate },
      });

      let productSales = {};

      orders.forEach(order => {
        order.items.forEach(item => {
          if (!productSales[item.productId]) {
            productSales[item.productId] = { productId: item.productId, name: item.name, quantity: 0 };
          }
          productSales[item.productId].quantity += item.quantity;
        });
      });

      const topProducts = Object.values(productSales)
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 10);

      res.status(200).json(topProducts);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = orderController