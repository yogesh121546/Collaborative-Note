//npm dependencies
const express = require('express');
const http = require('http');
const cookieParser = require('cookie-parser');
const socketIO = require('socket.io');
const cors = require('cors');
require('dotenv').config();

//functions
const {getToken} = require('./utils/getGoogleAuthToken')
const connectDB = require('./db/connect');
const router = require('./routes/routes');
const notFound = require('./middleware/notfound');
const errorHandler = require('./middleware/errorhandler');
//const authenticateToken = require('./middleware/jwtAuth');
const authenticateToken = require('./socketio/middleware')

//server initialization 
const app = express();  
const server = http.createServer(app);
module.exports = io = socketIO(server,{cors:{ 
  // origin:'*', 
  origin: process.env.FRONT_END_URI,
  // extended:true,
  methods: ["GET", "POST"],
  allowedHeaders: ["docid", "Content-Type", "Authorization","cookie"],
  credentials: true
}
});



const CursorHandler = require('./socketio/controller/cursor');
const TextHandler = require('./socketio/controller/text');
const disConnectHandler = require('./socketio/controller/disconnect');
const ScreenShotHandler = require('./socketio/controller/screenshot');


io.engine.use(cookieParser()); 
io.use(authenticateToken);

// io.engine.use(authenticateToken);

//const {onConnection} = require('./socketio/controller/connect');  
const onConnection = (socket) => {
  // console.log(socket.handshake.headers);
  const connected_clients = io.sockets.adapter.rooms.get(socket.data.room).size; 
  console.log(`clients connected: ${connected_clients}`);
  console.log(`A new client connected with socket id: ${socket.id} to room: ${socket.data.room}`)
  CursorHandler(io, socket);
  TextHandler(io,socket); 
  disConnectHandler(io,socket); 
  ScreenShotHandler(io,socket)
} 

io.on("connection", onConnection);    

 
app.use(cookieParser());
app.use(express.json());
app.use(cors({ 
origin: process.env.FRONT_END_URI,
 methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
 allowedHeaders: ['Content-Type', 'Authorization','cookie'],
  credentials: true ,// Allow credentials (cookies, authorization headers, etc.)
  SameSite: 'none'
})); 
 

// route specific middlewares

app.use('/api/v1',router);
app.get('/google/auth/callback',getToken);
app.use(notFound);  
app.use(errorHandler);      


// Start the server 
const port = 4000||process.env.PORT; 
const start_server = async()=>{
  try{ 
      await connectDB(process.env.MONGO_URI); 
      server.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
      });
  }catch(error){
    console.log(error.message); 
  }
}
start_server(); 

   