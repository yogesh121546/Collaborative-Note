const {doc_map} = require('../docConfig');
module.exports = (io, socket) => {
    const changeScreenshot = (base64img) => {
            console.log("changed screenshot");
            doc_map.get(socket.data.room).base64img=base64img;
    }
    socket.on("change-screenshot", changeScreenshot);
  } 