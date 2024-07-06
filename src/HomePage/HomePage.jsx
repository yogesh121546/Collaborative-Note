import DocCards from "./DocCards";
import RecentCards from "./Recents";
import Header from "../utils/Header";
import axios from "axios";
import { useState,useEffect,useRef } from "react";
import DocCard from "./Card";
import errorHandler from "../utils/errorhandler";

export default function HomePage(){
    
    const [cards,setCards] = useState([]);
    const showOtherDocs = useRef(false);
    const [refresh,setRefresh] = useState(false);
    
    function refreshHomePage(){
        setRefresh(!refresh);
    }
    console.log(cards);
    if(cards.length > 4){
        showOtherDocs.current = true;
    }else{
        showOtherDocs.current = false;
    }
    useEffect(() => {
        
        console.log("get recent docs");
        axios.get(`${import.meta.env.VITE_BACKEND_SERVER_URI}/api/v1/getUserDocs`,{withCredentials:true})
        .then((res )=>{
            console.log(res.data);
            setCards(res.data);
        }).catch(err =>{
            console.log(err);
            errorHandler(err);
        })
    },[refresh]);

    return(
        <>
            <Header />
            <RecentCards refreshHomePage={refreshHomePage} cards={cards}/>
            {showOtherDocs.current && <DocCards refreshHomePage={refreshHomePage} cards={cards}/>}
        </>
    )
}


