const USER = require('../models/user');
const OTP = require('../models/otp')
const bcrypt = require('bcrypt');
const async_wrapper = require('../middleware/async_wrapper');
const customError = require('../errors/custom-error');
const {StatusCodes} = require('http-status-codes');
const emailValidator = require('deep-email-validator');
const generateOtp = require('../utils/generateOTP');
const send_mail = require('../utils/nodemailer');


const signup = async_wrapper(async (req,res)=>{

    const {email} = req.body;
    const validEmail= await emailValidator.validate(email);
    if(!validEmail){
        throw new customError("invalid email address",StatusCodes.NOT_ACCEPTABLE);
    }
    const otp = generateOtp();
    const user = {
        email: email,
        otp_hash: await bcrypt.hash(otp,10)
    } 
    const alreadyuser = await USER.findOne({email:email});
    if(alreadyuser){
        // throw new customError("user already signed up",StatusCodes.EXPECTATION_FAILED);
        throw new customError("user already signed up",StatusCodes.EXPECTATION_FAILED);
    }

    await OTP.create(user);
  //  console.log({document:info});
    const mail = await send_mail(email,otp);
  //  console.log({mail:mail.envelope,otp:otp});
    res.status(StatusCodes.OK).json({msg: `otp sent to ${email}`,info:mail.messageId});

});  

const verify_otp = async_wrapper(async(req,res)=>{

    const {email,otp,password,username} = req.body;
    const Otp =  await OTP.findOne().sort({ field: 'asc', _id: -1 }).limit(1);
    if(!Otp){
        throw new customError(StatusCodes.BAD_REQUEST,StatusCodes.BAD_REQUEST);
    }
    const validOtp = await bcrypt.compare(otp,Otp.otp_hash);
    console.log(validOtp);
    if(!validOtp){
        throw new customError("invalid OTP",StatusCodes.FORBIDDEN);
    }
    const User = {
        email:email, 
        pass_hash: await bcrypt.hash(password,10),
        username:username
    }
    const userExist = await USER.findOne({email:email});
    if(userExist){
        throw  new customError("user already signed up",StatusCodes.EXPECTATION_FAILED);
    }
    const createUser = await USER.create(User);
    res.status(StatusCodes.CREATED).json({msg:"user signed up successfully", info: createUser});

})

module.exports= {signup,verify_otp}