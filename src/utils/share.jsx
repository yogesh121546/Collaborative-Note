
import React,{useState,useEffect, useRef} from 'react'
import axios from 'axios'
import { HiOutlineTrash } from "react-icons/hi";
import './share.css'
import errorHandler from './errorhandler';

function ListItem(props) {

    const [accessType, setAccessType] = useState(props.accessType);


    function deleteUser() {
        axios.post(`${import.meta.env.VITE_BACKEND_SERVER_URI}/api/v1/removeSharedUser`, {docId:props.docId,username:props.user},{withCredentials:true})
        .then((res)=>{
            console.log(res.data);
            props.setPeopleWithAccess(res.data.peopleAccess)
        })
        .catch((err)=>{
            console.log(err);
            errorHandler(err);
        })
    }
    function handleAccessType(e) {
        setAccessType(e.target.value);
    }
    useEffect(() => {
        axios.post(`${import.meta.env.VITE_BACKEND_SERVER_URI}/api/v1/updateSharedAccessType`, {docId:props.docId,username:props.user,accessType:accessType},{withCredentials:true})
        .then((res)=>{
            console.log("changed user accesstype successfully",res.data);
        })
        .catch((err)=>{
            console.log(err);
            errorHandler(err);
        })
    }, [accessType]);
    
    return (
        <li>
            <p>{props.user}</p>
            <select value={accessType} onChange={handleAccessType}>
                <option value="viewer">viewer</option>
                <option value="editor">editor</option>
            </select>
            <hr style={{marginLeft:'13px'}}></hr>
            <HiOutlineTrash style={{marginTop:'auto',marginBottom:'auto',cursor:"pointer",width:"20px",height:"20px",marginLeft:"10px"}} onClick={deleteUser}/>
            
        </li>  
    )
}

export default function ShareBox({displayShare,displayInfo,docId,refreshHomePage}) {
    // {displayShare,displayInfo,docId,refreshHomePage}
    const usernameRef = React.useRef(null);
    const [accessType, setAccessType] = React.useState('viewer');
    const [showAccessType, setShowAccessType] = React.useState(false);
    const [peopleWithAccess, setPeopleWithAccess] = React.useState([]);
    const owner = useRef(null);
    useEffect(() => {

        axios.get(`${import.meta.env.VITE_BACKEND_SERVER_URI}/api/v1/document?docId=${docId}`,{withCredentials:true})
        .then((res )=>{
            console.log(res.data);
            let peopleAccess = res.data.shared_users;
            owner.current  = res.data.owner;
            console.log("people access",peopleAccess);
            setPeopleWithAccess(peopleAccess);
        }).catch(err =>{
            console.log(err);
            errorHandler(err);
        })

    },[]);


    function handleCopy() {
        console.log("copied");
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            alert('Link copied to clipboard!');
          }).catch(err => {
            console.error('Failed to copy: ', err);
          });
    }
    
    
    function handleAccessType(e) {
        console.log(e.target.value);
        setAccessType(e.target.value);
        
    }
    function handleDone(){
        console.log("done",accessType,usernameRef.current.value);
        const username = usernameRef.current.value;
        axios.post(`${import.meta.env.VITE_BACKEND_SERVER_URI}/api/v1/shareDocument`, {docId:docId,username:username,accessType:accessType},{withCredentials:true})
        .then((res)=>{
            console.log(res.data);
            displayShare();
            displayInfo();
            refreshHomePage();
        })
        .catch((err)=>{
            console.log(err);
            errorHandler(err);
            displayShare();
            displayInfo();
            refreshHomePage();
        })
    }   
        

    return (
        <div className="share-overlay">

        <div className="share-box">
            <div className="share-box-input">
                    <input ref={usernameRef} type="text" placeholder="write email-id here" />
                    <select value={accessType} onChange={handleAccessType}>
                        <option value="viewer">viewer</option>
                        <option value="editor">editor</option>
                    </select>
            </div>
            <div >
                <p className="share-box-p">People with access</p>
                <ul className="access-list">
                    <li>
                       <p>{owner.current}</p>
                       <div className="owner" style={{marginLeft:'auto'}}>owner</div>
                    </li>
                {peopleWithAccess.map((person,index) => {
                    return (
                        <ListItem setPeopleWithAccess={setPeopleWithAccess} key={index} docId={docId} user={person.user} accessType={person.accessType} />  
                    )
                })
                }
                </ul>
            </div>
            <div className="share-box-buttons-container">
                <button className="share-box-copy-button" onClick={handleCopy}>Copy link</button>
                <button className="share-box-done-button" onClick={handleDone}>Done</button>
            </div>
            
        </div>
        </div>
    )
}