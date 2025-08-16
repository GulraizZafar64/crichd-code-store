const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const crypto=require('crypto')


const codeSchema=new mongoose.Schema({
   code:{
       type:String,
   },
   createdAt:{
      type:Date,
      default:Date.now()
   },
})


module.exports=mongoose.model("Code",codeSchema)

