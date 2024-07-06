import React, { useState, useEffect, useCallback } from 'react';
import './Header.css';
import { FaHome, FaShareAlt, FaHistory } from 'react-icons/fa';
import { debounce } from 'lodash';
import axios from 'axios';
import { HiUser, HiUserCircle } from "react-icons/hi2";
import ShareBox from './share';
import HistoryLog from '../Quill/HistoryLog';
import OnlineUsers from '../Quill/OnlineUsers';
import errorHandler from './errorhandler';
import UserMenu from './userMenu';
const Header = ({title,logs,users}) => {
  const [showShareBox, setshowShareBox] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  
  function displayShare(){
    console.log("share")
    setshowShareBox(!showShareBox);
 }
 const toggleHistory = () => {
  setShowHistory(!showHistory);
};
  // title = title || 'Collaborative-Note';
  const [inputValue, setInputValue] = useState('');
  const urlParams = new URLSearchParams(window.location.search);
  const docId = urlParams.get('docId');
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const debouncedHandleInputChange = useCallback(
    debounce((value) => {
      if(value!==''){
        axios.post(`${import.meta.env.VITE_BACKEND_SERVER_URI}/api/v1/renameDocument`, { docId: docId, title:value },{withCredentials:true})
        .then((res)=>{
            console.log("doc renamed successfully",res.data);
        })
        .catch((err)=>{console.log(err);errorHandler(err)})
      }
    }, 500),
    []
  );

  useEffect(() => {
    debouncedHandleInputChange(inputValue);
    // Cleanup function to cancel debounce on unmount
    return () => {
      debouncedHandleInputChange.cancel();
    };
  }, [inputValue, debouncedHandleInputChange]);


  return (
    <>
    <header className="header">
       <div className="header-left">
       <a href={`${import.meta.env.VITE_FRONTEND_URI}/home`}><FaHome className="icon" /></a> 
      </div>
      <div className="header-center">
        {(title==undefined) ? <h1 className="title">Collaborative-Note</h1> : <input type="text" className="input-box" onChange={handleInputChange} placeholder={title}/>}
      </div>
      <div className="header-right"> 
        {(title!=undefined) && <OnlineUsers users={users} />}
        {(title!=undefined) && <FaShareAlt className="icon" onClick={displayShare} />}
        {(title!=undefined) && <FaHistory className="icon" onClick={toggleHistory} />}
        {(title==undefined) && <UserMenu />}
      </div>
    </header>
    {showShareBox && <ShareBox refreshHomePage={()=>{}} displayInfo={()=>{}} displayShare={displayShare} docId={docId} />}
    {showHistory && <HistoryLog logs={logs} />}
    
    </>
  );
}

export default Header;
