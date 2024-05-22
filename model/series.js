let mongoose = require('mongoose')

let seriesSchema = new mongoose.Schema({
    seriesName:{type:String,default:null},
    seriesStatus:{type:String,enum:['pending','completed']},
    languageId:{type:mongoose.Types.ObjectId},
  
    taskTime:{type:Number,default:null}
},{timestamps:true})

let seriesModel= mongoose.model('series',seriesSchema,'series')

module.exports=seriesModel