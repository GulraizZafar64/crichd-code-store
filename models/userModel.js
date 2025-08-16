const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const crypto=require('crypto')


const userSchema=new mongoose.Schema({
   email:{
       type:String,
       required:[true,"please enter your email"],
       unique:true,
       validate:[validator.isEmail,"Please enter a valied email"]
   },
   password:{
       type:String,
       required:[true,"please enter your password"],
       minlength:[8,"the passsword must b 8 characters"],
       select:false
   },
   likes:[
    {
        poster_path:String
    }
   ],
   dislikes:[
    {
        poster_path:String
    }
   ],
   listing:[
    {
        poster_path:String
    }
   ],
   createdAt:{
      type:Date,
      default:Date.now()
   },
})
userSchema.pre("save",async function(next){
    //ya neacha wali condition iss liya haa k agr password pahla sa he hashed haa toh dubara na karra ussa hashed
    if(!this.isModified("password")){
        next()
    }
    //hashing the password
    this.password=await bcrypt.hash(this.password,10)
})

// jwt token
userSchema.methods.getJWTToken=function(){
 return jwt.sign({id:this._id},process.env.JWT_SECRET,{
     expiresIn:process.env.JWT_EXPIRE,
 })
}
//compare password
userSchema.methods.comparePassword=async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword,this.password)
}


module.exports=mongoose.model("User",userSchema)

