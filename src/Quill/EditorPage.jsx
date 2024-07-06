import React, { useEffect, useRef, useState } from 'react';
import Editor from './Editor';
import Header from '../utils/Header';
import axios from 'axios';
export default function EditorPage(){
    const urlParams = new URLSearchParams(window.location.search);
    const docId = urlParams.get('docId');
    const DOC  = useRef(null);
    const users = useRef([]);
    const [showEditor, setShowEditor] = useState(true);
    const [errormessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);


    function displayEditor(){
        setShowEditor(!showEditor);
    }
    function displayError(msg){
        setErrorMessage(msg);
    }

    axios.get(`${import.meta.env.VITE_BACKEND_SERVER_URI}/api/v1/document?docId=${docId}`,{withCredentials:true})
        .then((res)=>{
           DOC.current = res.data;
           console.log(DOC.current.data_history);
           setLoading(true);
        })
        .catch((err)=>{
            if(err.response.status === 401){
                alert("You are not allowed to access this document.");
                window.location.href = "/home";
                
            }else if(err.response.status === 403){
                alert("Session expired. Please login again.");
                window.location.href = "/login";
            }
        });

    if(!loading) return (<h1 style={{textAlign:"center"}}>Loading...</h1>);
   
    return(
        <>
        {showEditor && <><Header users={users}logs={DOC.current.data_history} title={DOC.current.title} /><Editor users={users} Doc={DOC.current} initialData={DOC.current.data} displayEditor={displayEditor} displayError={displayError}/></>}
        {!showEditor && <h1 style={{textAlign:"center"}}>{errormessage}</h1>}
        {/* <HistoryLog logs={data_history}/> */}
        </>
    )

}