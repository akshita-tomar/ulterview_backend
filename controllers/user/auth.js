
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
      html: `
      <div style="padding: 20px; font-family: Arial, sans-serif; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 8px; overflow: hidden; background-color: #fff;">
              <div style="background-color: #007bff; color: white; padding: 20px; text-align: center;">
                  <h2 style="margin: 0;">Welcome to the part of Ultivic interview portal.</h2>
              </div>
              <div style="padding: 20px;">
                  <p style="font-size: 16px; line-height: 1.5;">
                      Hello ,
                  </p>
                    <p style="font-size: 16px; line-height: 1.5;">
                      This is the mail from ultivic technologies.Welcome to our interview portal please visit this link http://16.171.41.223/ and login to move forward with us.
                  </p>
                  <p style="font-size: 16px; line-height: 1.5;">
                       <strong> ${email}</strong> this is your email. 
                  </p>
                   <p style="font-size: 16px; line-height: 1.5;">
                       <strong>${password}</strong> this is your password.
                  </p>
                   
                  <p style="font-size: 16px; line-height: 1.5;">
                      Please keep these credentials safe and you can login to our interview platform through this. If you want to change that password you can do it by the option (change password).
                  </p>
                  <p style="font-size: 16px; line-height: 1.5;">
                      Thank you.
                  </p>
              </div>
              <div style="background-color: #f8f8f8; padding: 10px; text-align: center;">
                  <p style="margin: 0; font-size: 12px; color: #888;">&copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
              </div>
          </div>
      </div>
  `
    }
    transporter.sendMail(mailDetails,
      (error, data) => {
        if (error) {
          return res.status(400).json({ message: "Something went wrong", type: "error", data: error })
        } else {
          return res.status(200).json({ message: "Registration successfull! Login credentials has been sent to " + userName, type: "success" })
        }
      })
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



// exports.getHRorDeveloperDetails = async (req, res) => {
//   try {
//     var role = req.query.role;
//     let search = req.query.search

//     const { page = 1, limit = 10 } = req.query; 
//     let selectedKeys = ['userName', 'email', 'profile', 'experience', 'role']
//     if (!role) {
//       return res.status(400).json({ message: "Role not present.", type: "error" })
//     }
//     role = role.toUpperCase()

//     let details = await userModel
//       .find({ role: role })
//       .sort({ _id: -1 }) 
//       .select(selectedKeys.join(' '))
//       .skip((page - 1) * limit) 
//       .limit(Number(limit)) 
//       .lean()
//       .exec();

//     const totalDetails = await userModel.countDocuments({ role: role }); 

//     return res.status(200).json({
//       details,
//       totalDetails,
//       totalPages: Math.ceil(totalDetails / limit),
//       currentPage: Number(page),
//       type: "success"
//     });
//   } catch (error) {
//     console.log("ERROR::", error)
//     return res.status(500).json({message:"Internal Server error.",type:'error',error:error.message})
//    }
// }

exports.getHRorDeveloperDetails = async (req, res) => {
  try {
    let { role, search, page = 1, limit = 10 } = req.query;
    const selectedKeys = ['userName', 'email', 'profile', 'experience', 'role'];

    if (!role) {
      return res.status(400).json({ message: "Role not present.", type: "error" });
    }

    role = role.toUpperCase();

    let searchCondition = {};

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      searchCondition = {
        $or: selectedKeys.map((key) => ({
          [key]: searchRegex
        }))
      };
    }

    let details = await userModel
      .find({ role: role, ...searchCondition })
      .sort({ _id: -1 })
      .select(selectedKeys.join(' '))
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean()
      .exec();

    const totalDetails = await userModel.countDocuments({ role: role, ...searchCondition });

    return res.status(200).json({
      details,
      totalDetails,
      totalPages: Math.ceil(totalDetails / limit),
      currentPage: Number(page),
      type: "success"
    });
  } catch (error) {
    console.log("ERROR::", error);
    return res.status(500).json({ message: "Internal Server error.", type: 'error', error: error.message });
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
    let username = req.body.username;
    let profile = req.body.profile;
    let experience = req.body.experience

    // if (!userId) {
    //   return res.status(400).json({ message: "UserId not found.", type: 'error' })
    // }
    // if (!username) {
    //   return res.status(400).json({ message: "Please enter username", type: "error" })
    // }
    let isUserExist = await userModel.findOne({ _id: userId })
    if (!isUserExist) {
      return res.status(400).json({ message: "User data not found.", type: "error" })
    }
    // if (!experience) {
    //   return res.status(400).json({ message: "Please enter experience.", type: 'error' })
    // }

    if (isUserExist.role === 'DEVELOPER') {
      if (!profile) {
        return res.status(400).json({ message: "Please enter profile.", type: "error" })
      }
    }
    await userModel.findOneAndUpdate({ _id: userId }, {
      $set: {
        userName: username,
        profile: profile,
        experience: experience
      }
    })
    return res.status(200).json({ message: "Document updated successfully.", type: "success" })
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