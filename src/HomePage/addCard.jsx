
import plusLogo from "../assets/plus_logo.jpg"
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import errorHandler from "../utils/errorhandler";

export default function AddCard(){
    const navigate = useNavigate();
    function handleClick(){
        console.log("new document created");
        axios.defaults.withCredentials = true;
        axios(`${import.meta.env.VITE_BACKEND_SERVER_URI}/api/v1/createDocument`, {
            method: 'GET',
            withCredentials: true
        }).then(res => {
            console.log(res);
            navigate(`/editor?docId=${res.data.document_id}`);
        }).catch(err => {
            console.log(err);
            errorHandler(err);
        })
    }
    return(
        <>
            <div className="card" onClick={handleClick}>
                <img src={plusLogo} className="card-main-image"/>
                <div className="card-details-container">
                    <p style={{fontSize:"large"}}>Create new Note</p>
                </div>
                {/* {<Rename/>} */}
            </div>
        
        </>
    )
}