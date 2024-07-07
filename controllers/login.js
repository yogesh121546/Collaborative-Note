const async_wrapper = require("../middleware/async_wrapper");
const emailValidator = require('deep-email-validator');
const USER = require('../models/user');
const customError = require("../errors/custom-error");
const bcrypt = require('bcrypt');
const { StatusCodes } = require("http-status-codes");
const generateJwtToken = require("../utils/generateJWT");


const login = async_wrapper(async(req,res)=>{
    const {email,password} = req.body;
    const valid = await emailValidator.validate(email);
    console.log(valid);
    if(!valid){
        throw new customError("invalid email address",StatusCodes.BAD_REQUEST);
    }

    const userFound = await USER.findOneAndUpdate({email:email},{"$set":{"logged_in":true}});
    if(!userFound){
        console.log(!userFound);
        throw new customError("user not registered",StatusCodes.NOT_FOUND);
    }       
    if(userFound.pass_hash==(null||undefined)){
        throw new customError("sign in with google",StatusCodes.FORBIDDEN);
    }

    const isvalidPassword = await bcrypt.compare(password,userFound.pass_hash);
    if(!isvalidPassword){
        throw new customError("invalid password",StatusCodes.FORBIDDEN);
    }

    const user={
        email:email
        //more fields can be added
    }
    console.log(user) 
    const token = generateJwtToken(user);
    //console.log(token);
    res.cookie('token',token,{sameSite:"none",secure:true,expires:new Date(Date.now()+1000*60*60*24)});
    res.json({msg: "successful login and jwt token sent"});
})

module.exports = login;