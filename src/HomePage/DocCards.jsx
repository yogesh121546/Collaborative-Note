import DocCard from "./Card";


export default function DocCards({refreshHomePage,cards}){

     cards = cards.slice(4);
     const CARDS = cards.map(card =>{
         return (
             <>
             <DocCard {...card} refreshHomePage={refreshHomePage} sharedUsers={card.shared_users} key={card._id}/>
             </>
         )
     })
 
     return(
         <>
             <div className="cards-container">
             {CARDS}
             </div>
             
         </>
     )
 
     
 }