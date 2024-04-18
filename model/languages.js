let mongoose = require('mongoose')
let languagesSchema = new mongoose.Schema({
  language:{type:String,default:null}
},{timestamps:true})
let languagesModel = mongoose.model('language',languagesSchema)
module.exports = languagesModel