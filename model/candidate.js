let mongoose = require('mongoose')
let candidateSchema = new mongoose.Schema({
    username:{type:String,default:null},
    email:{type:String,default:null},
    experience:{type:String,default:null},
    profile:{type:String,default:null},
    resultStatus:{type:String,enum:['selected','rejected','pending'],default:'pending'},
    testStatus:{type:String,enum:['invite_sent','invite_accepted','completed','pending'],default:'pending'},
    acceptRejectReason:{type:String,default:null},
    languageId:{type:mongoose.Types.ObjectId},
    seriesId:{type:mongoose.Types.ObjectId},
},{timestamps:true})
let candidateModel = mongoose.model('candidate',candidateSchema)
module.exports = candidateModel;