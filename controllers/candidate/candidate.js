let candidateModel = require('../../model/candidate');
const languagesModel = require('../../model/languages');
const seriesModel = require('../../model/series')
const questionnaireModel = require("../../model/questions")
const interviewsModal = require("../../model/interviews")
const mongoose = require("mongoose")
let nodemailer = require('nodemailer')
let userModel = require('../../model/user')
let { io } = require('../../index')
require('dotenv').config();



exports.registerCandidate = async (req, res) => {
  try {
    let username = req.body.username;
    let email = req.body.email;
    let profile = req.body.profile;
    let experience = req.body.experience;
    let languageId = req.body.languageId
    let emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;


    if (!username) {
      return res.status(400).json({ message: "Please provide username.", type: "error" })
    }
    if (!email) {
      return res.status(400).json({ message: "Please provide email.", type: 'error' })
    }
    if (!(emailFormat.test(email))) {
      return res.status(400).json({ message: 'Please enter correct email format.', type: 'error' })
    }
    if (!profile) {
      return res.status(400).json({ message: "Please provide profile.", type: "error" })
    }
    if (!languageId) {
      return res.status(400).json({ message: "Language Id is missing.", type: "error" })
    }
    let isLanguageExist = await languagesModel.findOne({ _id: languageId })
    if (!isLanguageExist) {
      return res.status(400).json({ message: "language dosen't exist with this Id.", type: "error" })
    }
    if (!experience) {
      return res.status(400).json({ message: "Please provide experience.", type: "error" })
    }

    let obj = {
      username: username,
      email: email,
      profile: profile,
      experience: experience,
      languageId: languageId
    }

    await candidateModel.create(obj)
    return res.status(200).json({ message: 'Candidate registered successfully.', type: "success" })

  } catch (error) {
    console.log('ERROR::', error)
    return res.status(500).json({ message: "Internal Server Error", type: "error", error: error.message })
  }
}




// exports.getCandidates = async (req, res) => {
//   try {
//     const { page = 1, limit = 10 } = req.query;
//     const search = req.query.search

//     const allCandidates = await candidateModel
//       .find()
//       .sort({ _id: -1 })
//       .skip((page - 1) * limit)
//       .limit(Number(limit));

//     const totalCandidates = await candidateModel.countDocuments();

//     return res.status(200).json({
//       allCandidates,
//       totalCandidates,
//       totalPages: Math.ceil(totalCandidates / limit),
//       currentPage: Number(page),
//       type: 'success',
//     });
//   } catch (error) {
//     console.log('ERROR::', error)
//     return res.status(500).json({ message: "Internal Server Error", type: "error", error: error.message })
//   }
// };



// exports.getCandidates = async (req, res) => {
//   try {
//     const { page = 1, limit = 10, search = '',selectedField='',selectedStatus=''} = req.query;

 
//     const searchQuery = search
//     ? {
//         $or: [
//           { username: { $regex: search, $options: 'i' } },
//           { email: { $regex: search, $options: 'i' } },
//           { profile: { $regex: search, $options: 'i' } },
//           { experience: { $regex: search, $options: 'i' } },
//           { hrRoundStatus: { $regex: search, $options: 'i' } },
//           { testStatus: { $regex: search, $options: 'i' } },
//           { resultStatus: { $regex: search, $options: 'i' } }
//         ]
//       }
//     : {};
  

//     const allCandidates = await candidateModel
//       .find(searchQuery)
//       .sort({ _id: -1 })
//       .skip((page - 1) * limit)
//       .limit(Number(limit));

//     const totalCandidates = await candidateModel.countDocuments(searchQuery);

//     return res.status(200).json({
//       allCandidates,
//       totalCandidates,
//       totalPages: Math.ceil(totalCandidates / limit),
//       currentPage: Number(page),
//       type: 'success',
//     });
//   } catch (error) {
//     console.log('ERROR::', error);
//     return res.status(500).json({ message: "Internal Server Error", type: "error", error: error.message });
//   }
// };



