import Rename from "./Rename"
import { useState } from "react";
import ShareBox from "./share";
import axios from "axios";
export default function InfoCard({id,title,displayInfo,refreshHomePage}) {

    const [showRename, setShowRename] = useState(false)
    const [showShareBox, setshowShareBox] = useState(false);
   
   
    function rename(){
        setShowRename(!showRename)
        console.log("rename")
    
    }
    function Share(){
        console.log("share")
        setshowShareBox(!showShareBox);
        // handleShare();
     
    }
    function Delete(){
        axios.post(`${import.meta.env.VITE_BACKEND_SERVER_URI}/api/v1/deleteDocument`,{ docId: id},{withCredentials:true})
        .then((res )=>{
            console.log("deleted successfully",res.data);
            displayInfo();
            refreshHomePage();
        }).catch(err =>{
            console.log(err);
        })
    }
    return(
        <>
            <div className="info-card">
                <ul>
                    <li onClick={rename}>Rename</li>
                    <li onClick={Share}>Share</li>
                    <li onClick={Delete}>Delete</li>
                </ul>
            </div>
            {showShareBox && <ShareBox refreshHomePage={refreshHomePage} displayInfo={displayInfo} displayShare={Share} docId={id}  />}
            { showRename && <Rename refreshHomePage={refreshHomePage} displayInfo={displayInfo} displayRename={rename} id={id} title={title}/>}

        </>
    )
}