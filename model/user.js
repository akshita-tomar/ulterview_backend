const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
    userName: { type: String, default: null },
    email: { type: String, default: null },
    password: { type: String, default: null }, 
    role: { type: String, enum: ['HR', 'DEVELOPER', 'ADMIN','CANDIDATE'] },
    language:{type:String,default:null}
}, { timestamps: true });


userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});


userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.passwordHash);
    } catch (error) {
        return false;
    }
};


const User = mongoose.model('User', userSchema);

module.exports = User;
