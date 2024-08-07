
let { check, validationResult, body, query } = require('express-validator')


const signUpValidator = [
    check('userName', 'Please enter username.').not().isEmpty(),
    check('email', 'Please enter email').not().isEmpty(),
    check('email', 'please enter correct email format').isEmail(),
    check('password', 'Please enter password').not().isEmpty(),
    check('role', 'Please enter role').not().isEmpty(),
    check('password').isLength({ min: 6 }).withMessage('Password must be greater than 6 characters.'),
    check('experience', 'Please enter experience.').not().isEmpty(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) { return res.status(400).json({ message: errors.array()[0].msg, type: 'error' }); }
        next();
    }
]


const editUserDetailsValidator = [
    check('userId', 'User Id not present.').not().isEmpty(),
    check('username', 'Please enter username').not().isEmpty(),
    check('experience', 'Please enter experience').not().isEmpty(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) { return res.status(400).json({ message: errors.array()[0].msg, type: 'error' }) }
        next();
    }
]


const changePasswordValidator = [
    check('password', 'Enter password.').not().isEmpty(),
    check('newPassword', 'Enter new password.').not().isEmpty(),
    check('confirmPassword', 'Enter confirm password.').not().isEmpty(),
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.newPassword) {
            throw new Error('Confirm password does not match new password.');
        }
        return true;
    }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array()[0].msg, type: 'error' })
        }
        next()
    }
]



const addObjectiveValidator = [
    check('question', 'Please enter question.').not().isEmpty(),
    check('options', 'Please enter options.').not().isEmpty(),
    check('correctAnswer', 'Please enter the correct answer.').not().isEmpty(),
    check('seriesId', 'seriesId not present.').not().isEmpty(),
    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array()[0].msg, type: 'error' })
        }
        next();
    }
]


const addSubjectiveValidator = [
    check('question', 'Please enter question.').not().isEmpty(),
    check('answer', 'Please enter the answer.').not().isEmpty(),
    check('seriesId', 'seriesId not present.').not().isEmpty(),
    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array()[0].msg, type: "error" })
        }
        next();
    }
]


const updateQuestionAnswerValidator = [
    check('questionType', 'Question type not present.').not().isEmpty(),
    query('questionId', 'Question Id is not present.').not().isEmpty(),
    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array()[0].msg, type: "error" })
        }
        next();
    }
]


const createSeriesValidator = [
    check('seriesName','Please enter series name.').not().isEmpty(),
    query('languageId','Language Id not present.').not().isEmpty(),
    check('taskTime','Please enter task time').not().isEmpty(),
    (req,res,next)=>{
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({message:errors.array()[0].msg,type:'error'})
        }
        next();
    }
]


const updateSeriesValidator = [
  query('updateSeriesId','series Id not present.').not().isEmpty(),
  check('taskTime','Task time is not present.').not().isEmpty(),
  (req,res,next)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({message:errors.array()[0].msg,type:'error'})
    }
    next();
  }
]


// const registerCandidateValidator = [
//     check('username','Please provide username.').not().isEmpty(),
//     check('email','Please provide email.').not().isEmpty(),
//     check('email','Please enter correct email format.').isEmail(),
//     check('profile','Please provide profile.').not().isEmpty(),
//     check('languageId','Language Id is missing.').not().isEmpty(),
//     check('experience','Please provide experience.').not().isEmpty(),
//     (req,res,next)=>{
//         const errors = validationResult(req)
//         if(!errors.isEmpty()){

//         }
//     }
// ]



module.exports = {
    signUpValidator,
    editUserDetailsValidator,
    changePasswordValidator,
    addObjectiveValidator,
    addSubjectiveValidator,
    updateQuestionAnswerValidator,
    createSeriesValidator,
    updateSeriesValidator
}