
const userModel = require('../../model/user');
let bcrypt = require('bcrypt')
let jwt = require('jsonwebtoken');
let nodemailer = require('nodemailer')
require('dotenv').config()

exports.test = async (req, res) => {
  res.send("working....")
}

exports.signUp = async (req, res) => {
  try {
    let userName = req.body.userName;
    let email = req.body.email;
    let password = req.body.password;
    var role = req.body.role
    let experience = req.body.experience;
    let profile = req.body.profile

    let emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!userName) {
      return res.status(400).json({ message: "Please enter username.", type: 'error' })
    }
    if (!email) {
      return res.status(400).json({ message: "Please enter email.", type: 'error' })
    }
    if (!(emailFormat.test(email))) {
      return res.status(400).json({ message: "Invalid Email !", type: 'error' })
    }
    if (!password) {
      return res.status(400).json({ message: "Please enter  password.", type: 'error' })
    }
    if (!role) {
      return res.status(400).json({ message: "Please enter role.", type: 'error' })
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be greater than six characters.", type: 'error' })
    }
    if (!experience) {
      return res.status(400).json({ message: "Please enter experience.", type: "error" })
    }
    let isEmailExist = await userModel.findOne({ email: email })
    if (isEmailExist) {
      return res.status(400).json({ message: 'This email is already registered. Please try with another email.', type: "error" })
    }
    role = role.toUpperCase();
    if (role === 'DEVELOPER') {
      if (!profile) {
        return res.status(400).json({ message: "Add developer's profile", type: 'error' })
      }
    }

    let salt = await bcrypt.genSalt(10)
    let passhash = await bcrypt.hash(password, salt)

    let devObj = {
      userName: userName,
      email: email,
      password: passhash,
      role: role,
      experience: experience,
      profile: profile
    }
    await userModel.create(devObj)

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL,
        pass: process.env.GMAIL_PASSWORD
      }
    })
    let mailDetails = {
      from: process.env.GMAIL,
      to: email,
      subject: 'Ultivic Technologies',
      text: 'Your Credentials',
      html: "<div> Welcome to Ultivic interview portal. Your login credentials are :  <h4> email : " + email + ", password : " + password + " </h4><br> You can login with these credentials and can change your password</div>"
    }
    transporter.sendMail(mailDetails,
      (error, data) => {
        if (error) {
          return res.status(400).json({ message: "Something went wrong", type: "error", data: error })
        } else {
          return res.status(200).json({ message: "Registration successfull! Login credentials has been sent to " + userName, type: "success" })
        }
      })
    // return res.status(200).json({ message: "Registration Successful.", type: 'success' })

  } catch (error) {
    console.log("ERROR::", error)
    return res.status(500).json({ message: "Internal Server Error", type: "error", error: error.message })
  }
}




exports.signIn = async (req, res) => {
  try {
    let email = req.body.email;
    let password = req.body.password;

    if (!email) {
      return res.status(400).json({ message: "Enter your email.", type: 'error' })
    }
    if (!password) {
      return res.status(400).json({ message: 'Enter your password.', type: 'error' })
    }
    let isEmailExist = await userModel.findOne({ email: email })
    if (!isEmailExist) {
      return res.status(400).json({ message: "This email is not registered", type: "error" })
    }
    let comparePassword = await bcrypt.compare(password, isEmailExist.password)
    if (!comparePassword) {
      return res.status(400).json({ message: "Incorrect password !", type: 'error' })
    }
    let token = jwt.sign({
      id: isEmailExist._id,
      email: isEmailExist.email,
      role: isEmailExist.role
    }, process.env.SECRET_KEY)
    let data = isEmailExist.toObject()
    data.token = token;

    await userModel.findOneAndUpdate({ email: email }, {
      $set: {
        token: token
      }
    })

    return res.status(200).json({ message: "LoggedIn", type: 'success', data })

  } catch (error) {
    console.log('ERROR::', error)
    return res.status(500).json({ message: "Internal Server Error", type: 'error', error: error.message })
  }
}



