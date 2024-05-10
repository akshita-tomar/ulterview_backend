
let seriesModel = require('../../model/series')


exports.createSeries = async(req,res)=>{
    try{
     let seriesName = req.body.seriesName;
     if(!seriesName){
        return res.status(400).json({message:"Please enter series name.",type:"error"})
     }
     await seriesModel.create({seriesName:seriesName})
     return res.status(200).json({message:"series added successfully",type:"success"})
    }catch(error){
     console.log('ERROR::',error)
     return res.status(500).json({message:"Internal Server Error",type:"error",error:error.message})
    }
}



exports.updateSeries = async (req,res)=>{
    try{
     let updateSeriesId = req.query.updateSeriesId;
     let updatedSeries = req.body.updatedSeries;
     if(!updateSeriesId){
        return res.status(400).json({message:"Series id not found",type:"error"})
     }
     let isSeriesExist = await seriesModel.findOne({_id:updateSeriesId})
     if(!isSeriesExist){
        return res.status(400).json({messge:"This series is not exist",type:"error"})
     }
     await seriesModel.findOneAndUpdate({_id:updateSeriesId},{
        $set:{
            seriesName:updatedSeries
        }
     })
     return res.status(200).json({message:"Series updated successfully",type:"success"})
    }catch(error){
        console.log("ERROR::",error)
        return res.status(500).json({message:"Internal Server Error", type:'error',error:error.message})
    }
}



exports.deleteSeries = async(req,res)=>{
    try{
      let seriesId = req.query.seriesId;
     
      if(!seriesId){
        return res.status(400).json({message:'seriesId not present',type:"error"})
      }
      let isSeriesExist = await seriesModel.findOne({_id:seriesId})
      if(!isSeriesExist){
        return res.status(400).json({message:"Series not exist",type:"error"})
      }
      await seriesModel.findOneAndDelete({_id:seriesId})
      return res.status(200).json({message:"Selected series deleted successfully.",type:'success'})
    }catch(error){
        console.log("ERROR::",error)
        return res.status(500).json({messge:"Internal server error",type:'error',error:error.message})
    }
}



exports.getAllSeries = async(req,res)=>{
    try{
     let allSeries = await seriesModel.find()
     return res.status(200).json({allSeries,type:"success"})
    }catch(error){
        console.log('ERROR::',error)
        return res.status(500).json({message:"Internal server Error",type:'error',error:error.message})
    }
}

exports.getSeries = async(req,res)=>{
    try{
     let seriesId = req.query.seriesId;
     if(!seriesId){
        return res.status(400).json({message:'Series id not present',type:"error"})
     }
     let series = await seriesModel.findOne({_id:seriesId})
     return res.status(200).json({series,type:'success'})
    }catch(error){
        console.log('ERROR::',error)
        return res.status(500).json({message:"Internal server Error",type:'error',error:error.message})
    }
}