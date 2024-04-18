let mongoose =  require('mongoose');

const questionnaireSchema = new mongoose.Schema({
    languageId:{type:mongoose.Schema.ObjectId},
     objective: [{
     question:{type:String,default:null},
     options:{type:Array},
     correctAnswer:{type:String},
     difficultyLevel:{type:String,enum:['easy','hard','medium']}
    }],
    subjective: [{
        question:{type:String},
        answer:{type:String},
        difficultyLevel:{type:String,enum:['easy','hard','medium']}
    }],
    logical:[{
        question:{type:String},
        answer:{type:String},
        difficultyLevel:{type:String,enum:['easy','hard','medium']}
    }],
},{timestamps:true});


let questionnaireModel = mongoose.model('questionnaire',questionnaireSchema)
module.exports = questionnaireModel






