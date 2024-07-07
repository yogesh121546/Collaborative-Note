const {doc_map} = require('../docConfig');
module.exports = (io, socket) => {
    const changeText = (data,docId) => {
            console.log("changed text")
            const DOC = doc_map.get(docId)
            DOC.data=data;
            // DOC.updated_at.push({Date:Date.now(),user:socket.data.email,lines:[]}); 
            if(socket.rooms.has(docId)){
              console.log(`message received from socket_id:${socket.id} to the room: ${docId}`);
              DOC.edit_history.set(socket.data.email,Date.now());
              console.log(DOC.edit_history);
              io.in(docId).emit("text-change",`socket_id:${socket.id} sent some message`,data,DOC.online_users);
            }else{ 
              socket.emit("connect_error",new Error("unauthorised access!"));
            } 
    }
    socket.on("text-change", changeText);
  } 