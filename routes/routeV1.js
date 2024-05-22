const express = require('express')
const router = express.Router();
let user = require("../controllers/user/auth")
let language = require("../controllers/languages/language")
let questions = require("../controllers/questionnaire/questionsAns")
let series = require('../controllers/series/series')
let auth = require('../middleware/auth')
let candidate  = require('../controllers/candidate/candidate')

//test 
router.get('/test',user.test)

//developer 
router.post('/signUp',user.signUp)
router.post('/signIn',user.signIn)

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

module.exports = router;