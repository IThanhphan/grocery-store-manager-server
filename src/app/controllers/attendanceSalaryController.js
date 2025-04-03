const AttendanceSalary = require('../models/attendanceSalaryModel')

const attendanceSalaryController = {
  // Chấm công
  checkIn: async (req, res) => {
    try {
      const { employeeId, hourlyRate } = req.body
      const checkInTime = new Date()

      const existingAttendance = await AttendanceSalary.findOne({
        employeeId,
        date: { $gte: new Date().setHours(0, 0, 0, 0), $lt: new Date().setHours(23, 59, 59, 999) }
      })

      if (existingAttendance) return res.status(400).json({ message: 'Employee has already checked in today' })

      // Tạo bản ghi chấm công
      const newAttendance = new AttendanceSalary({
        employeeId,
        date: checkInTime,
        checkIn: checkInTime,
        status: 'Present',
        hourlyRate,
        bonus: 0,
        deductions: 0
      })

      await newAttendance.save()
      res.status(201).json({ message: 'Check-in successfully' })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  // CheckOut & Tính lương
  checkOut: async (req, res) => {
    try {
      const { id } = req.query
      const checkOutTime = new Date()
      const attendance = await AttendanceSalary.findById(id)
      if (!attendance) return res.status(400).json({ message: 'Missing attendance ID' })

      if (attendance.checkOut) return res.status(400).json({ message: 'Checked out before' })

      if (checkOutTime <= attendance.checkIn) {
        return res.status(400).json({ message: 'Check-out time must be after check-in time' });
      }

      const workingHours = Math.abs(checkOutTime - attendance.checkIn) / 36e5;
      const totalSalary = workingHours * attendance.hourlyRate;
      const finalSalary = totalSalary + attendance.bonus - attendance.deductions;

      attendance.checkOut = checkOutTime;
      attendance.workingHours = workingHours;
      attendance.totalSalary = totalSalary;
      attendance.finalSalary = finalSalary;

      await attendance.save()

      res.status(200).json({ message: 'Checked out successfully' })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  // Lấy danh sách chấm công
  getAllAttendanceRecords: async (req, res) => {
    try {
      const attendanceRecords = await AttendanceSalary.find().populate('employeeId')
      res.status(200).json(attendanceRecords)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  // Lấy chấm công theo ID
  getAttendanceById: async (req, res) => {
    try {
      const { id } = req.query;
      const attendance = await AttendanceSalary.findById(id).populate('employeeId')
      if (!attendance) return res.status(404).json({ message: 'No attendance records found' })

      res.status(200).json(attendance);
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  // Lấy danh sách chấm công theo nhân viên
  getAttendanceByEmployee: async (req, res) => {
    try {
      const { employeeId } = req.query
      if (!employeeId) return res.status(400).json({ message: 'Missing employeeId' })

      const attendanceRecords = await AttendanceSalary.find({ employeeId })
      if (!attendanceRecords) return res.status(404).json({ message: 'Order not found' })

      res.status(200).json(attendanceRecords)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  //Cập nhật trạng thái chấm công
  updateStatus: async (req, res) => {
    try {
      const { id } = req.query
      const { status } = req.body
      if (!id) return res.status(400).json({ message: 'Missing id' })

      const attendance = await AttendanceSalary.findById(id)
      if (!attendance) return res.status(404).json({ message: 'No attendance found' });

      attendance.status = status
      await attendance.save()
      res.status(200).json({ message: 'Cập nhật trạng thái thành công', attendance })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  // Cập nhật lương theo giờ (cho một bản ghi)
  updateHourlyRate: async (req, res) => {
    try {
      const { id } = req.query
      const { hourlyRate } = req.body
      if (!id) return res.status(400).json({ message: 'Missing id' })
      if (hourlyRate <= 0) return res.status(400).json({ message: 'Hourly Rate must be greater than 0' })

      const attendance = await AttendanceSalary.findById(id)
      if (!attendance) return res.status(404).json({ message: 'No attendance found' });

      attendance.hourlyRate = hourlyRate
      await attendance.save()
      res.status(200).json(attendance)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  // Cập nhật lương theo giờ (hàng loạt theo nhân viên)
  updateHourlyRateForAllEmployees: async (req, res) => {
    try {
      const { hourlyRate, fromDate } = req.body;
      if (!hourlyRate || hourlyRate <= 0) {
        return res.status(400).json({ message: 'Hourly Rate must be greater than 0' });
      }

      const filter = fromDate ? { date: { $gte: new Date(fromDate) } } : {};
      const updatedRecords = await AttendanceSalary.updateMany(filter, { $set: { hourlyRate } });

      res.status(200).json({ message: 'Updated hourly rate for all employees', updatedRecords });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Xóa bản ghi chấm công
  deleteAttendanceRecord: async (req, res) => {
    try {
      const { id } = req.query;
      if (!id) return res.status(400).json({ message: 'Missing attendance' })

      const deletedAttendance = await AttendanceSalary.findByIdAndDelete(id)
      if (!deletedAttendance) return res.status(404).json({ message: 'No attendance found' })

      res.status(200).json({ message: 'deleted attendance successfully' })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }
}

module.exports = attendanceSalaryController