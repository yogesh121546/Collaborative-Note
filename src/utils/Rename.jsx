import React, { useRef } from 'react';
import './rename.css'; 
import axios from 'axios';
import errorHandler from './errorhandler';

const Rename = ({ displayInfo,displayRename,id,title,refreshHomePage}) => {
    const newTitle = useRef(null);
    const handleDone = () => {
        const newtitle = newTitle.current.value;
        if(newtitle !=''){
            axios.post(`${import.meta.env.VITE_BACKEND_SERVER_URI}/api/v1/renameDocument`, { docId: id, title:newtitle },{withCredentials:true})
        .then((res)=>{
            console.log(res.data);
            displayRename();
            displayInfo();
            refreshHomePage();

        })
        .catch((err)=>{console.log(err); errorHandler(err)})
        }
        
    }
    return (
        <div className="rename-overlay">
            <div className="rename-box">
                <h2>Rename {title}</h2>
                <input ref={newTitle} type="text" placeholder="Enter new name" />
                <button onClick={handleDone}>Done</button>
            </div>
        </div>
    );
};

export default Rename;


