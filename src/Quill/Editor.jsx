

import React, { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './editor.css';
import QuillCursors from 'quill-cursors';
const { Quill } = ReactQuill;
import { io } from 'socket.io-client';
import debounce from 'lodash/debounce';

Quill.register('modules/cursors', QuillCursors);
const module = {
  cursors: {
      transformOnTextChange: false,
      selectionChangeSource: null
   }  
}
export default function Editor({Doc,displayEditor,displayError,initialData,users}) {
  console.log("editor rendered")
  const [ReadOnly, setReadOnly] = useState(false);
  
  
  const URL = undefined || `${import.meta.env.VITE_BACKEND_SERVER_URI}`;
  // const [searchParams] = useSearchParams();
  const urlParams = new URLSearchParams(window.location.search);
  const docId = urlParams.get('docId');
  const email = useRef(null);
  
  // console.log(socket.current.id);
  const [value, setValue] = useState(initialData);
  const quill_ref = React.useRef(null);
  const quill = useRef(null);
  const quill_cursor = useRef(null);
  const socket = useRef(null);
  const img_ref = useRef(null);

 
  const captureScreenshot = () => {
    html2canvas(img_ref.current).then(canvas => {
      const imgData = canvas.toDataURL('image/jpeg');
      socket.current.emit("change-screenshot",imgData);
    });
  };

  useEffect(() => {
    captureScreenshot();
    console.log("screenshot captured")
  },[value])
  
  const sendTextToServer = debounce((content,docId,email,editor) => {
    socket.current.emit("text-change",content,docId);
    socket.current.emit("cursor-change",email,editor.getSelection());
    console.log("debounced");
    setValue(content);
},300);

  // const sendScreenShotToServer = (docId,imgData) => {
  //   socket.current.emit("change-screenshot",imgData);
  // }

  function handleSelection (range, source, editor) {
    if(source === 'user'){
        socket.current.emit("cursor-change",email.current,range);
        console.log("cursor changed by user",range);
    }else{
        console.log("cursor changed by api",range);
    }
  }
 
  function handleTextChange (content, delta, source, editor) {
    if(source === 'user'){
      console.log("cursor changed by text change by user",editor.getSelection());
      sendTextToServer(content,docId,email.current,editor);
      // socket.current.emit("text-change",content,docId);
      // socket.current.emit("cursor-change",email.current,editor.getSelection());
      // setValue(content);
    }else{
        setValue(content);
    }
    
  }
  
  function updateCursor(cursor_id,range) {
    console.log("updated cursor successfully")
    quill_cursor.current.moveCursor(cursor_id,range );
  }
  

  useEffect(() => {
    
  socket.current = io(URL,{
    withCredentials: true,
    extraHeaders: {
      "docid": `${docId}`
    }
  })
        console.log("rendered")
        
        quill.current = quill_ref.current.getEditor();
        quill_cursor.current = quill.current.getModule('cursors');
        
        
          
          
        socket.current.on("connect", () => {
            console.log(`socket id: ${socket.current.id}`); 
        });

       
        socket.current.on("remove-cursor",(id)=>{
            quill_cursor.current.removeCursor(id);
        })
        
        socket.current.on("text-change",(message,data,onlineUsers)=>{
            // console.log(message,data,onlineUsers);
            users.current=onlineUsers;
            onlineUsers.forEach((element)=> {
                quill_cursor.current.createCursor(element.name,element.name, element.color);
            });
            console.log("cursor added: ",quill_cursor.current._cursors);
            setValue(data);
           
        })

        socket.current.on("cursor-change",(cursor_id,range)=>{
           console.log(cursor_id," changing from server request to ",range);
           if(cursor_id !== email.current){
              updateCursor(cursor_id,range);
              console.log("updated cursor position");
           }
           console.log(quill_cursor.current._cursors);
        })

        socket.current.on("set-user",(Email)=>{
          console.log("user set to ",Email)
           email.current = Email;
           const sharedUsers = Doc.shared_users;
           console.log("shared users: ",users);
           sharedUsers.forEach((element) => {
            if(element.user == email.current){
                if(element.accessType == "viewer"){
                  setReadOnly(true);
                  console.log("set to read only");
                }else{
                  setReadOnly(false);
                }
            }
           });
        })

        socket.current.on("connect_error",(error)=>{
          alert(error);
          displayEditor();
          displayError(error.message);

        });

        // return () => {
        //   socket.current.disconnect();
        //   email.current = null;
        // };
  },[])

  return (
    <>
    <div ref={img_ref} className='editor' >
        <ReactQuill ref={quill_ref} readOnly={ReadOnly} onChangeSelection={handleSelection} className="quill" theme="snow" modules={module} placeholder="Compose an epic..." value={value} onChange={handleTextChange} />
    </div>
    </>
    
  )
}

  

