const async_wrapper = require("../middleware/async_wrapper");
const USER = require('../models/user');
const generateJwtToken = require("../utils/generateJWT");
const axios = require('axios');
require('dotenv').config();



const getToken = async_wrapper(async (req,res)=>{

    console.log({authorisationCode: req.query.code});
        console.log(req.query.code);
        const url = "https://accounts.google.com/o/oauth2/token";
        const values = {
          code:req.query.code,
          client_id: process.env.googleClientId,
          client_secret: process.env.googleClientSecret,
          redirect_uri: `${process.env.redirect_uri}/google/auth/callback`, 
          grant_type: "authorization_code",
        };
        const qs = new URLSearchParams(values);
        console.log(qs.toString());    
        const {id_token,access_token} = await 
        axios
        .post(url, qs.toString(), {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        })
        .then((res) => (res.data))
        .catch((error) => { 
          console.error(`Failed to fetch auth tokens`);
          throw new Error(error.message);
        });

        console.log({id_token:id_token,access_token:access_token});
//
        const googleUser = await 
        axios
        .get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
            {
                headers: {
                    Authorization: `Bearer ${id_token}`,
                },
            }
        )
        .then((res) => res.data)
        .catch((error) => {
        console.error(`Failed to fetch user`);
        throw new Error(error.message);
        });
    console.log(googleUser);
    //check if user exists in database
    const User = {
        email:googleUser.email,
        logged_in:true
    }
    const userExist = await USER.findOne({email:googleUser.email});
    const token = generateJwtToken(User);
    if(userExist){
      userExist.logged_in = true;
      await userExist.save();
      return res.cookie('token',token,{sameSite:"none", httpOnly: true,secure:true,expires:new Date(Date.now()+1000*60*60*24)})
                .redirect(`${process.env.FRONT_END_URI}/home`);
      
    } 
    const userCreated = await USER.create(User);
    res.cookie('token',token,{sameSite:"none", httpOnly: true,secure:true,expires:new Date(Date.now()+1000*60*60*24)})
       .redirect(`${process.env.FRONT_END_URI}/home`);
  
    
    // res.json({msg:"login successfully"});
    
})
module.exports = {getToken}; 