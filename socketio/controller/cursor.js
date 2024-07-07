
const {doc_map} = require('../docConfig');
module.exports = (io, socket) => {
    const changeCursor = (cursor_id,range) => {
      const DOC = doc_map.get(socket.data.room)
      DOC.online_users = DOC.online_users.map((cursor)=>{  
        if(cursor.name === cursor_id){cursor.range = range;}
        return cursor;  
      }) 
      console.log(DOC.online_users); 
      io.in(socket.data.room).emit("cursor-change",cursor_id,range);  
    }
  
    
    // socket.on("add-cursor", createOrder);
    socket.on("cursor-change", changeCursor);
  }