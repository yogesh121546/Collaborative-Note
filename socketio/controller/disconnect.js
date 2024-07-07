const {doc_map} = require('../docConfig');
const DOCUMENT = require('../../models/document');
const {cloudinary} = require('../../utils/cloudinary');
module.exports = (io, socket) => {
    const onDisconnection = async(reason) => {

        if(!io.sockets.adapter.rooms.has(socket.data.room)){
            //sendData to the server
            
            const users_history = [...doc_map.get(socket.data.room).edit_history.keys()];
            console.log("users_history : ",users_history);
            
            if(users_history.length > 0){
                const result = await cloudinary.uploader.upload(doc_map.get(socket.data.room).base64img, {
                    resource_type: 'image',
                    public_id: socket.data.room, 
                    overwrite: true
                  });
                  console.log(result);
                const update = {
                    data: doc_map.get(socket.data.room).data,
                    last_modified: new Date(),
                    img_url: result.secure_url,
                    $push: {
                        data_history: {
                            date: new Date(),
                            user: users_history,
                            data: doc_map.get(socket.data.room).data
                        }
                    }
                }
                const updatedoc = await DOCUMENT.findOneAndUpdate({_id:socket.data.room},update);
                console.log("doc updated",JSON.stringify(updatedoc));
            }

            doc_map.delete(socket.data.room);
            console.log(doc_map);
            console.log("deleted doc storage");
            //console.log(doc_storage);
            return console.log({room:socket.data.room,clients_connected:0});
           }
           const size = io.sockets.adapter.rooms.get(socket.data.room).size;
           const DOC = doc_map.get(socket.data.room);
           let filteredUsers = DOC.online_users.filter((user) => {
            return user.socketId !== socket.id;
           });
           DOC.online_users = filteredUsers;
           console.log(DOC.online_users);
           io.in(socket.data.room).emit("remove-cursor",socket.data.email);
           io.in(socket.data.room).emit("text-change",`socket_id:${socket.id} left the room:${socket.data.room}`,DOC.data,DOC.online_users);            
           console.log(`clients connected after disconnection: ${size}`);
    }
    socket.on("disconnect", onDisconnection);
}
    
  