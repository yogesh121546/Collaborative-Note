


export default function getGoogleAuthURL(){
  console.log("getGoogleAuthURL");
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";

    const options = {
      redirect_uri: `${import.meta.env.VITE_BACKEND_SERVER_URI}/google/auth/callback`,
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
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