exports.getHRorDeveloperDetails = async (req, res) => {
  try {
    var role = req.query.role;
    let selectedKeys = ['userName', 'email', 'profile', 'experience']
    if (!role) {
      return res.status(400).json({ message: "Role not present.", type: "error" })
    }
    role = role.toUpperCase()
    let details = await userModel.find({ role: role }).select(selectedKeys.join(' ')).lean().exec();
    return res.status(200).json({ details, type: "success" })
  } catch (error) {
    console.log("ERROR::", error)
    return res.status(500).json({ message: "Internal server error.", type: "error", error: error.message })
  }
}




exports.deleteUser = async (req, res) => {
  try {
    let userId = req.body.userId
    if (!userId) {
      return res.status(400).json({ message: "userId not present", type: 'error' })
    }
    let isUserExist = await userModel.findOne({ _id: userId })
    if (!isUserExist) {
      return res.status(400).json({ message: "User not found", type: "error" })
    }
    await userModel.findOneAndDelete({ _id: userId })
    return res.status(200).json({ message: "User deleted successfully.", type: "success" })
  } catch (error) {
    console.log('ERROR::', error)
    return res.status(500).json({ message: "Internal Server Error", type: 'error', error: error.message })
  }
}




exports.editUserDetails = async (req, res) => {
  try {
    let userId = req.body.userId;
    let userName = req.body.userName;
    let email = req.body.email;
    let profile = req.body.profile;
    let experience = req.body.experience

    if (!userId) {
      return res.status(400).json({ message: "UserId not found.", type: 'error' })
    }
    if (!userName) {
      return res.status(400).json({ message: "Please enter username", type: "error" })
    }
    if (!email) {
      return res.status(400).json({ message: "Please enter email", type: 'error' })
    }
    let isUserExist = await userModel.findOne({ _id: userId })
    if (!isUserExist) {
      return res.status(400).json({ message: "User data not found.", type: "error" })
    }
    if (isUserExist.role === 'DEVELOPER') {
      if (!profile) {
        return res.status(400).json({ message: "Please enter profile.", type: "error" })
      }
    }
    await userModel.findOneAndUpdate({ _id: userId }, {
      $set: {
        userName: userName,
        email: email,
        password: password,
        profile: profile,
        experience: experience
      }
    })
    return res.status(200).json({ message: "Document updated successfully.", type: "error" })
  } catch (error) {
    console.log("ERROR::", error)
    return res.status(500).json({ message: "Internal Server Error", type: 'error', error: error.message })
  }
}



exports.changePassword = async (req, res) => {
  try {
    let userId = req.result.id;
    let password = req.body.password;
    let confirmPassword = req.body.confirmPassword;
    let newPassword = req.body.newPassword
    if (!password) {
      return res.status(400).json({ message: "Enter password", type: "error" })
    }
    if (!newPassword) {
      return res.status(400).json({ message: "Enter new password", type: "error" })
    }
    if (!confirmPassword) {
      return res.status(400).json({ message: "Enter confirmPassword", type: "error" })
    }
    let userDetails = await userModel.findOne({ _id: userId })
    if (!userDetails) {
      return res.status(400).json({ message: "loggedIn user not found", type: "error" })
    }
    let isPassCorrect = await bcrypt.compare(password, userDetails.password)
    if (!isPassCorrect) {
      return res.status(400).json({ message: "Entered current password is not correct", type: "error" })
    }
    if (!(newPassword === confirmPassword)) {
      return res.status(400).json({ message: "confirm password do not match with new password", type: "error" })
    }
    let salt = await bcrypt.genSalt(10);
    let passhash = await bcrypt.hash(newPassword, salt)
    await userModel.findOneAndUpdate({ _id: userId }, {
      $set: {
        password: passhash,
      }
    })
    return res.status(200).json({ message: "password changed successfully", type: "success" })
  } catch (error) {
    console.log("ERROR::", error)
    return res.status(500).json({ message: "Internal Server Error.", type: 'error', error: error.message })
  }
}