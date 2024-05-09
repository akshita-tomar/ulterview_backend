let languagesModel = require("../../model/languages")
const questionnaireModel = require("../../model/questions")
const userModel = require("../../model/user")


exports.selectLanguage = async(req,res)=>{
    try{
      let userId = req.result.id
      var language = req.body.language
      if(!language){
        return res.status(400).json({message:"Please enter language.",type:'error'})
      }
     language =  language.toUpperCase()
      let languageObj={
        language:language
      }
      let isUserExist = await userModel.findOne({_id:userId})
      if(!isUserExist){
        return res.status(400).json({message:"User not found.",type:'error'})
      }
      // await languagesModel.create(languageObj)
      await userModel.findOneAndUpdate({_id:userId},{
        $set:{
          language:language
        }
      })
      return res.status(200).json({message:'Language selected successfully.',type:'success'})
    }catch(error){
        console.log('ERROR::',error)
        return res.status(500).json({message:"Internal Server Error",type:'error',error:error.message})
    }
}



exports.addLanguage = async(req,res)=>{
  try{
    let userId = req.result.id
    var language = req.body.language
    if(!language){
      return res.status(400).json({message:"Please enter language.",type:'error'})
    }
    language =  language.toUpperCase()
    let checkLanguageDuplicacy = await languagesModel.findOne({language:language})
    if(checkLanguageDuplicacy){
      return res.status(400).json({message:"This language is already exist in the list.",type:'error'})
    }
    let languageObj={
      language:language
    }
    
    let isUserExist = await userModel.findOne({_id:userId})
    if(!isUserExist){
      return res.status(400).json({message:"User not found.",type:'error'})
    }
    await languagesModel.create(languageObj)
    await userModel.findOneAndUpdate({_id:userId},{
      $set:{
        language:language
      }
    })
    return res.status(200).json({message:'Language added successfully.',type:'success'})
  }catch(error){
    console.log('ERROR::',error)
    return res.status(500).json({message:"Internal Server Error",type:'error',error:error.message})
  }
}


exports.getAllLanguages = async(req,res)=>{
    try{
      
      let languages = await languagesModel.find()
       if(languages.length<1){
        return res.status(200).json({message:"No languages added Yet!",type:'success'})
       }
       return res.status(200).json({data:languages,type:'success'})
    }catch(error){
        console.log("ERROR::",error)
        return res.status(500).json({message:"Internal Server Error.",type:"error",error:error.message})
    }
}


exports.UpdateUserLanguage= async(req,res)=>{
  try{
  let userId = req.result.id
  let language = req.body.language
  
  if(!language){
    return res.status(400).json({message:"Language is not present.",type:'error'})
  }
  let isUserExist = await userModel.findOne({_id:userId})
  if(!isUserExist){
    return res.status(400).json({message:"User not exist.",type:'error'})
  }
  await userModel.findOneAndUpdate({_id:userId},{
   $set:{
    language:language
   }
  })
  return res.status(200).json({message:"language updated successfully.",type:'success'})
  }catch(error){
    console.log("ERROR::",error)
    return res.status(500).json({message:"Internal Server Error.",type:"error",error:error.message})
}
}



exports.deleteLanguage = async(req,res)=>{
  try{   
      let id = req.query.languageId  
     
      if(!id){
        return res.status(400).json({message:'Language Id not present',type:'error'})
      }
      let isLanguageExist = await languagesModel.findOne({_id:id})
      if(!isLanguageExist){
        return res.status(400).json({message:"Language not present.",type:'error'})
      }
      await languagesModel.findOneAndDelete({_id:id})
      return res.status(200).json({message:"Language deleted successfully",type:'success'})
  }catch(error){
    console.log("ERROR::",error)
    return res.status(500).json({message:"Internal Server Error",type:"error",error:error.message})
  }
}


exports.updateLanguage = async(req,res)=>{
  try{
    let languageId = req.query.languageId;
    let updatedLanguage = req.body.language;
    if(!languageId){
      return res.status(400).json({message:"Language id not present in the params",type:"error"})
    }
    if(!updatedLanguage){
      return res.status(400).json({message:"Please enter language",type:'error'})
    }
    let isLanguageExist = await languagesModel.findOne({_id:languageId})
    if(!isLanguageExist){
      return res.status(400).json({message:"Language not exist.",type:"error"})
    }
    await languagesModel.findOneAndUpdate({_id:languageId},{
      $set:{
        language:updatedLanguage
      }
    })
    return res.status(200).json({message:"Language updated successfully!",type:"success"})

  }catch(error){
    console.log("ERROR::",error)
    return res.status(500).json({message:"Internal Server Error",type:"error",error:error.message})
  }
}