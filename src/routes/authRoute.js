const express = require("express");
const router = express.Router();
const authController = require("../app/controllers/authController");
const authMiddleware = require("../app/middlewares/authMiddleware");

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.post("/getNewAccessToken", authController.requestRefreshToken);
router.post("/logout", authMiddleware.verifyToken, authController.logoutUser);

module.exports = router;