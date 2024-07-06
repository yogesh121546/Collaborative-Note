import React, { useState } from 'react';
import './HistoryLog.css'; // Optional: for styling
import { format } from 'date-fns';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './editor.css';
const HistoryLog = ({ logs }) => {
   const [showEditor, setShowEditor] = useState(false);
   const [value, setValue] = useState('');
function showEditHistory(index) {
  console.log('log data: ', logs[index].data);
  setShowEditor(true);
  setValue(logs[index].data);
}
  return (
    <>
        <div className="history-log"> 
          {logs.map((log, index) => (
            <ul key={index} onClick={() => showEditHistory(index)}>
              
              <p style={{fontSize:'large'}}>{`updated at: ${format(log.Date, 'dd/MM/yyyy HH:mm:ss')}`}</p>
              {log.user.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
                <hr style={{marginTop:'20px'}}/>
            </ul>
          ))}
        </div>
        {showEditor &&  <ReactQuill  style={{height:'550px',zIndex:'1000', position:'fixed', top:'100px', left:'50%',backgroundColor:'white', transform:'translateX(-50%)'}} className="quill" theme="snow"  value={value} />}
    </>
  );
};

export default HistoryLog;
