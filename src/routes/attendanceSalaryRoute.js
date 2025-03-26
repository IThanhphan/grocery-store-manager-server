const express = require('express')
const router = express.Router()
const attendanceSalaryController = require('../app/controllers/attendanceSalaryController')

router.post('/check-in', attendanceSalaryController.checkIn)
router.post('/check-out', attendanceSalaryController.checkOut)
router.get('/all', attendanceSalaryController.getAllAttendanceRecords)
router.get('/:id', attendanceSalaryController.getAttendanceById)
router.get('/employee', attendanceSalaryController.getAttendanceByEmployee)
router.put('/update-status', attendanceSalaryController.updateStatus)
router.put('/update-hourly-rate', attendanceSalaryController.updateHourlyRate)
router.put('/update-hourly-rate-all', attendanceSalaryController.updateHourlyRateForAllEmployees)
router.delete('/delete', attendanceSalaryController.deleteAttendanceRecord)

module.exports = router