
const generateOtp =()=>{
    let otp = Math.ceil(Math.random()*10000);
    if(otp<1000)
        return (otp+1000).toString();
    return otp.toString(); 
} 

module.exports= generateOtp;            