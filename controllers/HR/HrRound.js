let interviewsModal = require('../../model/interviews')
let candidateModel = require('../../model/candidate')
let nodemailer = require('nodemailer')
let HrQuestionsModel = require('../../model/hrQuestions')
let hrQuestionsSeriesModel = require("../../model/hrQuestionSeries")

require('dotenv').config()




exports.addQuestionSeries = async (req, res) => {
    try {
        let questionSeries = req.body.questionSeries;
        if (!questionSeries) {
            return res.status(400).json({ message: "Quetion series not present", type: 'error' })
        }
        await hrQuestionsSeriesModel.create({ questionSeries: questionSeries })
        return res.status(200).json({ message: "Question series added successfully", type: 'success' })
    } catch (error) {
        console.log("ERROR::", error)
        return res.status(500).json({ message: "Internal Server Error", type: "error",error:error.message})
    }
}


exports.getHrRoundSeries=async(req,res)=>{
 try{
  let allSeries = await hrQuestionsSeriesModel.find()
  return res.status(200).json({allSeries,type:"success"})
 }catch(error){
    console.log("ERROR::",error)
    return res.status(500).json({message:"Internal Server Error",type:"error",error:error.message})
 }
}


exports.deleteHrRoundSeries= async(req,res)=>{
    try{
     let SeriesId = req.body.SeriesId;
     if(!SeriesId){
        return res.status(400).json({message:"Series Id not present.",type:"error"})
     }
     let isSeriesExist = await hrQuestionsSeriesModel.findOne({_id:SeriesId})
     if(!isSeriesExist){
        return res.status(400).json({message:"Series doesn't exist with this id",type:"error"})
     }
     await HrQuestionsModel.findOneAndDelete({questionSeriesId:SeriesId})
     await hrQuestionsSeriesModel.findOneAndDelete({_id:SeriesId})

     return res.status(200).json({message: isSeriesExist.questionSeries +" series deleted successfully",type:"success"})
    }catch(error){
        console.log("ERROR::",error)
        return res.status(500).json({message:"Internal Server Error",type:"error",error:error.message})
    }
}

exports.updateHrRoundSeries=async(req,res)=>{
    try{
      let seriesId = req.body.seriesId
      let seriesName = req.body.seriesName
      if(!seriesId){
        return res.status(400).json({message:"Series Id not present.",type:'error'})
      }
      if(!seriesName){
        return res.status(400).json({message:"Please enter series name",type:"error"})
      }
      let isSeriesExist = await hrQuestionsSeriesModel.findOne({_id:seriesId})
      if(!isSeriesExist){
        return res.status(400).json({message:"Series not present.",type:"error"})
      }
      await hrQuestionsSeriesModel.findOneAndUpdate({_id:seriesId},{
        $set:{
            questionSeries:seriesName
        }
      })
      return res.status(200).json({message:"Document updated successfully.",type:'success'})
    }catch(error){
        console.log("ERROR::",error)
        return res.status(500).json({message:"Internal Server Error",type:"error",error:error.message})
    }
}

exports.addQuestion = async (req, res) => {
    try {
        let questionSeriesId = req.body.questionSeriesId;
        let question = req.body.question;

        if (!questionSeriesId) {
            return res.status(400).json({ message: "Question series Id not present.", type: "error" })
        }
        if (!question) {
            return res.status(400).json({ message: "Please enter question.", type: 'error' })
        }

        let IdExistCheck = await HrQuestionsModel.findOne({ questionSeriesId: questionSeriesId })

        if (!IdExistCheck) {
            await HrQuestionsModel.create({ questionSeriesId: questionSeriesId, questions: question })
        } else {
            await HrQuestionsModel.findOneAndUpdate({ questionSeriesId: questionSeriesId }, {
                $push: {
                    questions: {question:question}
                  }
        })}
        return res.status(200).json({ message: "Question added successfully.", type: "success" })

    } catch (error) {
        console.log("ERROR::", error)
        return res.status(500).json({ message: "Internal Server Error", type: "error", error: error.message })
    }
}


exports.updateQuesiton = async(req,res)=>{
    try{
      let questionSeriesId = req.body.questionSeriesId
      let questionId = req.body.questionId;
      if(!questionSeriesId){
        return res.status(400).json({message:"Question Series Id not present.",type:'error'})
      }
      if(!questionId){
        return res.status(400).json({message:"question id not present.",type:'error'})
      } 
      let isQuestionSeriesExist = await hrQuestionsSeriesModel.findOne({_id:questionSeriesId})
      if(!isQuestionSeriesExist){
        return res.status(400).json({message:"Question series not exist with this id",type:'error'})
      }
      let isSeriesExistInQuesions = await HrQuestionsModel.findOne({questionSeriesId:questionSeriesId})
      if(!isSeriesExistInQuesions){
        return res.status(400).json({message:"Question series not exist in hrQuesionModel",type:'error'})
      }
      await hrQuestionsSeriesModel.findOneAndUpdate({})
    }catch(error){
        console.log("ERROR::",error)
        return res.status(500).json({message:"Internal Server Error",type:'error',error:error.message})
    }
}


exports.sendHrRoundQuesAns = async (req, res) => {
    try {
        let candidateId = req.body.candidateId;
        let hrRoundQuesAns = req.body.hrRoundQuesAns;
        let link = req.body.link

        if (!candidateId) {
            return res.status(400).json({ message: "CandidateId not present.", type: 'error' })
        }
        if (!hrRoundQuesAns) {
            return res.status(400).json({ message: 'HR round questions are not present.', type: 'error' })
        }
        let isCandidateExist = await candidateModel.findOne({ _id: candidateId })
        if (!isCandidateExist) {
            return res.status(400).json({ message: "Candidate not found.", type: "error" })
        }
        if (!link) {
            return res.status(400).json({ message: "link not present.", tuye: "error" })
        }

        let email = isCandidateExist.email
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL,
                pass: process.env.GMAIL_PASSWORD
            }
        })
        let mailDetails = {
            from: process.env.GMAIL,
            to: email,
            subject: 'Ultivic Technologies (HR round)',
            text: 'Interview link',
            html: "<div style='padding:30px; text-align:center; color:black'> <h2> " + link + "</h2></div>"
        }
        transporter.sendMail(mailDetails,
            (error, data) => {
                if (error) {
                    return res.status(400).json({ message: "Something went wrong during sending email.", type: "error", data: error })
                } else {
                    //   return res.status(200).json({ message: " Interview link has been sent to " + isCandidateExist.username, type: "success" })
                    console.log("interview link for HR round has been sent.")
                }
            })
        let isCandidateInterviewExist = await interviewsModal.findOne({ candidateId: candidateId })
        if (!isCandidateInterviewExist) {
            await interviewsModal.create({ hrRoundQuesAns: hrRoundQuesAns })
            await candidateModel.findOneAndUpdate({ _id: candidateId }, {
                $set: {
                    hrRoundStatus: "invite_sent"
                }
            })
        } else {
            await interviewsModal.findOneAndUpdate({ candidateId: candidateId }, {
                $set: {
                    hrRoundQuesAns: hrRoundQuesAns
                }
            })
            await candidateModel.findOneAndUpdate({ _id: candidateId }, {
                $set: {
                    hrRoundStatus: "invite_sent"
                }
            })
        }
        return res.status(200).json({ message: "HR round interview link has been sent to " + isCandidateExist.username, type: "success" })
    } catch (error) {
        console.log("ERROR::", error)
        return res.status(500).json({ message: "Internal Server Error", error: "error", error: error.message })
    }
}
