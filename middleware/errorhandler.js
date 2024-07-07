const customError = require('../errors/custom-error')
const {StatusCodes}= require('http-status-codes');
const errorHandler = (err,req,res,next)=>{
    if(err instanceof customError){
        if(err.message=="signin"){
            console.log(err);
            return res.status(403).render('login');
        }
        console.log(err);
        return res.status(err.statusCode).json({msg:err.message})
    }
    
    console.log(err.message)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error:err.message}); 
}

module.exports= errorHandler; 