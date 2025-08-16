const ErrorHander = require("../utils/errorhander");
const catchAsyncError = require("./catchAsyncError");
const jwt=require('jsonwebtoken')
const User=require('../models/userModel')

exports.isAuthenticatedUser=catchAsyncError(async (req,res,next)=>{
const token = req.headers.authorization;
console.log(token)
if(!token){
    return next(new ErrorHander("please login to acess this route",401))
}
const decodedData=jwt.verify(token,process.env.JWT_SECRET)
///decodeddata k sth jo id haaa wo hmna token create krta huva id jo pass ki thi wo haa or id 
// userModel.js ma wo id haa
   req.user=await User.findById(decodedData.id)
   next()
})
/// this is for admin route
exports.authorizeRoles=(...roles)=>{
return(req,res,next)=>{
   if(!roles.includes(req.user.role)){
    return next(  new ErrorHander(`role:${req.user.role} is not allowed to access this source`,403))
    }
    next()
}
}