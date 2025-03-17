const Employee = require('../models/employeeModel')

const EmployeeController = {
  // Lấy danh sách tất cả nhân viên
  getListOfAllEmployees: async (req, res) => {
    try {
      const Employees = await Employee.find()
      res.status(200).json(Employees)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  // Lấy chi tiết một nhân viên theo ID
  getDetailsOfEmployee: async (req, res) => {
    try {
      const { id } = req.query
      if (!id) return res.status(400).json({ message: 'Missing Employee ID' })

      const employee = await Employee.findById(id)
      if (!employee) return res.status(404).json({ message: 'Employee not found' })

      res.status(200).json(employee)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  // Thêm một nhân viên mới
  addNewEmployee: async (req, res) => {
    try {
      const { name, address, phone, email } = req.body

      if (!name || !address || !phone || !email) return res.status(400).json({ message: 'Missing required fields' })
      console.log({ name, address, phone, email })
      const newEmployee = new Employee({ name, address, phone, email })
      await newEmployee.save()

      res.status(201).json(newEmployee)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  // Cập nhật thông tin nhân viên
  updateEmployeeInformation: async (req, res) => {
    try {
      const { id } = req.query
      if (!id) return res.status(400).json({ message: 'Missing Employee ID' })

      const updatedEmployee = await Employee.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
      if (!updatedEmployee) return res.status(404).json({ message: 'Employee not found' })

      res.status(200).json(updatedEmployee)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  // Xóa một nhân viên
  deleteEmployee: async (req, res) => {
    try {
      const { id } = req.query
      if (!id) return res.status(400).json({ message: 'Missing Employee ID' })

      const deletedEmployee = await Employee.findByIdAndDelete(id)
      if (!deletedEmployee) return res.status(404).json({ message: 'Employee not found' })

      res.status(200).json({ message: 'Employee deleted successfully' })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
}

module.exports = EmployeeController