const express = require('express')
const router = express.Router()
const attendanceSalaryController = require('../app/controllers/attendanceSalaryController')

router.post('/check-in', attendanceSalaryController.checkIn)
router.post('/check-out', attendanceSalaryController.checkOut)
router.get('/all', attendanceSalaryController.getAllAttendanceRecords)
router.get('/:id', attendanceSalaryController.getAttendanceById)
router.get('/user', attendanceSalaryController.getAttendanceByUser)
router.put('/update-status', attendanceSalaryController.updateStatus)
router.delete('/delete', attendanceSalaryController.deleteAttendanceRecord)

module.exports = router