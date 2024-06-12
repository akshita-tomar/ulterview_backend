let mongoose = require('mongoose')

let interviewSchema = new mongoose.Schema({
    candidateId:{type:mongoose.Types.ObjectId},
    providedQuesAns:{type:Object,default:null},
    retrivedQuesAns:{type:Object,default:null},
    testStartedAt:{type:Date,default:null},
    testEndedAt:{type:Date,default:null},
    completedStatus:{type:Boolean,default:false},
    totalQuestion:{type:Number,default:0},
    totalCorrectQuestions:{type:Number,default:0},
    checkedAnswerSheet:{type:Object,default:null},
    checkedBy:{type:String,default:null},
    linkClickedCount:{type:Number,default:0},
    hrRoundQuesAns:{type:Object,default:null},
    hrRoundAnswers:{type:Object,default:null},
    hrRoundStartAt:{type:Date,default:null},
    hrROundEndAt:{type:Date,default:null},
    hrRoundLinkClickedCount :{ type:Number,default:0}
},{timestamps:true})

let interviewsModal = mongoose.model('Interview',interviewSchema)
module.exports = interviewsModal