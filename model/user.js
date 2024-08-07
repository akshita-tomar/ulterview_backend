const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
    userName: { type: String, default: null },
    email: { type: String, default: null },
    password: { type: String, default: null }, 
    role: { type: String, enum: ['HR', 'DEVELOPER', 'ADMIN','CANDIDATE'] },
    profile:{type:String,default:null},
    experience:{type:String,default:null},
    language:{type:String,default:null},
    token:{type:String,default:null}
}, { timestamps: true });



const User = mongoose.model('User', userSchema);

module.exports = User;
