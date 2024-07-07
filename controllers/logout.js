
const async_wrapper = require("../middleware/async_wrapper");
const user = require("../models/user");
const customError = require("../errors/custom-error");
const { StatusCodes } = require("http-status-codes");

const logout = async_wrapper(async(req,res)=>{
    console.log("logout from hi")
    console.log(req.user.email);
    const logoutUser = await user.findOneAndUpdate({email:req.user.email},{$set:{logged_in:false}},{new:true});
    console.log(logoutUser);
    if(!logoutUser){
        throw new customError("user not found",StatusCodes.NOT_FOUND);
    }
        res.clearCookie("token");
        res.json({msg: "logged out successfully"});
})
module.exports = {logout};