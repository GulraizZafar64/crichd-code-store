const app=require("./app")
const dotenv=require("dotenv")
const connectDatabase=require("./config/db")

const cloudinary=require('cloudinary')


// unhandled error 
////ya basically use hota haa agr mongodb ka galat route dy do ya phr kuch or issa kahta haa unhandled error or jb ya aya toh hamma server close krna hota tha neacha wala code server close krna k liya haa...
process.on("unhandledRejection",err=>{
    console.log(`Error ${err.message}`);
    console.log("shutting down the server due to the unhandled promise Rejection");

    server.close(()=>{
        process.exit(1)
    })
})

// handling uncaught exception
//ya basically hota haa agr koi galat console.log kr den toh server ko shutdown krna haa
process.on("uncaughtException",(err)=>{
    console.log(`Error ${err.message}`);
    console.log("shutting down the server due to uncaught exception");
    process.exit(1)
})
///config
dotenv.config({path:"backend/config/config.env"})

//conecting database
connectDatabase()
app.get('/', (req, res) => {

    const users = [
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' }
    ];
  
    res.json(users);
  });
const server =  app.listen(process.env.PORT,()=>{
    console.log(`server is working on http://localhost:${process.env.PORT}`);
})














