import { useEffect, useState } from "react";
import DocCard from "./Card";
import AddCard from "./addCard";
import axios from "axios";
import DocCards from "./HomePage";
export default function RecentCards({refreshHomePage,cards}){
    if(cards.length>4){
        cards = cards.slice(0,4);
    }
    const CARDS = cards.map((card,index) =>{
                   
                    return (
                        <DocCard {...card} refreshHomePage={refreshHomePage} sharedUsers={card.shared_users} key={index}/>
                    )
        })
    
    return(
        <>
        <div className="recent-container">
            <AddCard />
            {CARDS}
        </div>
        </>
            
    )

    
}