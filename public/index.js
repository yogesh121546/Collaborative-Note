
console.log(document.getElementById("createdoc"));
document.getElementById('createdoc').addEventListener("click",async()=>{
    axios.defaults.withCredentials = true;
     const getDocId = await axios.get(`https://socket-implementation.onrender.com/api/v1/createDocument`,{withCredentials: true,crossDomain: true})
    //const getDocId = await axios.get(`https://socket-implementation.onrender.com/api/v1/createDocument`,{withCredentials: true,crossDomain: true})
    .then((res)=>res.data)
     .catch((err)=>{window.location.href=`https://socket-implementation.onrender.com/loginPage`});
    //.catch((err)=>{window.location.href=`https://socket-implementation.onrender.com/loginPage`});
    if(getDocId){
         window.location.href=`https://socket-implementation.onrender.com/api/v1/document?docId=${getDocId.document_id}`;
       // window.location.href=`https://socket-implementation.onrender.com/api/v1/document?docId=${getDocId.document_id}`;
    }
    
});