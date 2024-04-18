let jwt = require('jsonwebtoken')
require('dotenv').config();



let verifyToken=(req,res,next)=>{
    try{
       var token = req.headers.authorization;
       if(!token){
        return res.status(400).json({message:"Unauthorized user.",type:"error"})
       }
       token = token.split(' ')[1];
       let user = jwt.verify(token,process.env.SECRET_KEY)
       req.result=user
       next();
       
    }catch(error){
        console.log('ERROR::',error)
        return res.status(500).json({message:"Internal Server error in middleware",type:'error',error:error.message})
    }
}

module.exports = verifyToken