let candidateModel = require('../../model/candidate');
const languagesModel = require('../../model/languages');



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