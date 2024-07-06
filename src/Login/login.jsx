
import goolgleLogo from "../assets/google_logo.png"
import {useState, useEffect, useRef} from "react";
import { createContext,useContext } from 'react';
export const FormContext = createContext(null);
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Audio } from 'react-loader-spinner';
import { AiFillGoogleCircle } from "react-icons/ai";
import "./login.css";
import getGoogleAuthURL from "../utils/GoogleAuthURL";


export const InputField = ({name,label,type,placeholder})=>{

    return(
    <div className="input-field">
        <p>{label}</p>
        <input type={type} name={name} placeholder={placeholder}></input>
    </div>
    )
}




function Form(props){
   const [formType,setformType] = useState(props.formType);
   const [formState,setformState] = useState("typing");
   const formDetails = useRef({name:"",username:"",emailID:"",password:"",confirmPassword:"",otp:""});
    const navigate = useNavigate();
    let redirectLink;
    let redirectPara;
    let formTitle;
    let buttonName;
    let formClassName = "form";
    if(formType.isSignUp){
        formTitle = "Sign Up"
        redirectLink = "/login";
        redirectPara = "Login here!";
        buttonName = "Sign Up";
        formClassName += "-signup";
    }else if(formType.isLogin){
        formTitle = "Login"
        buttonName = "Login";
        redirectPara= "Sign Up?";
        redirectLink = "/signup";
    }else if(formType.isOtp){
        formTitle = "OTP"
        buttonName = "Verify";
    }

    const makeRequest = (payload, url) => {
          setformState("loading");
          axios.post(url,payload,{
              withCredentials: true
          })
          .then(function (response) {
            console.log(response.data);
            setformState("typing");
            if(formType.isSignUp){
                setformType({isLogin:false,isSignUp:false,isOtp:true});
            }else if(formType.isLogin){
                navigate("/home");
            }else if(formType.isOtp){
                navigate("/login");
            }
          })
          .catch(function (error) {
            setformState("typing");
            alert(JSON.stringify(error));
          });
    }

    async function handleSubmit(event){
        event.preventDefault();

        if(formType.isLogin){
        console.log("Login");
        const emailID = event.target.elements.emailID.value;
        const password = event.target.elements.password.value;  
        formDetails.current = {...formDetails.current,username:emailID,email:emailID,password:password};
        makeRequest(formDetails.current,`${import.meta.env.VITE_BACKEND_SERVER_URI}/api/v1/login`);
        console.log(emailID,password);

        }else if(formType.isSignUp){
        console.log("Sign up");
        const emailID = event.target.elements.emailID.value;
        const password = event.target.elements.password.value;
        const confirmPassword = event.target.elements.confirmPassword.value;
        formDetails.current = {username:emailID,email:emailID,password:password,confirmPassword:confirmPassword};
    
        if(password!==confirmPassword){
            alert("Passwords do not match");
        }else{
            makeRequest(formDetails.current,`${import.meta.env.VITE_BACKEND_SERVER_URI}/api/v1/signup`);
        }

        // console.log(emailID,password,confirmPassword); 

        }else if(formType.isOtp){
        console.log("Otp");
        const otp = event.target.otp.value;
        console.log(otp);
        formDetails.current = {...formDetails.current,otp:otp};
        makeRequest(formDetails.current,`${import.meta.env.VITE_BACKEND_SERVER_URI}/api/v1/signup/verify`);
        
        }
        
    }

    useEffect(() => {
        //console.log(getGoogleAuthURL());
        if(formType.isOtp){
            document.querySelector('form').style.height = '300px';
        }else if(formType.isSignUp){
            document.querySelector('form').style.height = '450px';
        }else{
            document.querySelector('form').style.height = '400px';
        }
        
      });
    return (
        <>
            <form onSubmit={handleSubmit} >
                <p className="form-title">{formTitle}</p>
                {formType.isOtp && <InputField name="otp" label="Enter OTP :" type="password" placeholder="OTP here" />}
                {(formType.isLogin || formType.isSignUp) && <InputField name="emailID" label="E-mail ID :" type="text" placeholder="email-id" />}
                {(formType.isLogin || formType.isSignUp) && <InputField name="password" label="Password :" type="password" placeholder="password" />}
                {formType.isSignUp && <InputField name="confirmPassword" label="Confirm Password :" type="password" placeholder="confirm password" />}
                <p className="redirect-link"><a href={redirectLink}>{redirectPara}</a></p>
                <button className="form-button" type="submit">{buttonName}</button>
                { !formType.isOtp  &&
                <>
                    <p>or</p>
                    <a href={getGoogleAuthURL()} style={{textDecoration:"none",margin:'0px',padding:'0px'}}>
                    <div className="Oauth-button">
                    <AiFillGoogleCircle color="black" className="google-icon" />
                    <p style={{fontSize:"medium"}}>Login with Google</p>
                    </div>
                    </a>
                </> 
                }
                
            </form>
            <Audio
                visible={formState==="loading"}
                className="loader"
                height="80"
                width="80"
                radius="9"
                color="green"
                ariaLabel="three-dots-loading"
                // wrapperStyle
                // wrapperClass
            />
        </>
    )
}

export default Form
