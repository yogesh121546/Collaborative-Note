
import { useState } from "react";
import "./card.css"
import fileLogo from "../assets/file_icon.png"
import InfoCard from "../utils/info";
import infoLogo from "../assets/info.png"
import sharedLogo from "../assets/shared_user.jpg"
import ShareBox from "../utils/share.jsx"
import { useNavigate } from "react-router-dom";
import { FiFileText } from "react-icons/fi";
import { format } from 'date-fns';
export default function DocCard({_id,sharedUsers,last_modified,shared,data,data_history,title,img_url,refreshHomePage}){
   
    console.log(sharedUsers);
    const navigate = useNavigate();
    const [showInfo, setshowInfo] = useState(false);
    const imageUrl = img_url||fileLogo;
    const formattedDate = format(last_modified, 'dd/MM/yyyy HH:mm:ss');
    function displayInfo(){
        setshowInfo(!showInfo);
    }
    function displayEditorPage(){
        navigate(`/editor?docId=${_id}`);
    }




    return(
        <>
            <div className="card" >
                <img className="card-main-image"src={imageUrl} onClick={displayEditorPage} alt="hello"/>
                <p className="card-main-title">{title}</p>
                <div className="card-details-container">
                    <img className="card-logo"src={fileLogo} alt="hello"/>
                    {(sharedUsers.length!=0) && <img className="card-shared-logo"src={sharedLogo} alt="hello"/>}
                    <p style={(sharedUsers.length!=0)?{maxWidth:110}:{maxWidth:140}}>{`last modified: ${formattedDate}`}</p>
                    <img className="card-options-logo"src={infoLogo} alt="hello"  onClick={displayInfo}/>
                </div>
                {showInfo && <InfoCard refreshHomePage={refreshHomePage} shared_users={sharedUsers} id={_id} title={title} displayInfo={displayInfo}/>}
            </div>
        </>
    )
}