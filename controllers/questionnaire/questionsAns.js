let questionnaireModel = require('../../model/questions');
const userModel = require('../../model/user');
const languagesModel = require("../../model/languages")



exports.addObjective = async (req, res) => {
   try {
       let userId = req.result.id;
       let question = req.body.question;
       let options = req.body.options;
       let correctAnswer = req.body.correctAnswer;
       let difficultyLevel=  req.body.difficultyLevel

       if (!question) {
           return res.status(400).json({ message: "Please enter question.", type: 'error' });
       }
       if (options.length < 4) {
           return res.status(400).json({ message: 'Please enter all four options', type: 'error' });
       }
       if (!correctAnswer) {
           return res.status(400).json({ message: "Please enter the correct answer", type: "error" });
       }
       if(!difficultyLevel){
         return res.status(400).json({message:"Difficulty level is not present",type:'error'})
        }
       let isUserExist = await userModel.findOne({ _id: userId });

       if (!isUserExist) {
           return res.status(400).json({ message: "User does not exit.", type: 'error' });
       }
       let findLanguage = await languagesModel.findOne({ language: isUserExist.language });
       if (!findLanguage) {
           return res.status(400).json({ message: "Not able to find language.", type: 'error' });
       }
       let checkUpdateLanguageOrAdd = await questionnaireModel.findOne({languageId:findLanguage._id})
       if(checkUpdateLanguageOrAdd){
         await questionnaireModel.findOneAndUpdate(
            { languageId: findLanguage._id},
            {
                $push: {
                    objective: {
                        question: question,
                        options: options,
                        correctAnswer: correctAnswer,
                        difficultyLevel:difficultyLevel  
                    }
                }
            },
            { upsert: true }
        );
       }else{
         let questionnaireObj = {
            languageId: findLanguage._id,
            objective: {  
                question: question,
                options: options,
                correctAnswer: correctAnswer,
                difficultyLevel:difficultyLevel  
            }
        };
        await questionnaireModel.create(questionnaireObj);
       }
       return res.status(200).json({ message: 'MCQ added successfully.', type: "success" });
   } catch (error) {
       console.log('ERROR::', error);
       return res.status(500).json({ message: "Internal Server Error", type: 'error', error: error.message });
   }
};





exports.addSubjective = async(req,res)=>{
    try{
    let userId = req.result.id
    let question = req.body.question;
    let answer= req.body.answer;
    let difficultyLevel=  req.body.difficultyLevel

    if(!question){
        return res.status(400).json({message:"Please enter question.",type:'error'})
     }
     if(!answer){
        return res.status(400).json({message:"Please enter the  answer",type:"error"})
     }

     let isUserExist= await userModel.findOne({_id:userId})
     if(!isUserExist){
        return res.status(400).json({message:"User does not exit.",type:'error'})
     }
     if(!difficultyLevel){
      return res.status(400).json({message:"Difficulty level is not present",type:'error'})
     }
     let findLanguage = await languagesModel.findOne({language:isUserExist.language})
     if(!findLanguage){
        return res.status(400).json({message:"Not able to find language.",type:'error'})
     } 
     let checkUpdateLanguageOrAdd = await questionnaireModel.findOne({languageId:findLanguage._id})
     if(checkUpdateLanguageOrAdd){
     await questionnaireModel.findOneAndUpdate({ languageId: findLanguage._id},{
      $push:{
         subjective:{
            question:question,
            answer:answer ,
            difficultyLevel:difficultyLevel  
         }    
      }, 
     }, { upsert: true })
     }else{
      let subjectiveObj={
         languageId:findLanguage._id,
         subjective:{
            question:question,
            answer:answer,
            difficultyLevel:difficultyLevel  
         }     
      }
      await questionnaireModel.create(subjectiveObj)
     }
  
     return res.status(200).json({message:'subjective added successfully.',type:"success"})

    }catch(error){         
        console("ERROR::",error)
        return res.status(500).json({message:"Internal Server Error",type:"error",error:error.message})
    }
}


exports.addLogical= async(req,res)=>{
   try{
    let userId = req.result.id
    let question = req.body.question;
    let answer= req.body.answer;
    let difficultyLevel=  req.body.difficultyLevel

    if(!question){
        return res.status(400).json({message:"Please enter question.",type:'error'})
     }
     if(!answer){
        return res.status(400).json({message:"Please enter the  answer",type:"error"})
     }
  
     let isUserExist= await userModel.findOne({_id:userId})
     if(!isUserExist){
        return res.status(400).json({message:"User does not exit.",type:'error'})
     }
     if(!difficultyLevel){
      return res.status(400).json({message:"Difficulty level is not present",type:'error'})
     }
     
     let findLanguage = await languagesModel.findOne({language:isUserExist.language})
     if(!findLanguage){
        return res.status(400).json({message:"Not able to find language.",type:'error'})
     } 
     let checkUpdateLanguageOrAdd = await questionnaireModel.findOne({languageId:findLanguage._id})
     if(checkUpdateLanguageOrAdd){
     await questionnaireModel.findOneAndUpdate({ languageId: findLanguage._id},{
      $push:{
         logical:{
            question:question,
            answer:answer,
            difficultyLevel:difficultyLevel    
         }    
      }, 
     }, { upsert: true })
     }else{
      let LogicalObj={
         languageId:findLanguage._id,
         logical:{
            question:question,
            answer:answer,
            difficultyLevel:difficultyLevel  
         }     
      }
      await questionnaireModel.create(LogicalObj)
     }
  
     return res.status(200).json({message:'Logical added successfully.',type:"success"})


   }catch(error){
      console.log('ERROR::',error)
      return res.status(500).json({message:'Internal Server Error',type:'error',error:error.message})
   }
}




exports.getQuestions= async(req,res)=>{
    try{
    let userId = req.result.id

    let isUserExist = await userModel.findOne({_id:userId})
    if(!isUserExist){
        return res.status(400).json({message:"User not found",type:"error"})
    }
  
    let findLanguage = await languagesModel.findOne({language:isUserExist.language})
    if(!findLanguage){
        return res.status(400).json({message:"Not able to find language",type:'error'})
    }
    let getMyLanguageQuestions = await questionnaireModel.find({languageId:findLanguage._id})
  
    return res.status(200).json({data:getMyLanguageQuestions,type:"success"})
    }catch(error){
      console.log('ERROR::',error)
      return res.status(500).json({message:"Internal Server Error",type:'error',error:error.message})
    }
}



exports.holdChange = async(req,res)=>{
   try{

   }catch(error){
      console.log('ERROR::',error)
      return res.status(500).json({message:"Internal Server Error",type:'error',error:error.message})
    }
}