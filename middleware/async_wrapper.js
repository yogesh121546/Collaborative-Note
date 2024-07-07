const async_wrapper = (fn)=>{
    return async (req,res,next)=>{
        try {
            await fn(req,res,next);
           
        }catch(err){
            next(err);
        }
    }
} 

module.exports= async_wrapper;