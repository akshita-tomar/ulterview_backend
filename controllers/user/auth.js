
const userModel = require('../../model/user');
let bcrypt = require('bcrypt')
let jwt = require('jsonwebtoken')
require('dotenv').config()

exports.test = async(req,res)=>{
  res.send("working....")
}

exports.signUp = async(req,res)=>{
try{
   let userName = req.body.userName;
   let email = req.body.email;
   let password = req.body.password;
   var role = req.body.role
   let emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
   if(!userName){
    return res.status(400).json({message:"Please enter user name.",type:'error'})
   }
   if(!email){
    return res.status(400).json({message:"Please enter your email.",type:'error'})
   }
   if(!(emailFormat.test(email))){
    return res.status(400).json({message:"Invalid Email !",type:'error'})
  }
   if(!password){
    return res.status(400).json({message:"Please enter your password.",type:'error'})
   }
   if(!role){
    return res.status(400).json({message:"Please enter your role.",type:'error'})
   }
  if(password.length<6){
    return res.status(400).json({message:"Password must be greater than six characters.",type:'error'})
  }
  let isEmailExist = await userModel.findOne({email:email})
  if(isEmailExist){
    return res.status(400).json({message:'This email is already registered. Please try with another email.',type:"error"})
  }
  
  role = role.toUpperCase();

  let salt = await bcrypt.genSalt(10)
  let passhash = await bcrypt.hash(password,salt)

  let devObj = {
    userName:userName,
    email:email,
    password:passhash,
    role:role
  }

  await userModel.create(devObj)
  return res.status(200).json({message:"Registration Successful.",type:'success'})

}catch(error){
    console.log("ERROR::",error)
    return res.status(500).json({message:"Internal Server Error",type:"error",error:error.message})
}}




exports.signIn = async(req,res)=>{
   try{
    let email = req.body.email;
    let password = req.body.password;

    if(!email){
        return res.status(400).json({message:"Enter your email.",type:'error'})
    }
    if(!password){
        return res.status(400).json({message:'Enter your password.',type:'error'})
    }
    let isEmailExist = await userModel.findOne({email:email})
    if(!isEmailExist){
        return res.status(400).json({message:"This email is not registered",type:"error"})
    }
    let comparePassword = await bcrypt.compare(password,isEmailExist.password)
    if(!comparePassword){
     return res.status(400).json({message:"Incorrect password !",type:'error'})
    }
    let token = jwt.sign({
     id:isEmailExist._id,
     email:isEmailExist.email
    },process.env.SECRET_KEY)
    let data = isEmailExist.toObject() 
    data.token = token;
    
    return res.status(200).json({message:"LoggedIn",type:'success',data})

   }catch(error){
    console.log('ERROR::',error)
    return res.status(500).json({message:"Internal Server Error",type:'error',error:error.message})
   }
} 


