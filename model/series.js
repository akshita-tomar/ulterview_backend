let mongoose = require('mongoose')

let seriesSchema = new mongoose.Schema({
    seriesName:{type:String,default:null}
},{timestamps:true})

let seriesModel= mongoose.model('series',seriesSchema,'series')

module.exports=seriesModel