// const { io } = require('socket.io-client');
//const socket = io("https://socket-implementation.onrender.com");

//some local variables;
let flag=0;
let timeout=[];
let i=0;
const DBSaveInterval=500;
let client_data=null;

//url path query parameters
const urlParams = new URLSearchParams(window.location.search);
const docId = urlParams.get('docId');
console.log({docId:docId}); 
console.log({cookie:document.cookie});

//socket connection to server
const socket = io("https://socket-implementation.onrender.com",{query:`${document.cookie}&docId=${docId}`}); 
//const socket = io("https://socket-implementation.onrender.com",{query:`${document.cookie}&docId=${docId}`}); 


//data to the server
const sendData =()=>{
  // const input = document.getElementById('w3review');
  // const position = input.selectionStart;
  // document.getElementById("position").innerText = position;
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  console.log(rect);
  client_data=document.getElementById("w3review").value;
  console.log("message sent to the room");
  socket.emit("message_sent",client_data,docId);
  i=0;
}

//data from the server 
socket.on("room-server",(message,data,metadata)=>{
  console.log(message); 
  if(metadata!=undefined){
    displayOnlineUser(metadata);
  }
  document.getElementById("w3review").value = data;
  
});

//erro handling 
socket.on("connect_error",(error)=>{
  console.log(error.message);
});

// send a message to the server on input activity delay of 300ms 
document.getElementById("w3review").oninput = function() {
  if(flag==0){
    flag=1;
  }
  else{
    clearTimeout(timeout[i-1])
  }
  timeout[i] = setTimeout(sendData,DBSaveInterval);
  i++;
};

document.getElementById("share_doc_add_button").addEventListener("click",function(){
  const email = document.getElementById("share_doc_input_text").value;
  socket.emit("share_doc",email,docId);
  console.log(`shared the doc with user:${email}`);
})

document.getElementById("sharedpng").addEventListener("click",function(){
  document.getElementsByClassName("share_doc_root")[0].style.display="block";
})

document.getElementsByClassName("cross_sign")[0].addEventListener("click",function(){
  document.getElementsByClassName("share_doc_root")[0].style.display="none";
})

function displayOnlineUser(metadata){
  const ul = document.getElementById("online_users_list");
  while (ul.firstChild) {
    ul.firstChild.remove()
  }
  metadata.online_users.forEach((element )=> {
    const li = document.createElement("li");
    // li.classList("online_user_li");
    li.innerText=element;
    ul.appendChild(li);
  });
}






  