exports.getCandidates = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', selectedField = '', selectedStatus = '' } = req.query;

    let searchQuery = {};

    if (search) {
      searchQuery = {
        $or: [
          { username: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { profile: { $regex: search, $options: 'i' } },
          { experience: { $regex: search, $options: 'i' } },
          { hrRoundStatus: { $regex: search, $options: 'i' } },
          { testStatus: { $regex: search, $options: 'i' } },
          { resultStatus: { $regex: search, $options: 'i' } }
        ]
      };
    }

    // Apply filtering based on selectedField and selectedStatus
    if (selectedField && selectedStatus) {
      switch (selectedField.toLowerCase()) {
        case 'hr':
          searchQuery.hrRoundStatus = { $regex: selectedStatus, $options: 'i' };
          break;
        case 'technical':
          searchQuery.testStatus = { $regex: selectedStatus, $options: 'i' };
          break;
        case 'final':
          searchQuery.resultStatus = { $regex: selectedStatus, $options: 'i' };
          break;
        default:
          break;
      }
    }

    const allCandidates = await candidateModel
      .find(searchQuery)
      .sort({ _id: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalCandidates = await candidateModel.countDocuments(searchQuery);

    return res.status(200).json({
      allCandidates,
      totalCandidates,
      totalPages: Math.ceil(totalCandidates / limit),
      currentPage: Number(page),
      type: 'success',
    });
  } catch (error) {
    console.log('ERROR::', error);
    return res.status(500).json({ message: "Internal Server Error", type: "error", error: error.message });
  }
};










exports.getSingleCandidate = async (req, res) => {
  try {
    let candidateId = req.query.candidateId;
    if (!candidateId) {
      return res.status(400).json({ message: "Candidate id is missing.", type: 'error' })
    }
    let isCandidateExist = await candidateModel.findOne({ _id: candidateId })
    if (!isCandidateExist) {
      return res.status(400).json({ message: "Candidate dosen't exist.", type: "error" })
    }
    return res.status(200).json({ isCandidateExist, type: 'success' })
  } catch (error) {
    console.log("ERROR::", error)
    return res.status(500).json({ message: "Internal Server Error", type: "error", error: error.message })
  }
}


exports.deleteCandidate = async (req, res) => {
  try {
    let candidateId = req.query.candidateId;
    if (!candidateId) {
      return res.status(400).json({ message: "Candidate Id is missing.", type: 'error' })
    }
    let isCandidateExist = await candidateModel.findOne({ _id: candidateId })
    if (!isCandidateExist) {
      return res.status(400).json({ message: "Candidate doesn't exist.", type: 'error' })
    }
    await candidateModel.findOneAndDelete({ _id: candidateId })
    return res.status(200).json({ message: "Candidate deleted successfully", type: 'success' })
  } catch (error) {
    console.log('ERROR::', error)
    return res.status(500).json({ message: "Internal Server Error", type: 'error', error: error.message })
  }
}


exports.updateCandidate = async (req, res) => {
  try {
    let candidateId = req.query.candidateId;
    let { username, email, profile, experience, languageId } = req.body
    let emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (!candidateId) {
      return res.status(400).json({ message: "Please provide candidate Id.", type: 'error' })
    }
    if (!username) {
      return res.status(400).json({ message: "Please enter candidate's name.", type: 'error' })
    }
    if (!email) {
      return res.status(400).json({ message: "Please enter candidate's email", type: 'error' })
    }
    if (!(emailFormat.test(email))) {
      return res.status(400).json({ message: 'Please enter correct email format.', type: 'error' })
    }
    if (!profile) {
      return res.status(400).json({ message: "Please enter candidate's job profile.", type: 'error' })
    }
    if (!languageId) {
      return res.status(400).json({ message: "Language Id is missing.", type: "error" })
    }
    let isLanguageExist = await languagesModel.findOne({ _id: languageId })
    if (!isLanguageExist) {
      return res.status(400).json({ message: "language dosen't exist with this Id.", type: "error" })
    }
    if (!experience) {
      return res.status(400).json({ message: "Please enter candidate's exprience.", type: 'error' })
    }

    let isCandidateExist = await candidateModel.findOne({ _id: candidateId })
    if (!isCandidateExist) {
      return res.status(400).json({ message: "Candidate doesn't exist.", type: 'error' })
    }
    await candidateModel.findOneAndUpdate({ _id: candidateId }, {
      $set: {
        username: username,
        email: email,
        profile: profile,
        experience: experience,
        languageId: languageId
      }
    })
    return res.status(200).json({ message: "Candidate's document updated successfully.", type: 'success' })

  } catch (error) {
    console.log('ERROR::', error)
    return res.status(500).json({ message: "Internal Server Error", type: 'error', error: error.message })
  }
}




exports.sendInterviewLink = async (req, res) => {
  try {
    let seriesId = req.query.seriesId;
    let candidateId = req.query.candidateId;

    if (!candidateId) {
      return res.status(400).json({ message: "Candidate Id not present.", type: 'error' })
    }
    let isCandidateExist = await candidateModel.findOne({ _id: candidateId })
    if (!isCandidateExist) {
      return res.status(400).json({ message: "Candidate doesn't exist.", type: "error" })
    }
    if (!seriesId) {
      return res.status(400).json({ message: "Series Id not present.", type: 'error' })
    }
    let isSeriesExist = await seriesModel.findOne({ _id: seriesId })

    if (!isSeriesExist) {
      return res.status(400).json({ message: "Series doesn't exist.", type: "error" })
    }
    await candidateModel.findOneAndUpdate({ _id: candidateId }, {
      seriesId: seriesId
    })

    let languageId = isCandidateExist.languageId

    if (!languageId) {
      return res.status(400).json({ message: "Language Id missing.", type: 'error' })
    }
    let language = await languagesModel.findOne({ _id: languageId })

    const questions = await questionnaireModel.aggregate([
      {
        $match: { languageId: language._id }
      },
      {
        $project: {
          subjective: {
            $filter: {
              input: '$subjective',
              as: 'item',
              cond: { $eq: ['$$item.series_id', new mongoose.Types.ObjectId(seriesId)] }
            }
          },
          objective: {
            $filter: {
              input: '$objective',
              as: 'item',
              cond: { $eq: ['$$item.series_id', new mongoose.Types.ObjectId(seriesId)] }
            }
          },
          logical: {
            $filter: {
              input: '$logical',
              as: 'item',
              cond: { $eq: ['$$item.series_id', new mongoose.Types.ObjectId(seriesId)] }
            }
          }
        }
      }
    ]);

    if (
      questions.length === 0 ||
      (questions[0].subjective.length === 0 && questions[0].objective.length === 0 && questions[0].logical.length === 0)
    ) {
      return res.status(400).json({ message: "No questions found", type: 'error' });
    }
    let isEntryExist = await interviewsModal.findOne({ candidateId: candidateId })

    if (isEntryExist) {
      await interviewsModal.findOneAndUpdate({ candidateId: candidateId }, {
        $set: {
          providedQuesAns: questions
        }
      })
    } else {
      await interviewsModal.create({ candidateId: candidateId, providedQuesAns: questions })
    }
    await candidateModel.findOneAndUpdate({ _id: candidateId }, {
      $set: {
        testStatus: 'invite_sent'
      }
    })
    io.emit('interview_result_submitted')
    return res.status(200).json({ message: "candidate details added successfully", type: 'success' })
  } catch (error) {
    console.log("ERROR::", error)
    return res.status(500).json({ message: "Internal Server Error.", type: 'error', error: error.message })
  }
}


exports.getInterviewQuestions = async (req, res) => {
  try {
    let candidateId = req.query.candidateId
    if (!candidateId) {
      return res.status(400).json({ message: "Not able to get candidate Id,", type: 'error' })
    }
    let isCandidateExist = await candidateModel.findOne({ _id: candidateId })
    if (!isCandidateExist) {
      return res.status(400).json({ message: "Candidate dosen't exist.", type: 'error' })
    }
    let series = await seriesModel.findOne({ _id: isCandidateExist.seriesId })
    let time = series.taskTime
    let candidate = await interviewsModal.findOne({ candidateId: candidateId })
    let questions = candidate.providedQuesAns
    let linkClickedCount = candidate.linkClickedCount
    let completedStatus = isCandidateExist.testStatus
    return res.status(200).json({ time, completedStatus, questions, linkClickedCount, type: "success" })
  } catch (error) {
    console.log('ERROR::', error)
    return res.status(500).json({ message: "Internal Server Error", type: 'error', error: error.message })
  }
}




exports.sendLinkViaEmail = async (req, res) => {
  try {
    let candidateId = req.query.candidateId
    let link = req.body.link

    if (!link) {
      return res.status(400).json({ message: "Link is not present.", type: "error" })
    }
    if (!candidateId) {
      return res.status(400).json({ message: "Candidate id not present.", type: "error" })
    }
    let isCandidateExist = await candidateModel.findOne({ _id: candidateId })
    if (!isCandidateExist) {
      return res.status(400).json({ message: "Candidate doesn't exist.", type: "error" })
    }
    let email = isCandidateExist.email
    let transporter = nodemailer.createTransport({
      // host: "smtp.zoho.in",
      // port: 465,                                                                                      
      // secure: true,

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
      text: 'Interview link',
      html: "<div style='padding:30px; text-align:center; color:black'> <h2> " + link + "</h2></div>"
    }
    transporter.sendMail(mailDetails,
      (error, data) => {
        if (error) {
          return res.status(400).json({ message: "Something went wrong", type: "error", data: error })
        } else {
          return res.status(200).json({ message: " Interview link has been sent to " + isCandidateExist.username, type: "success" })
        }
      })
  } catch (error) {
    console.log('ERROR::', error)
    return res.status(500).json({ message: "Internal Server Error", type: 'error', error: error.message })
  }
}




exports.handleResendLink = async (req, res) => {
  try {
    let candidateId = req.body.candidateId;
    if (!candidateId) {
      return res.status(400).json({ message: "Candidate Id not present.", type: 'error' })
    }
    let isCandidateExist = await candidateModel.findOne({ _id: candidateId })
    if (!isCandidateExist) {
      return res.status(400).json({ message: "Candidate doesn't exist.", type: 'error' })
    }
    let checkCandidateInterview = await interviewsModal.findOne({ candidateId: candidateId })
    if (!checkCandidateInterview) {
      return res.status(400).json({ message: "Interview doesn't exist with this cadidate", type: "error" })
    }
    await candidateModel.findOneAndUpdate({ _id: candidateId }, {
      resultStatus: 'pending',
      testStatus: 'pending',
      hrRoundStatus: 'pending'
    })
    await interviewsModal.findOneAndUpdate({ candidateId: candidateId }, {
      $set: {
        linkClickedCount: 0,
        hrRoundLinkClickedCount: 0
      }
    })
    io.emit('interview_result_submitted')
    return res.status(200).json({ message: "State updated successfully.", type: 'success' })
  } catch (error) {
    console.log('ERROR::', error)
    return res.status(500).json({ message: "Internal Server Error", type: 'error', error: error.message })
  }
}


exports.inviteAccepted = async (req, res) => {
  try {
    let candidateId = req.body.candidateId;
    if (!candidateId) {
      return res.status(400).json({ message: "Candidate Id not found.", type: "error" })
    }
    let isCandidateExist = await candidateModel.findOne({ _id: candidateId })
    if (!isCandidateExist) {
      return res.status(400).json({ message: "Candidate not found.", type: "error" })
    }
    await candidateModel.findOneAndUpdate({ _id: candidateId }, {
      $set: {
        testStatus: 'invite_accepted'
      }
    })
    let interview = await interviewsModal.findOne({ candidateId: candidateId })
    console.log(interview.linkClickedCount)
    await interviewsModal.findOneAndUpdate({ candidateId: candidateId }, {
      $set: {
        testStartedAt: new Date(),
        linkClickedCount: interview.linkClickedCount + 1
      }
    })
    let updatedInterview = await interviewsModal.findOne({ candidateId: candidateId })
    let linkClickedCount = updatedInterview.linkClickedCount
    io.emit('Interview_submitted')
    return res.status(200).json({ message: 'Invite accepted', linkClickedCount, type: "success" })
  } catch (error) {
    console.log("ERROR::", error)
    return res.status(500).json({ message: "Internal Server Error", type: "error", error: error.message })
  }
}



exports.testCompleted = async (req, res) => {
  try {
    let candidateId = req.body.candidateId;
    if (!candidateId) {
      return res.status(400).json({ message: "Candidate Id not found.", type: "error" })
    }
    let isCandidateExist = await candidateModel.findOne({ _id: candidateId })
    if (!isCandidateExist) {
      return res.status(400).json({ message: "Candidate not found.", type: "error" })
    }
    await candidateModel.findOneAndUpdate({ _id: candidateId }, {
      $set: {
        testStatus: 'completed'
      }
    })
    await interviewsModal.findOneAndUpdate({ candidateId: candidateId }, {
      $set: {
        testEndedAt: new Date()
      }
    })
    return res.status(200).json({ message: 'Test Completed', type: "success" })
  } catch (error) {
    console.log("ERROR::", error)
    return res.status(500).json({ message: "Internal Server Error", type: "error", error: error.message })
  }
}


exports.addCandidateAnswers = async (req, res) => {
  try {
    let candidateId = req.body.candidateId;
    let quesAns = req.body.quesAns;
    let endTime = req.body.endTime


    if (!candidateId) {
      return res.status(400).json({ message: "Candidate Id not present!", type: "error" })
    }
    if (!quesAns) {
      return res.status(400).json({ message: "Please enter answers.", type: "error" })
    }
    let checkSubmittedAnsLength = quesAns.objective.length + quesAns.subjective.length + quesAns.logical.length

    let isCandidateExist = await candidateModel.findOne({ _id: candidateId })
    if (!isCandidateExist) {
      return res.status(400).json({ message: "Candidate not found", type: "error" })
    }

    let candidateInterview = await interviewsModal.findOne({ candidateId: candidateId })
    if (!candidateInterview) {
      return res.status(400).json({ message: "Candidate not found in interview.", type: "error" })
    }

    await interviewsModal.findOneAndUpdate({ candidateId: candidateId }, {
      $set: {
        retrivedQuesAns: quesAns,
        testEndedAt: endTime,
        linkClickedCount: 0
      }
    })

    if (checkSubmittedAnsLength < 1) {
      await candidateModel.findOneAndUpdate({ _id: candidateId }, {
        $set: {
          testStatus: 'completed',
          resultStatus: 'rejected'
        }
      })
      await interviewsModal.findOneAndUpdate({ candidateId: candidateId }, {
        $set: {
          checkedBy: null,
          totalCorrectQuestions: 0,
          checkedAnswerSheet: null
        }
      })
    } else {
      await candidateModel.findOneAndUpdate({ _id: candidateId }, {
        $set: {
          testStatus: 'completed',
          resultStatus: 'pending'
        }
      })
    }

    io.emit('Interview_submitted')
    io.emit('interview_result_submitted')
    return res.status(200).json({ message: "Interview completed!", type: "success" })
  } catch (error) {
    console.log("ERROR::", error)
    return res.status(500).json({ message: "Internal Server Error", type: "error", error: error.message })
  }
}




exports.getCandidatebyLanguage = async (req, res) => {
  try {
    const { languageId, search } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;


  
    let query = { testStatus: 'completed' };

   
    if (languageId) {
      const isLanguageExist = await languagesModel.findOne({ _id: languageId });
      if (!isLanguageExist) {
        return res.status(400).json({ message: "Language doesn't exist", type: 'error' });
      }
      query.languageId = languageId;
    }

    
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { profile: { $regex: search, $options: 'i' } },
        { experience: { $regex: search, $options: 'i' } },
        { resultStatus: { $regex: search, $options: 'i' } },

      ];
    }

   
    const candidates = await candidateModel.find(query)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);

    
    const totalCount = await candidateModel.countDocuments(query);

    return res.status(200).json({ candidates, totalCount, page, limit, type: "success" });
  } catch (error) {
    console.log("ERROR::", error);
    return res.status(500).json({ message: "Internal Server Error", type: 'error', error: error.message });
  }
};





