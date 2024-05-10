let mongoose =  require('mongoose');

const questionnaireSchema = new mongoose.Schema({
    languageId:{type:mongoose.Types.ObjectId},
     objective: [{
     question:{type:String,default:null},
     options:{type:Array},
     correctAnswer:{type:String},
     series_id:{type:mongoose.Types.ObjectId}
    }],
    subjective: [{
        question:{type:String},
        answer:{type:String},
        series_id:{type:mongoose.Types.ObjectId}
    }],
    logical:[{
        question:{type:String},
        answer:{type:String},
        series_id:{type:mongoose.Types.ObjectId}
    }],
},{timestamps:true});


let questionnaireModel = mongoose.model('questionnaire',questionnaireSchema)
module.exports = questionnaireModel






