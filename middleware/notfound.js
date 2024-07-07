const notFound = (req,res,next)=>{
    res.status(404).send("<h1>404 ,page not found!!<\h1>");
}

module.exports = notFound;