
const languagesModel = require('../../model/languages');
const questionnaireModel = require('../../model/questions');
let seriesModel = require('../../model/series')
let mongoose = require('mongoose')


exports.createSeries = async (req, res) => {
    try {
        let seriesName = req.body.seriesName;
        let languageId = req.query.languageId
        let taskTime = req.body.taskTime
        if (!seriesName) {
            return res.status(400).json({ message: "Please enter series name.", type: "error" })
        }
        if(!languageId){
            return res.status(400).json({message:'Language is not present.',type:'error'})
        }
        if(!taskTime){
            return res.status(400).json({message:'Please enter task time.',type:"error"})
        }
        await seriesModel.create({ seriesName: seriesName,languageId:languageId,taskTime:taskTime })
        return res.status(200).json({ message: "series added successfully", type: "success" })
    } catch (error) {
        console.log('ERROR::', error)
        return res.status(500).json({ message: "Internal Server Error", type: "error", error: error.message })
    }
}



exports.updateSeries = async (req, res) => {
    try {
        let updateSeriesId = req.query.updateSeriesId;
        let updatedSeries = req.body.updatedSeries;
        let taskTime = req.body.taskTime

        if (!updateSeriesId) {
            return res.status(400).json({ message: "Series id not found", type: "error" })
        }
        if(!taskTime){
            return res.status(400).json({message:"Task time is not present.",type:'error'})
        }
        let isSeriesExist = await seriesModel.findOne({ _id: updateSeriesId })
        if (!isSeriesExist) {
            return res.status(400).json({ messge: "This series is not exist", type: "error" })
        }
        await seriesModel.findOneAndUpdate({ _id: updateSeriesId }, {
            $set: {
                seriesName: updatedSeries,
                taskTime:taskTime
            }
        })
        return res.status(200).json({ message: "Series updated successfully", type: "success" })
    } catch (error) {
        console.log("ERROR::", error)
        return res.status(500).json({ message: "Internal Server Error", type: 'error', error: error.message })
    }
}



exports.deleteSeries = async (req, res) => {
    try {
        let seriesId = req.query.seriesId;

        if (!seriesId) {
            return res.status(400).json({ message: 'seriesId not present', type: "error" })
        }
        let isSeriesExist = await seriesModel.findOne({ _id: seriesId })
        if (!isSeriesExist) {
            return res.status(400).json({ message: "Series not exist", type: "error" })
        }
        const updateOperation = {
            $pull: {
                subjective: { series_id: seriesId },
                objective: { series_id: seriesId },
                logical: { series_id: seriesId }
            }
        };

        // Update the document to remove the specified objects from arrays
        await questionnaireModel.updateOne({}, updateOperation)
        await seriesModel.findOneAndDelete({ _id: seriesId })
        return res.status(200).json({ message: "Selected series deleted successfully.", type: 'success' })
    } catch (error) {
        console.log("ERROR::", error)
        return res.status(500).json({ messge: "Internal server error", type: 'error', error: error.message })
    }
}



exports.getAllSeries = async (req, res) => {
    try {
        let languageId = req.query.languageId
        if(!languageId){
            return res.status(400).json({message:"language ID is missing",type:'error'})
        }
        var allSeries = await seriesModel.find({languageId:languageId}).lean();
       
        let language = await languagesModel.findOne({_id:languageId})

        for (const series of allSeries) {
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
                                cond: { $eq: ['$$item.series_id', new mongoose.Types.ObjectId(series._id)] }
                            }
                        },
                        objective: {
                            $filter: {
                                input: '$objective',
                                as: 'item',
                                cond: { $eq: ['$$item.series_id', new mongoose.Types.ObjectId(series._id)] }
                            }
                        },
                        logical: {
                            $filter: {
                                input: '$logical',
                                as: 'item',
                                cond: { $eq: ['$$item.series_id', new mongoose.Types.ObjectId(series._id)] }
                            }
                        }
                    }
                }
            ]);
            
            let status = "pending";
            if (questions.length > 0) {
                const [question] = questions;
                const hasEnoughQuestions = (
                    (question.objective.length >= 3) &&
                    (question.logical.length >= 2) &&
                    (question.subjective.length >= 2)
                );
                if (hasEnoughQuestions) {
                    status = "complete";
                }
            }
            series.status = status;
        }
     
        allSeries.reverse();
        return res.status(200).json({ allSeries, type: "success" });
    } catch (error) {
        console.log('ERROR::', error);
        return res.status(500).json({ message: "Internal server Error", type: 'error', error: error.message });
    }
}



exports.getSeries = async (req, res) => {
    try {
        let seriesId = req.query.seriesId;
        if (!seriesId) {
            return res.status(400).json({ message: 'Series id not present', type: "error" })
        }
        let series = await seriesModel.findOne({ _id: seriesId })
        return res.status(200).json({ series, type: 'success' })
    } catch (error) {
        console.log('ERROR::', error)
        return res.status(500).json({ message: "Internal server Error", type: 'error', error: error.message })
    }
}


exports.getAllseriesWithStatus = async (req, res) => {
    try {
        let languageId = req.body.languageId;
        await questionnaireModel.find({ languageId: languageId })
         
    } catch (error) {
        console.log('ERROR::', error)
        return res.status(500).json({ message: "Internal server Error", type: 'error', error: error.message })
    }
}