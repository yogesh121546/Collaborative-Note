

console.log(document.getElementById("email"));
console.log(document.getElementById("password"));
 //const url= "https://socket-implementation.onrender.com"; 
  const url= "https://socket-implementation.onrender.com"; 
document.getElementById("submit").addEventListener("click",()=>{
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
     axios.post(`${url}/api/v1/login`,{email:email,password:password})
          .then((res)=>{
            console.log(res.data); 
            window.location.href=url;
            })
          .catch((err)=>console.log(err));

})