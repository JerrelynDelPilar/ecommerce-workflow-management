const express = require('express');
const userController = require('../controllers/userController');
const { verify, verifyAdmin } = require("../auth");


const router = express.Router();

router.post("/register", userController.registerUser);

router.post("/login", userController.loginUser);

//[SECTION] Route for retrieving user details
router.get("/details", verify, userController.getUserDetails);

router.patch("/:userId/set-as-admin", verify, verifyAdmin, userController.setAsAdmin);

router.patch("/update-password", verify, userController.updatePassword);


module.exports = router;
