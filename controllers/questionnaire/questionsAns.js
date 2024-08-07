let mongoose = require('mongoose');
let questionnaireModel = require('../../model/questions');
const userModel = require('../../model/user');
const languagesModel = require("../../model/languages");
const seriesModel = require('../../model/series');
const candidateModel = require('../../model/candidate');
const interviewsModal = require('../../model/interviews')
// const { link } = require('../../routes/routeV1');



exports.addObjective = async (req, res) => {
  try {
    let userId = req.result.id;
    let question = req.body.question;
    let options = req.body.options;
    let correctAnswer = req.body.correctAnswer;
    let seriesId = req.query.seriesId

    if (options.length < 4) {
      return res.status(400).json({ message: 'Please enter all four options', type: 'error' });
    }
    let isUserExist = await userModel.findOne({ _id: userId });

    if (!isUserExist) {
      return res.status(400).json({ message: "User does not exit.", type: 'error' });
    }
    let findLanguage = await languagesModel.findOne({ language: isUserExist.language });
    if (!findLanguage) {
      return res.status(400).json({ message: "Not able to find language.", type: 'error' });
    }
    let checkUpdateLanguageOrAdd = await questionnaireModel.findOne({ languageId: findLanguage._id })
    if (checkUpdateLanguageOrAdd) {
      await questionnaireModel.findOneAndUpdate(
        { languageId: findLanguage._id },
        {
          $push: {
            objective: {
              question: question,
              options: options,
              correctAnswer: correctAnswer,
              series_id: seriesId
            }
          }
        },
        { upsert: true }
      );
    } else {
      let questionnaireObj = {
        languageId: findLanguage._id,
        objective: {
          question: question,
          options: options,
          correctAnswer: correctAnswer,
          series_id: seriesId
        }
      };
      await questionnaireModel.create(questionnaireObj);
    }
    return res.status(200).json({ message: 'MCQ added successfully.', type: "success" });
  } catch (error) {
    console.log('ERROR::', error);
    return res.status(500).json({ message: "Internal Server Error", type: 'error', error: error.message });
  }
};





exports.addSubjective = async (req, res) => {
  try {
    let userId = req.result.id
    let question = req.body.question;
    let answer = req.body.answer;
    let seriesId = req.query.seriesId

    let isUserExist = await userModel.findOne({ _id: userId })
    if (!isUserExist) {
      return res.status(400).json({ message: "User does not exit.", type: 'error' })
    }
    let findLanguage = await languagesModel.findOne({ language: isUserExist.language })
    if (!findLanguage) {
      return res.status(400).json({ message: "Not able to find language.", type: 'error' })
    }
    let checkUpdateLanguageOrAdd = await questionnaireModel.findOne({ languageId: findLanguage._id })
    if (checkUpdateLanguageOrAdd) {
      await questionnaireModel.findOneAndUpdate({ languageId: findLanguage._id }, {
        $push: {
          subjective: {
            question: question,
            answer: answer,
            series_id: seriesId
          }
        },
      }, { upsert: true })
    } else {
      let subjectiveObj = {
        languageId: findLanguage._id,
        subjective: {
          question: question,
          answer: answer,
          series_id: seriesId
        }
      }
      await questionnaireModel.create(subjectiveObj)
    }

    return res.status(200).json({ message: 'subjective added successfully.', type: "success" })

  } catch (error) {
    console("ERROR::", error)
    return res.status(500).json({ message: "Internal Server Error", type: "error", error: error.message })
  }
}



exports.addLogical = async (req, res) => {
  try {
    let userId = req.result.id
    let question = req.body.question;
    let answer = req.body.answer;
    let seriesId = req.query.seriesId

    let isUserExist = await userModel.findOne({ _id: userId })
    if (!isUserExist) {
      return res.status(400).json({ message: "User does not exit.", type: 'error' })
    }
    let findLanguage = await languagesModel.findOne({ language: isUserExist.language })
    if (!findLanguage) {
      return res.status(400).json({ message: "Not able to find language.", type: 'error' })
    }
    let checkUpdateLanguageOrAdd = await questionnaireModel.findOne({ languageId: findLanguage._id })
    if (checkUpdateLanguageOrAdd) {
      await questionnaireModel.findOneAndUpdate({ languageId: findLanguage._id }, {
        $push: {
          logical: {
            question: question,
            answer: answer,
            series_id: seriesId
          }
        },
      }, { upsert: true })
    } else {
      let LogicalObj = {
        languageId: findLanguage._id,
        logical: {
          question: question,
          answer: answer,
          series_id: seriesId
        }
      }
      await questionnaireModel.create(LogicalObj)
    }

    return res.status(200).json({ message: 'Logical added successfully.', type: "success" })


  } catch (error) {
    console.log('ERROR::', error)
    return res.status(500).json({ message: 'Internal Server Error', type: 'error', error: error.message })
  }
}




