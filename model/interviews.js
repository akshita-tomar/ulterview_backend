let mongoose = require('mongoose')

let interviewSchema = new mongoose.Schema({
    candidateId:{type:mongoose.Types.ObjectId},
    providedQuesAns:{type:Object,default:null},
    retrivedQuesAns:{type:Object,default:null},
    testStartedAt:{type:Date,default:null},
    testEndedAt:{type:Date,default:null},
    completedStatus:{type:Boolean,default:false}
},{timestamps:true})

let interviewsModal = mongoose.model('Interview',interviewSchema)
module.exports = interviewsModal