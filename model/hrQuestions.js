let mongoose = require('mongoose')

let HrQuestionsSchema = new mongoose.Schema({
    questionSeriesId: {type:mongoose.Types.ObjectId},
    questions:[{question:{type:Array,default:[]}}]
}, { timestamps: true })
let HrQuestionsModel = mongoose.model('Hr-Round-questions', HrQuestionsSchema)
module.exports = HrQuestionsModel