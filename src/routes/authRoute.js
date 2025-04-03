const express = require('express')
const router = express.Router()
const authController = require('../app/controllers/authController')
const authMiddleware = require('../app/middlewares/authMiddleware')

router.post('/add-a-new-user', authController.addNewUser)
router.post('/login', authController.loginUser)
router.post('/getNewAccessToken', authController.requestRefreshToken)
router.post('/logout', authMiddleware.verifyToken, authController.logoutUser)
router.get('/get-a-list-of-all-users', authController.getListOfAllUsers)
router.get('/get-details-of-a-user', authController.getDetailsOfUser)
router.put('/update-user-information', authController.updateUserInformation)
router.delete('/delete-a-user', authController.deleteUser)

module.exports = router