exports.getAllQuesAns = async (req, res) => {
  try {
    let candidatId = req.query.candidatId
    if (!candidatId) {
      return res.status(400).json({ message: 'Candidate Id not found', type: "error" })
    }
    let isCandidateExist = await candidateModel.findOne({ _id: candidatId })
    if (!isCandidateExist) {
      return res.status(400).json({ message: "Candidate dosen't exist", type: "error" })
    }
    let quesAns = await interviewsModal.findOne({ candidateId: candidatId })
    if (!quesAns) {
      return res.status(400).json({ message: "No candidate found by this id in Interview", type: 'error' })
    }
    return res.status(200).json({ quesAns, type: "success" })
  } catch (error) {
    console.log("ERROR::", error)
    return res.status(500).json({ message: "Internal Server Error", type: "error", error: error.message })
  }
}


exports.addCheckedSheet = async (req, res) => {
  try {
    let candidateId = req.body.candidateId
    let totalQuestions = req.body.totalQuestions;
    let totalCorrectQuestions = req.body.totalCorrectQuestions;
    let checkedAnswerSheet = req.body.checkedAnswerSheet;
    let checkedBy = req.result.id
    console.log("correct ans----", totalCorrectQuestions)
    if (!candidateId) {
      return res.status(400).json({ message: "Candidate Id not present", type: 'error' })
    }
    if (!totalQuestions) {
      return res.status(400).json({ message: "Total questions not present", type: "error" })
    }
    if (!totalCorrectQuestions === undefined || totalCorrectQuestions === null) {
      return res.status(400).json({ message: "Correct answer not present", type: "error" })
    }
    if (!checkedAnswerSheet) {
      return res.status(400).json({ message: "Checked answersheet not present.", type: "error" })
    }
    let developer = await userModel.findOne({ _id: checkedBy })
    let isCandidateExist = await candidateModel.findOne({ _id: candidateId })
    if (!isCandidateExist) {
      return res.status(400).json({ message: "Candidate not exist", type: 'error' })
    }
    let isCandidateInterviewExist = await interviewsModal.findOne({ candidateId: candidateId })
    if (!isCandidateInterviewExist) {
      return res.status(400).json({ message: "Candidate interview not exist.", type: 'error' })
    }
    let testStatus = (totalCorrectQuestions / totalQuestions) * 100

    let passedOrFailed
    if (testStatus < 60) {
      passedOrFailed = "rejected"
    } else {
      passedOrFailed = "selected"
    }

    await interviewsModal.findOneAndUpdate({ candidateId: candidateId }, {
      $set: {
        totalQuestion: totalQuestions,
        totalCorrectQuestions: totalCorrectQuestions,
        checkedAnswerSheet: checkedAnswerSheet,
        checkedBy: developer.userName
      }
    })
    await candidateModel.findOneAndUpdate({ _id: candidateId }, {
      $set: {
        resultStatus: passedOrFailed
      }
    })
    io.emit('Interview_submitted')
    io.emit('interview_result_submitted')
    return res.status(200).json({ message: "Answer sheet marked checked.", type: "success" })
  } catch (error) {
    console.log("ERROR::", error)
    return res.status(500).json({ message: "Internal Server Error", type: "error", error: error.message })
  }
}



