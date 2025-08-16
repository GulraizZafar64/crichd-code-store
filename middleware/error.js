const ErrorHander=require('../utils/errorhander')

module.exports=(err,req,res,next)=>{
    err.statusCode =  err.statusCode||500;
    err.message=   err.message|| "internal server error"

//wronge mongodb error 
//ya basically hota haa agr hm koi chorti id dal den ak 2 number ki toh mongodb ko toh pata haa asa koi id nai hoti toh wo apna sa error dy deti haa toh hmma apna error through krvana haa waha per na k mongodb ka
//by the way we not use this this is only for knowlage in this project
if(err.name=="CastError"){
  const message=`resourse not found . Invalide: ${err.path}`
  err=new ErrorHander(message,400)
}

//agr user pahla sa he register haa agr ussi name sa register krna ki try krra toh ajeeb sa error deta haa ussa proper dikhana k liya
if(err.code===11000){
    const message=`dublicate ${Object.keys(err.keyValue)}`
    err=new ErrorHander(message,400)
}

//kissi na galat jwt dal diya hoto
if(err.code==="JsonWebTokenError"){
    const message="jsonWeb token is invalied,try again"
    err=new ErrorHander(message,400)
}

//Jwt expire
if(err.code==="TokenExpireedError"){
    const message="jsonWeb token is expire,try again"
    err=new ErrorHander(message,400)
}

    res.status(err.statusCode).json({
        success:false,
        message:err.message,
    })
}