let candidateModel = require('../../model/candidate');
const languagesModel = require('../../model/languages');
const seriesModel = require('../../model/series')
const questionnaireModel = require("../../model/questions")
const interviewsModal = require("../../model/interviews")
const mongoose = require("mongoose")
let nodemailer = require('nodemailer')
let {io}= require('../../index')
require('dotenv').config();



exports.registerCandidate = async (req, res) => {
  try {
    let username = req.body.username;
    let email = req.body.email;
    let profile = req.body.profile;
    let experience = req.body.experience;
    let languageId = req.body.languageId
    let emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

   
    if (!username) {
      return res.status(400).json({ message: "Please provide username.", type: "error" })
    }
    if (!email) {
      return res.status(400).json({ message: "Please provide email.", type: 'error' })
    }
    if (!(emailFormat.test(email))) {
      return res.status(400).json({message:'Please enter correct email format.',type:'error'})
    }
    if (!profile) {
      return res.status(400).json({ message: "Please provide profile.", type: "error" })
    }
    if(!languageId){
      return res.status(400).json({message:"Language Id is missing.",type:"error"})
    }
    let isLanguageExist=await languagesModel.findOne({_id:languageId})
    if(!isLanguageExist){
      return res.status(400).json({message:"language dosen't exist with this Id.",type:"error"})
    }
    if (!experience) {
      return res.status(400).json({ message: "Please provide experience.", type: "error" })
    }

    let obj = {
      username: username,
      email: email,
      profile: profile,
      experience: experience,
      languageId:languageId
    }

    await candidateModel.create(obj)
    return res.status(200).json({ message: 'Candidate registered successfully.', type: "success" })

  } catch (error) {
    console.log('ERROR::', error)
    return res.status(500).json({ message: "Internal Server Error", type: "error", error: error.message })
  }
}



exports.getCandidates = async (req, res) => {
  try {
    var allCandidates = await candidateModel.find()
    allCandidates = await allCandidates.reverse()
    return res.status(200).json({ allCandidates, type: 'success' })
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", type: 'error', error: error.message })
  }
}


exports.getSingleCandidate=async(req,res)=>{
try{
 let candidateId = req.query.candidateId;
 if(!candidateId){
  return res.status(400).json({message:"Candidate id is missing.",type:'error'})
 }
 let isCandidateExist = await candidateModel.findOne({_id:candidateId})
 if(!isCandidateExist){
  return res.status(400).json({message:"Candidate dosen't exist.",type:"error"})
 }
 return res.status(200).json({isCandidateExist,type:'success'})
}catch(error){
  console.log("ERROR::",error)
  return res.status(500).json({message:"Internal Server Error",type:"error",error:error.message})
}}


exports.deleteCandidate = async (req, res) => {
  try {
    let candidateId = req.query.candidateId;
    if (!candidateId) {
      return res.status(400).json({ message: "Candidate Id is missing.", type: 'error' })
    }
    let isCandidateExist = await candidateModel.findOne({ _id: candidateId })
    if (!isCandidateExist) {
      return res.status(400).json({ message: "Candidate doesn't exist.", type: 'error' })
    }
    await candidateModel.findOneAndDelete({ _id: candidateId })
    return res.status(200).json({ message: "Candidate deleted successfully", type: 'success' })
  } catch (error) {
    console.log('ERROR::', error)
    return res.status(500).json({ message: "Internal Server Error", type: 'error', error: error.message })
  }
}


exports.updateCandidate = async (req, res) => {
  try {
    let candidateId = req.query.candidateId;
    let { username, email, profile, experience,languageId } = req.body
    let emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (!candidateId) {
      return res.status(400).json({ message: "Please provide candidate Id.", type: 'error' })
    }
    if (!username) {
      return res.status(400).json({ message: "Please enter candidate's name.", type: 'error' })
    }
    if (!email) {
      return res.status(400).json({ message: "Please enter candidate's email", type: 'error' })
    }
    if (!(emailFormat.test(email))) {
      return res.status(400).json({message:'Please enter correct email format.',type:'error'})
    }
    if (!profile) {
      return res.status(400).json({ message: "Please enter candidate's job profile.", type: 'error' })
    }
    if(!languageId){
      return res.status(400).json({message:"Language Id is missing.",type:"error"})
    }
    let isLanguageExist=await languagesModel.findOne({_id:languageId})
    if(!isLanguageExist){
      return res.status(400).json({message:"language dosen't exist with this Id.",type:"error"})
    }
    if (!experience) {
      return res.status(400).json({ message: "Please enter candidate's exprience.", type: 'error' })
    }

    let isCandidateExist = await candidateModel.findOne({ _id: candidateId })
    if (!isCandidateExist) {
      return res.status(400).json({ message: "Candidate doesn't exist.", type: 'error' })
    }
    await candidateModel.findOneAndUpdate({ _id: candidateId }, {
      $set: {
        username: username,
        email: email,
        profile: profile,
        experience: experience,
        languageId:languageId
      }
    })
    return res.status(200).json({ message: "Candidate's document updated successfully.", type: 'success' })

  } catch (error) {
    console.log('ERROR::', error)
    return res.status(500).json({ message: "Internal Server Error", type: 'error', error: error.message })
  }
}




