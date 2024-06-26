const express = require('express')
const router = express.Router();
let user = require("../controllers/user/auth")
let language = require("../controllers/languages/language")
let questions = require("../controllers/questionnaire/questionsAns")
let series = require('../controllers/series/series')
let auth = require('../middleware/auth')
let candidate  = require('../controllers/candidate/candidate')
let HR = require('../controllers/HR/HrRound')

//test 
router.get('/test',user.test)

//auth 
router.post('/signUp',auth,user.signUp)
router.post('/signIn',user.signIn)


//developer and HR 
router.get('/get-HR-or-Developer-Details',auth,user.getHRorDeveloperDetails)
router.delete('/deleteUser',auth,user.deleteUser)
router.put("/editUserDetails",auth,user.editUserDetails)
router.put('/changePassword',auth,user.changePassword)

//language
router.post('/selectLanguage',auth,language.selectLanguage)
router.post('/addLanguage',auth,language.addLanguage)
router.get('/getAllLanguages',auth,language.getAllLanguages)
router.post('/UpdateUserLanguage',auth,language.UpdateUserLanguage)
router.post('/deleteLanguage',auth,language.deleteLanguage)
router.put('/updateLanguage',auth,language.updateLanguage)

//questions
router.post('/addObjective',auth,questions.addObjective)
router.post('/addSubjective',auth,questions.addSubjective)
router.post('/addLogical',auth,questions.addLogical)
router.get("/getQuestions",auth,questions.getQuestions)
router.get('/getQuestionsSeriesWise',auth,questions.getQuestionsSeriesWise)
router.put('/updateQuestionAnswer',auth,questions.updateQuestionAnswer)
router.delete('/DeleteQuestionAnswer',auth,questions.DeleteQuestionAnswer)
router.post('/generateLink',auth,questions.generateLink)



//series
router.post('/createSeries',auth,series.createSeries)
router.put('/updateSeries',auth,series.updateSeries)
router.delete('/deleteSeries',auth,series.deleteSeries)
router.get('/getAllSeries',auth,series.getAllSeries)
router.get('/getSeries',auth,series.getSeries)
router.get('/getAllseriesWithStatus',auth,series.getAllseriesWithStatus)

//candidate
router.post('/registerCandidate',auth,candidate.registerCandidate)
router.get('/getCandidates',auth,candidate.getCandidates)
router.get('/getSingleCandidate',auth,candidate.getSingleCandidate)
router.delete('/deleteCandidate',auth,candidate.deleteCandidate)
router.put('/updateCandidate',auth,candidate.updateCandidate)


//interview questions
router.get('/getInterviewQuestions',candidate.getInterviewQuestions)
router.post('/sendInterviewLink',auth,candidate.sendInterviewLink)
router.post('/sendLinkViaEmail',auth,candidate.sendLinkViaEmail)
router.post('/handleResendLink',auth,candidate.handleResendLink)
router.post('/inviteAccepted',candidate.inviteAccepted)
router.post('/testCompleted',candidate.testCompleted)
router.post('/addCandidateAnswers',candidate.addCandidateAnswers)


//candidate results 
router.get('/getCandidatebyLanguage',auth,candidate.getCandidatebyLanguage)
router.get('/get-dev-candidate-answers',auth,candidate.getAllQuesAns)
router.post('/addCheckedSheet',auth,candidate.addCheckedSheet)
// router.get('/get-checked-sheet',auth,candidate.getCheckedSheet)


// HR round series
router.post("/addQuestionSeries",auth,HR.addQuestionSeries)
router.get('/getHrRoundSeries',auth,HR.getHrRoundSeries)
router.delete('/deleteHrRoundSeries',auth,HR.deleteHrRoundSeries)
router.put('/updateHrRoundSeries',auth,HR.updateHrRoundSeries)

//HR round questions
router.post("/addQuestion",auth,HR.addQuestion)
router.get("/getHrRoundQuestions",auth,HR.getHrRoundQuestions)
router.put("/updateQuesiton",auth,HR.updateQuesiton)
router.delete("/deleteHrRoundQuestion",auth,HR.deleteHrRoundQuestion)


//HR round interview
router.post('/sendHrRoundQuesAns',auth,HR.sendHrRoundQuesAnsLink)
router.post('/startHrRound',HR.startHrRound)
router.get('/getHrRoundInterviewQues',HR.getHrRoundInterviewQues)
router.post('/addHrRoundCandidateAnswer',HR.addHrRoundCandidateAnswer)
router.get('/getTestDetails',HR.getTestDetails)
router.get('/HrRoundTestCompletd',auth,HR.HrRoundTestCompletd)
router.get('/hrRoundCandidateAnswers',auth,HR.hrRoundCandidateAnswers)
router.post('/hrRoundSelectReject',auth,HR.hrRoundSelectReject)




module.exports = router;