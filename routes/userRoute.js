const express=require('express');
const { registerUser, loginUser, logout, forgotPassword, getUserDetails, resetPassword, updatePassword, updateProfile, likeDislikeThePost, dislikeThePost, addListing, storeCode } = require('../controllers/userController');
const {isAuthenticatedUser,authorizeRoles}=require('../middleware/auth')
const router =express.Router();
router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").get(logout)
router.route("/me").get(isAuthenticatedUser,getUserDetails)
router.route("/likeDislike").post(isAuthenticatedUser,likeDislikeThePost)
router.route("/dislikeThePost").post(isAuthenticatedUser,dislikeThePost)
router.route("/addListing").post(isAuthenticatedUser,addListing)
router.post("/store-code", storeCode);

module.exports=router