exports.sendInterviewLink = async(req,res)=>{
  try{
    let seriesId = req.query.seriesId;
    let candidateId = req.query.candidateId;

    if(!candidateId){
      return res.status(400).json({message:"Candidate Id not present.",type:'error'})
    }
    let isCandidateExist = await candidateModel.findOne({_id:candidateId})
    if(!isCandidateExist){
      return res.status(400).json({message:"Candidate doesn't exist.",type:"error"})
    }
    if(!seriesId){
      return res.status(400).json({message:"Series Id not present.",type:'error'})
    }
    let isSeriesExist = await seriesModel.findOne({_id:seriesId})

    if(!isSeriesExist){
      return res.status(400).json({message:"Series doesn't exist.",type:"error"})
    }
    await candidateModel.findOneAndUpdate({_id:candidateId},{
      seriesId:seriesId
    })
  
    let languageId=isCandidateExist.languageId

    if(!languageId){
      return res.status(400).json({message:"Language Id missing.",type:'error'})
    }
    let language = await languagesModel.findOne({ _id: languageId })

    const questions = await questionnaireModel.aggregate([
      {
        $match: { languageId: language._id }
      },
      {
        $project: {
          subjective: {
            $filter: {
              input: '$subjective',
              as: 'item',
              cond: { $eq: ['$$item.series_id', new mongoose.Types.ObjectId(seriesId)] }
            }
          },
          objective: {
            $filter: {
              input: '$objective',
              as: 'item',
              cond: { $eq: ['$$item.series_id', new mongoose.Types.ObjectId(seriesId)] }
            }
          },
          logical: {
            $filter: {
              input: '$logical',
              as: 'item',
              cond: { $eq: ['$$item.series_id', new mongoose.Types.ObjectId(seriesId)] }
            }
          }
        }
      }
    ]);

    if (
      questions.length === 0 ||
      (questions[0].subjective.length === 0 && questions[0].objective.length === 0 && questions[0].logical.length === 0)
    ) {
      return res.status(400).json({ message: "No questions found", type: 'error' });
    }
    let isEntryExist = await interviewsModal.findOne({candidateId:candidateId})
  
    if(isEntryExist){
      await interviewsModal.findOneAndUpdate({candidateId:candidateId},{
        $set:{
          providedQuesAns:questions
        }
      })
    }else{
      await interviewsModal.create({candidateId:candidateId,providedQuesAns:questions})
    }
    await candidateModel.findOneAndUpdate({_id:candidateId},{
      $set:{
        testStatus:'invite_sent'
      }
    })
    return res.status(200).json({message:"candidate details added successfully",type:'success'})
  }catch(error){
    console.log("ERROR::",error)
    return res.status(500).json({message:"Internal Server Error.",type:'error',error:error.message})
  }
}


exports.getInterviewQuestions = async(req,res)=>{
  try{
    let candidateId = req.query.candidateId
    if(!candidateId){
      return res.status(400).json({message:"Not able to get candidate Id,",type:'error'})
    }
    let isCandidateExist = await candidateModel.findOne({_id:candidateId})
    if(!isCandidateExist){
      return res.status(400).json({message:"Candidate dosen't exist.",type:'error'})
    }
    let series = await seriesModel.findOne({_id:isCandidateExist.seriesId})
    let time = series.taskTime
    let candidate = await interviewsModal.findOne({candidateId:candidateId})
    let questions = candidate.providedQuesAns
    let completedStatus = isCandidateExist.testStatus
    return res.status(200).json({time,completedStatus,questions,type:"success"})
     
  }catch(error){
    console.log('ERROR::',error)
    return res.status(500).json({message:"Internal Server Error",type:'error',error:error.message})
  }
}