exports.getQuestions = async (req, res) => {
  try {
    let userId = req.result.id

    let isUserExist = await userModel.findOne({ _id: userId })
    if (!isUserExist) {
      return res.status(400).json({ message: "User not found", type: "error" })
    }

    let findLanguage = await languagesModel.findOne({ language: isUserExist.language })
    if (!findLanguage) {
      return res.status(400).json({ message: "Not able to find language", type: 'error' })
    }
    let getMyLanguageQuestions = await questionnaireModel.find({ languageId: findLanguage._id })

    return res.status(200).json({ data: getMyLanguageQuestions, type: "success" })
  } catch (error) {
    console.log('ERROR::', error)
    return res.status(500).json({ message: "Internal Server Error", type: 'error', error: error.message })
  }
}



exports.getQuestionsSeriesWise = async (req, res) => {
  try {
    const userId = req.result.id;
    const seriesId = req.query.seriesId;

    if (!seriesId) {
      return res.status(400).json({ message: 'Series is not present', type: 'error' });
    }

    const isUserExist = await userModel.findOne({ _id: userId });
    if (!isUserExist) {
      return res.status(400).json({ message: 'User not exist.', type: 'error' });
    }

    const language = await languagesModel.findOne({ language: isUserExist.language });
    if (!language) {
      return res.status(400).json({ message: `Can't find language ${isUserExist.language}`, type: 'error' });
    }
    const series = await seriesModel.findOne({ _id: seriesId })

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

    return res.status(200).json({ questions: questions[0], type: 'success' });
  } catch (error) {
    console.log('ERROR:', error);
    return res.status(500).json({ message: 'Internal Server Error', type: 'error', error: error.message });
  }
};




exports.updateQuestionAnswer = async (req, res) => {
  try {
    const questionType = req.body.questionType;
    const questionId = req.query.questionId;

    const filter = {};
    filter[`${questionType}._id`] = questionId;


    let updateOperation = {};

    if (questionType === 'objective') {
      const { question, options, correctAnswer } = req.body;
      if (!question) {
        return res.status(400).json({ message: "Please enter question", type: 'error' })
      }
      if (!options) {
        return res.status(400).json({ message: "Please enter options", type: 'error' })
      }
      if (options.length < 4) {
        return res.status(400).json({ message: "Please enter all four options", type: "error" })
      }
      if (!correctAnswer) {
        return res.status(400).json({ message: "Correct answer not present", type: 'error' })
      }
      updateOperation = {
        $set: {
          [`${questionType}.$[elem].question`]: question,
          [`${questionType}.$[elem].options`]: options,
          [`${questionType}.$[elem].correctAnswer`]: correctAnswer
        }
      };
    } else if (questionType === 'subjective' || questionType === 'logical') {

      const { question, answer } = req.body;

      if (!question) {
        return res.status(400).json({ message: "Please enter question", type: 'error' })
      }
      if (!answer) {
        return res.status(400).json({ message: "Answer not present", type: "error" })
      }
      updateOperation = {
        $set: {
          [`${questionType}.$[elem].question`]: question,
          [`${questionType}.$[elem].answer`]: answer
        }
      };
    } else {
      return res.status(400).json({ message: `Invalid question type: ${questionType}`, type: 'error' });
    }


    const options = {
      arrayFilters: [{ 'elem._id': questionId }],
      new: true,
      upsert: false
    };


    const updatedDocument = await questionnaireModel.findOneAndUpdate(filter, updateOperation, options);

    if (!updatedDocument) {
      return res.status(404).json({ message: `Document with id ${questionId} not found in ${questionType}`, type: 'error' });
    }

    return res.status(200).json({ message: `Document with id ${questionId} updated successfully in ${questionType}`, updatedDocument, type: 'success' });
  } catch (error) {
    console.log("ERROR::", Error)
    return res.status(500).json({ message: "Internal Server Error", type: 'error', error: error.message })
  }
}





exports.DeleteQuestionAnswer = async (req, res) => {
  try {
    const questionType = req.body.questionType;
    const questionId = req.query.questionId;

    if (!questionId) {
      return res.status(400).json({ message: "Question id not present.", type: "error" });
    }

    if (!questionType) {
      return res.status(400).json({ message: "Question type is not present", type: 'error' });
    }


    const filter = {};
    filter[`${questionType}._id`] = questionId;


    const updateOperation = {
      $pull: {
        [questionType]: { _id: questionId }
      }
    };

    const updatedDocument = await questionnaireModel.findOneAndUpdate(filter, updateOperation, { new: true });

    if (!updatedDocument) {
      return res.status(404).json({ message: `Document with id ${questionId} not found in ${questionType}`, type: 'error' });
    }

    return res.status(200).json({ message: `Document with id ${questionId} deleted successfully from ${questionType}`, type: 'success' });
  } catch (error) {
    console.error('Error deleting document:', error);
    return res.status(500).json({ message: 'Internal Server Error', type: 'error', error: error.message });
  }

}



exports.generateLink = async (req, res) => {
  try {
    let languageId = req.query.languageId
    let seriesId = req.query.seriesId

    if(!languageId){
      return res.status(400).json({message:"Language Id missing.",type:'error'})
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
    // const link = `${req.protocol}://${req.get('host')}/questions?languageId=${languageId}&seriesId=${seriesId}`;
    return res.status(200).json({questions})
  } catch (error) {
    console.log('ERROR::', error)
    return res.status(500).json({ message: "Internal Server Error", type: 'error' })
  }
}










