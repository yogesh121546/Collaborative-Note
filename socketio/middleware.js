

const {doc_map, color_palatte} = require('./docConfig');

const { StatusCodes,ReasonPhrases } = require("http-status-codes");
const customError = require("../errors/custom-error");
const async_wrapper = require("../middleware/async_wrapper");
const USER = require('../models/user'); 
const Document = require('../models/document'); 
const jwt = require('jsonwebtoken');
require('dotenv').config(); 




const authenticateToken = async(socket,next)=>{
    try{
        console.log("hello");
        const {token} = socket.request.cookies;
        console.log("socket token",token);
        if(token == null || token==undefined){  
            throw new customError("signin",StatusCodes.FORBIDDEN);
        } 
        const user = jwt.verify(token,process.env.JWT_SECRET);
        const ValidUser = await USER.findOne({email:user.email});
        if(!ValidUser){
            throw new customError("sigin",StatusCodes.FORBIDDEN);
        }
        const DOCUMENT = await Document.findOne(
            {
                $and:[
                    {  _id : socket.handshake.headers['docid']},
                    {   $or:[
                            {shared_users: 
                                {
                                    $elemMatch: {
                                        user: user.email
                                    }  
                                } 
                            },
                            {owner:user.email},
                        ]
                    },
                ]  
            }
        )
        if(!DOCUMENT){
            throw new customError("unauthorised",StatusCodes.UNAUTHORIZED);
        }
        socket.join(socket.handshake.headers['docid']);
        socket.data.room=socket.handshake.headers['docid']; 
        socket.data.email=user.email;
        socket.data.color = "blue";
        socket.emit("set-user",user.email);
        const connected_clients = io.sockets.adapter.rooms.get(socket.data.room).size;
        if(connected_clients==1){
            console.log("created doc storage")
            doc_map.set(socket.data.room,DOCUMENT);
            doc_map.get(socket.data.room).online_users=[];
            doc_map.get(socket.data.room).edit_history= new Map();
            console.log(doc_map.get(socket.data.room));
        }
        const DOC = doc_map.get(socket.data.room);
        let findDoc = DOC.online_users.find((o, i) => {
            // const cursor_color = color_palatte[DOC.online_users.length % color_palatte.length];
            if (o.name === socket.data.email) {
                DOC.online_users[i] = { socketId: socket.id, name: socket.data.email, color: o.color, range:o.range };
                return true; // stop searching
            } 
            // if(i==DOC.online_users.length-1) return false;
        }); 
        if(!findDoc){
            console.log(DOC.online_users.length,"---------------------------------")
            const cursor_color = color_palatte[DOC.online_users.length % color_palatte.length];
            DOC.online_users.push({
                socketId: socket.id,
                name: socket.data.email,
                color: cursor_color,
                range:null
            })
        }
        
        socket.emit("text-change","loaded the document",DOC.data,DOC.online_users);
        io.to(socket.data.room).emit("text-change",`socket_id:${socket.id} joined the room:${socket.data.room}`,DOC.data,DOC.online_users);
        next(); 

    }catch(err){
        console.log(err.message);
        next(err);
    }
      
}


module.exports = authenticateToken;