exports.sendLinkViaEmail = async(req,res)=>{
 try{
  let candidateId = req.query.candidateId
  let link = req.body.link

  if(!link){
    return res.status(400).json({message:"Link is not present.",type:"error"})
  }
  if(!candidateId){
    return res.status(400).json({message:"Candidate id not present.",type:"error"})
  }
  let isCandidateExist = await candidateModel.findOne({_id:candidateId})
  if(!isCandidateExist){
    return res.status(400).json({message:"Candidate doesn't exist.",type:"error"})
  }
  let email = isCandidateExist.email
  let transporter = nodemailer.createTransport({
    // host: "smtp.zoho.in",
    // port: 465,                                                                                      
    // secure: true,
    
    service: 'gmail',
    auth: {
        user: process.env.GMAIL,
        pass: process.env.GMAIL_PASSWORD
    }
})
let mailDetails = {
    from: process.env.GMAIL,
    to: email,
    subject: 'Ultivic Technologies',
    text: 'Interview link',
    html: "<div style='padding:30px; text-align:center; color:black'> <h2> " + link + "</h2></div>"
}
transporter.sendMail(mailDetails,
    (error, data) => {
        if (error) {
            return res.status(400).json({message:"Something went wrong",type:"error",data:error})
        } else {
             return res.status(200).json({message:" Interview link has been sent to " +isCandidateExist.username ,type:"success"})
        }
    })
 }catch(error){
  console.log('ERROR::',error)
  return res.status(500).json({message:"Internal Server Error",type:'error',error:error.message})
 }
}




exports.inviteAccepted = async(req,res)=>{
  try{
    let candidateId = req.body.candidateId;
    if(!candidateId){
      return res.status(400).json({message:"Candidate Id not found.",type:"error"})
    }
    let isCandidateExist = await candidateModel.findOne({_id:candidateId})
    if(!isCandidateExist){
      return res.status(400).json({message:"Candidate not found.",type:"error"})
    }
    await candidateModel.findOneAndUpdate({_id:candidateId},{
      $set:{
        testStatus:'invite_accepted'
      }
    })
    await interviewsModal.findOneAndUpdate({candidateId:candidateId},{
      $set:{
        testStartedAt:new Date(),
      }
    })
    return res.status(200).json({message:'Invite accepted',type:"success"})
  }catch(error){
    console.log("ERROR::",error)
    return res.status(500).json({message:"Internal Server Error",type:"error",error:error.message})
  }
}



exports.testCompleted = async(req,res)=>{
  try{
    let candidateId = req.body.candidateId; 
    if(!candidateId){
      return res.status(400).json({message:"Candidate Id not found.",type:"error"})
    }
    let isCandidateExist = await candidateModel.findOne({_id:candidateId})
    if(!isCandidateExist){
      return res.status(400).json({message:"Candidate not found.",type:"error"})
    }
    await candidateModel.findOneAndUpdate({_id:candidateId},{
      $set:{
        testStatus:'completed'
      }
    })
    await interviewsModal.findOneAndUpdate({candidateId:candidateId},{
      $set:{
        testEndedAt:new Date()
      }
    })
    return res.status(200).json({message:'Test Completed',type:"success"})
  }catch(error){
    console.log("ERROR::",error)
    return res.status(500).json({message:"Internal Server Error",type:"error",error:error.message})
  }
}


exports.addCandidateAnswers= async(req,res)=>{
   try{
    let candidateId = req.body.candidateId;
    let quesAns = req.body.quesAns;
    if(!candidateId){
      return res.status(400).json({message:"Candidate Id not present!",type:"error"})
    }
    if(!quesAns){
      return res.status(400).json({message:"Please enter answers.",type:"error"})
    }
    let isCandidateExist = await candidateModel.findOne({_id:candidateId})
    if(!isCandidateExist){
      return res.status(400).json({message:"Candidate not found",type:"error"})
    }
    let candidateInterview = await interviewsModal.findOne({candidateId:candidateId})
    if(!candidateInterview){
      return res.status(400).json({message:"Candidate not found in interview.",type:"error"})
    }
    await interviewsModal.findOneAndUpdate({candidateId:candidateId},{
      $set:{
        retrivedQuesAns:quesAns
      }
    })
    io.emit('Interview_submitted')
    return res.status(500).json({message:"Interview completed!",type:"success"})
   }catch(error){
    console.log("ERROR::",error)
    return res.status(500).json({message:"Internal Server Error",type:"error",error:error.message})
   }
}