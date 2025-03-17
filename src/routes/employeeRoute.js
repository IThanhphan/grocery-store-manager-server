const express = require('express')
const router = express.Router()
const employeeController = require('../app/controllers/employeeController')

router.get('/get-a-list-of-all-employees', employeeController.getListOfAllEmployees)
router.get('/get-details-of-a-employee', employeeController.getDetailsOfEmployee)
router.post('/add-a-new-employee', employeeController.addNewEmployee)
router.put('/update-employee-information', employeeController.updateEmployeeInformation)
router.delete('/delete-a-employee', employeeController.deleteEmployee)

module.exports = router