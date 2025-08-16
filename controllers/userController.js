const ErrorHander = require("../utils/errorhander")
const catchAsyncError=require('../middleware/catchAsyncError')
const User=require('../models/userModel');
const Code=require('../models/code');
const sendToken = require("../utils/jwtToken");

//register a user/////////////////////////////////////////////////////////////////////
exports.registerUser=catchAsyncError(async(req,res,next)=>{
  const {email,password}=req.body;

const checkEmail = await User.findOne({ email });
if (checkEmail){
    return next(new ErrorHander("Email Already Taken", 422));
}
    const user=await User.create({
        email,password,

    })
    sendToken(user,200,res)
  
})






//login a user////////////////////////////////////////////////////////////////////
exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  // checking if user has given password and email both

  if (!email || !password) {
    return next(new ErrorHander("Please Enter Email & Password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHander("Invalid email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHander("Invalid email or password", 401));
  }

  sendToken(user, 200, res);
});



//logout //////////////////////////////////////////////////////////////////////////
exports.logout=catchAsyncError(async (req,res,next)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true
    })
res.status(200).json({
    success:true,
    message:"logout successfully"
})
})


  //get user details
  exports.getUserDetails=catchAsyncError(async (req,res,next)=>{
    const  user =await User.findById(req.user.id)

   res.status(200).json({
     success:true,
     user,
   })
  })

  exports.likeDislikeThePost=catchAsyncError(async (req,res,next)=>{
    const  user =await User.findById(req.user.id)
    const {poster_path}=req.body
    let likesTitel=[]
    user.likes.map((item)=>{
      likesTitel.push(item.poster_path)
    })
  


    if (likesTitel.includes(poster_path)) {
      const indexToRemove = user.likes.findIndex(item => item.poster_path == poster_path);
      user.likes.splice(indexToRemove, 1);
      await  user.save();
        res.status(200).json({
          success:true,
          message:"Unliked Successfully",
        })
    }else{
      user.likes.push({
        poster_path
      })
     await user.save();
      res.status(200).json({
        success:true,
        message:"liked Successfully",
      })
    }


  })
 exports.dislikeThePost=catchAsyncError(async (req,res,next)=>{
    const  user =await User.findById(req.user.id)
    const {poster_path}=req.body
    let likesTitel=[]
    user.dislikes.map((item)=>{
      likesTitel.push(item.poster_path)
    })
  


    if (likesTitel.includes(poster_path)) {
      const indexToRemove = user.dislikes.findIndex(item => item.poster_path == poster_path);
      user.dislikes.splice(indexToRemove, 1);
      await  user.save();
        res.status(200).json({
          success:true,
          message:"UnDislike Successfully",
        })
    }else{
      user.dislikes.push({
        poster_path
      })
     await user.save();
      res.status(200).json({
        success:true,
        message:"Dislike Successfully",
      })
    }


  })


  exports.addListing=catchAsyncError(async (req,res,next)=>{
    const  user =await User.findById(req.user.id)
    const {poster_path}=req.body
    let linstingTitel=[]
    user.listing.map((item)=>{
      linstingTitel.push(item.poster_path)
    })
  


    if (linstingTitel.includes(poster_path)) {
      const indexToRemove = user.listing.findIndex(item => item.poster_path == poster_path);
        res.status(200).json({
          success:true,
          message:"Already Added To Your List",
        })
    }else{
      user.listing.push({
        poster_path
      })
     await user.save();
      res.status(200).json({
        success:true,
        message:"Added Successfully",
      })
    }


  })

  exports.storeCode = catchAsyncError(async (req, res, next) => {
    const { codeString } = req.body;

    // Validate that codeString is provided
    if (!codeString) {
      return next(new ErrorHander("Code string is required", 400));
    }

    // Validate that codeString is actually a string
    if (typeof codeString !== 'string') {
      return next(new ErrorHander("Code must be a string", 400));
    }

    // Create a simple code storage schema inline (you can move this to a separate model file)
    const mongoose = require('mongoose');
    
    const codeSchema = new mongoose.Schema({
      codeString: {
        type: String,
        required: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      },
    });

    // Create or get the model
    const CodeStorage = mongoose.models.CodeStorage || mongoose.model('CodeStorage', codeSchema);

    // Store the code in database
    const storedCode = await CodeStorage.create({
      codeString: codeString,
    });

    res.status(201).json({
      success: true,
      message: "Code stored successfully in database",
      data: {
        id: storedCode._id,
        codeString: storedCode.codeString,
        createdAt: storedCode.createdAt
      }
    });
  });

