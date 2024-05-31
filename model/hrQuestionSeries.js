let mongoose = require('mongoose')
let hrQuestionsSeries = new mongoose.Schema({
    questionSeries:{type:String,default:null}
},{timestamps:true})
let hrQuestionsSeriesModel = mongoose.model('hr-question-series',hrQuestionsSeries)
module.exports = hrQuestionsSeriesModel