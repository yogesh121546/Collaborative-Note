require('dotenv').config();

const getGoogleAuthURL = ()=>{
   
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";

    const options = {
      redirect_uri: `${process.env.redirect_uri}/google/auth/callback`,
      client_id: process.env.googleClientId,
      access_type: "offline",
      response_type: "code",
      prompt: "consent",
      scope: [
        "email","profile",
        // "https://www.googleapis.com/auth/userinfo.profile",
        // "https://www.googleapis.com/auth/userinfo.email",
        // "https://openidconnect.googleapis.com/v1/userinfo",
      ].join(" "),
    };
  
    const qs = new URLSearchParams(options);
    const googleAuthURL = `${rootUrl}?${qs.toString()}`;
    console.log({googleAuthURL:`${rootUrl}?${qs.toString()}`});
    return googleAuthURL;
    
}
module.export= getGoogleAuthURL(); 