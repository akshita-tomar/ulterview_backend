const express = require('express')
const router = express.Router();
let user = require("../controllers/user/auth")
let language = require("../controllers/languages/language")
let questions = require("../controllers/questionnaire/questionsAns")
let auth = require('../middleware/auth')



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


module.exports = router;